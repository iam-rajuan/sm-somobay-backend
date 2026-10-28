import { Router } from 'express';
import healthRoutes from './health.routes';

const rootRouter = Router();

// Base Health Check Route
rootRouter.use('/health', healthRoutes);

// Module route mountpoints ready for Phase 2:
// rootRouter.use('/auth', authRoutes);
// rootRouter.use('/dashboard', dashboardRoutes);
// rootRouter.use('/members', memberRoutes);
// rootRouter.use('/savings', savingsRoutes);
// rootRouter.use('/loans', loanRoutes);
// rootRouter.use('/dps', dpsRoutes);
// rootRouter.use('/fdr', fdrRoutes);
// rootRouter.use('/shares', shareRoutes);
// rootRouter.use('/collections', collectionRoutes);
// rootRouter.use('/vouchers', voucherRoutes);
// rootRouter.use('/payroll', payrollRoutes);
// rootRouter.use('/reports', reportRoutes);
// rootRouter.use('/setup', setupRoutes);

export default rootRouter;

