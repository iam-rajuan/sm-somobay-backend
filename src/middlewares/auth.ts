import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { sendError } from '../utils/apiResponse';

export interface UserTokenPayload {
  id: string;
  username: string;
  role: 'SUPER_ADMIN' | 'BRANCH_MANAGER' | 'FIELD_OFFICER' | 'MEMBER';
  branchId?: string;
  accountNo?: string;
}

export interface AuthRequest extends Request {
  user?: UserTokenPayload;
}

export const authenticateJWT = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendError(res, 'Access denied. No authorization token provided.', 401);
    return;
  }

  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET || 'super_secret_somity_jwt_key_2026_change_in_production';

  try {
    const decoded = jwt.verify(token, secret) as UserTokenPayload;
    req.user = decoded;
    next();
  } catch {
    sendError(res, 'Invalid or expired token.', 401);
    return;
  }
};

export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      sendError(res, 'Access forbidden: insufficient role permissions.', 403);
      return;
    }
    next();
  };
};

