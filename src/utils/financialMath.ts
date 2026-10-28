/**
 * Somity Hisab — Financial Math & Core Accounting Calculation Helpers
 * Implemented directly from resources/Samity_Hisab_Reverse_Engineering_Specification.md
 */

export interface LoanAmortizationInput {
  principalAmount: number;
  interestRatePercentage: number;
  installmentCount: number;
  installmentFrequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
}

export interface LoanAmortizationResult {
  principal: number;
  interestRate: number;
  profitAmount: number;
  totalPayable: number;
  installmentAmount: number;
  installments: Array<{
    sequence: number;
    installmentAmount: number;
    principalPortion: number;
    profitPortion: number;
  }>;
}

/**
 * Calculates Loan Amortization: Total Amount = P + I, Installment Amount = T / N
 * Bidirectional Profit % <-> Taka calculation
 */
export function calculateLoanAmortization(input: LoanAmortizationInput): LoanAmortizationResult {
  const { principalAmount, interestRatePercentage, installmentCount } = input;
  
  const principal = Math.max(0, principalAmount);
  const profitAmount = Math.round((principal * (interestRatePercentage / 100)) * 100) / 100;
  const totalPayable = principal + profitAmount;
  const installmentAmount = installmentCount > 0 ? Math.round((totalPayable / installmentCount) * 100) / 100 : 0;

  const installments = [];
  for (let seq = 1; seq <= installmentCount; seq++) {
    // Proportional Split: Principal Split = round(C * P / T, 2), Profit Split = C - Principal Split
    const principalPortion = totalPayable > 0 ? Math.round(((installmentAmount * principal) / totalPayable) * 100) / 100 : 0;
    const profitPortion = Math.round((installmentAmount - principalPortion) * 100) / 100;

    installments.push({
      sequence: seq,
      installmentAmount,
      principalPortion,
      profitPortion,
    });
  }

  return {
    principal,
    interestRate: interestRatePercentage,
    profitAmount,
    totalPayable,
    installmentAmount,
    installments,
  };
}

/**
 * Proportional Loan Installment Splitting for incoming collection amount C:
 * Principal Split = round(C * P / T, 2)
 * Profit Split = C - Principal Split
 */
export function splitLoanCollection(
  collectionAmount: number,
  originalPrincipal: number,
  originalTotalPayable: number
): { principalSplit: number; profitSplit: number } {
  if (originalTotalPayable <= 0) {
    return { principalSplit: collectionAmount, profitSplit: 0 };
  }
  const principalSplit = Math.round(((collectionAmount * originalPrincipal) / originalTotalPayable) * 100) / 100;
  const profitSplit = Math.round((collectionAmount - principalSplit) * 100) / 100;
  return { principalSplit, profitSplit };
}

/**
 * DPS Maturity Calculation:
 * Total Deposit = monthlyAmount * termMonths
 * Total Profit = totalDeposit * (profitRatePercentage / 100)
 * Maturity Amount = Total Deposit + Total Profit
 */
export function calculateDPSMaturity(
  monthlyAmount: number,
  termMonths: number,
  profitRatePercentage: number
): { totalDeposit: number; totalProfit: number; maturityAmount: number } {
  const totalDeposit = monthlyAmount * termMonths;
  const totalProfit = Math.round(((totalDeposit * profitRatePercentage) / 100) * 100) / 100;
  const maturityAmount = totalDeposit + totalProfit;
  return { totalDeposit, totalProfit, maturityAmount };
}

/**
 * FDR Calculation:
 * Monthly Profit = (principal * (annualRatePercentage / 100)) / 12
 * Total Profit at Maturity = monthlyProfit * (durationYears * 12)
 */
export function calculateFDRProfit(
  principal: number,
  annualRatePercentage: number,
  durationMonths: number
): { monthlyProfit: number; totalProfit: number; maturityAmount: number } {
  const monthlyProfit = Math.round(((principal * (annualRatePercentage / 100)) / 12) * 100) / 100;
  const totalProfit = Math.round(monthlyProfit * durationMonths * 100) / 100;
  const maturityAmount = principal + totalProfit;
  return { monthlyProfit, totalProfit, maturityAmount };
}

/**
 * Staff Salary Net Payable Calculation:
 * Payable = Basic + Others - Deduction - PF
 */
export function calculateStaffPayableSalary(params: {
  basicSalary: number;
  houseRent?: number;
  medicalAllowance?: number;
  conveyance?: number;
  otherAllowance?: number;
  deduction?: number;
  providentFund?: number;
}): { grossSalary: number; totalDeduction: number; netPayable: number } {
  const basic = params.basicSalary || 0;
  const allowances =
    (params.houseRent || 0) +
    (params.medicalAllowance || 0) +
    (params.conveyance || 0) +
    (params.otherAllowance || 0);
  const grossSalary = basic + allowances;
  const totalDeduction = (params.deduction || 0) + (params.providentFund || 0);
  const netPayable = Math.max(0, grossSalary - totalDeduction);

  return { grossSalary, totalDeduction, netPayable };
}

