/**
 * Real Estate Investment Calculator - Core Formulas
 * All calculations use decimal format internally (e.g., 0.05 = 5%)
 */

export interface Inputs {
  purchasePrice: number;
  downPercent: number;      // decimal: 0.05 = 5%
  closingCosts: number;
  rehabCosts: number;
  interestRate: number;      // decimal: 0.06625 = 6.625%
  amortYears: number;
  monthlyRent: number;
  vacancyRate: number;       // decimal: 0.05 = 5%

  // Expense mode toggle
  useDetailedExpenses: boolean;

  // Simple mode (single field)
  monthlyOpEx: number;

  // Detailed mode (itemized expenses)
  propertyTaxes: number;        // monthly
  insurance: number;            // monthly
  repairs: number;              // monthly
  propertyMgmtPercent: number;  // decimal: 0.10 = 10% of rent
  capexReserves: number;        // monthly
  hoaFees: number;              // monthly

  rentGrowthRate: number;    // decimal: 0.02 = 2%
  appreciationRate: number;  // decimal: 0.03 = 3%
  marketTrendAdjustment: number;  // decimal: 0.005 = 0.5%
  locationScore: number;     // 1-10
}

export interface RefiInputs {
  enabled: boolean;
  newLoanAmount: number;
  newRate: number;           // decimal: 0.055 = 5.5%
  newTermYears: number;
  closingCosts: number;
}

/**
 * Calculate monthly mortgage payment using standard amortization formula
 */
export function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  years: number
): number {
  if (principal <= 0 || years <= 0) return 0;
  if (annualRate === 0) return principal / (years * 12);

  const monthlyRate = annualRate / 12;
  const numPayments = years * 12;

  return (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
    (Math.pow(1 + monthlyRate, numPayments) - 1);
}

/**
 * Calculate total monthly operating expenses
 * Uses either simple mode (single monthlyOpEx) or detailed mode (itemized expenses)
 */
export function calculateMonthlyOpEx(inputs: Inputs): number {
  if (!inputs.useDetailedExpenses) {
    return Number(inputs.monthlyOpEx) || 0;
  }

  // Detailed mode: sum all itemized expenses
  const propertyTaxes = Number(inputs.propertyTaxes) || 0;
  const insurance = Number(inputs.insurance) || 0;
  const repairs = Number(inputs.repairs) || 0;
  const capexReserves = Number(inputs.capexReserves) || 0;
  const hoaFees = Number(inputs.hoaFees) || 0;

  // Property management is a percentage of rent
  const monthlyRent = Number(inputs.monthlyRent) || 0;
  const propertyMgmtPercent = Number(inputs.propertyMgmtPercent) || 0;
  const propertyMgmt = monthlyRent * propertyMgmtPercent;

  return propertyTaxes + insurance + repairs + capexReserves + hoaFees + propertyMgmt;
}

/**
 * Calculate core investment metrics
 */
export function compute(inputs: Inputs) {
  // Ensure all inputs are numbers
  const purchasePrice = Number(inputs.purchasePrice) || 0;
  const downPercent = Number(inputs.downPercent) || 0;
  const closingCosts = Number(inputs.closingCosts) || 0;
  const rehabCosts = Number(inputs.rehabCosts) || 0;
  const interestRate = Number(inputs.interestRate) || 0;
  const amortYears = Number(inputs.amortYears) || 30;
  const monthlyRent = Number(inputs.monthlyRent) || 0;
  const vacancyRate = Number(inputs.vacancyRate) || 0;

  // Calculate cash invested
  const downPayment = purchasePrice * downPercent;
  const cashInvested = downPayment + closingCosts + rehabCosts;

  // Calculate loan details
  const loanAmount = purchasePrice - downPayment;
  const monthlyPmt = calculateMonthlyPayment(loanAmount, interestRate, amortYears);

  // Calculate cash flow using helper function for expenses
  const monthlyOpEx = calculateMonthlyOpEx(inputs);
  const effectiveRent = monthlyRent * (1 - vacancyRate);
  const monthlyNOI = effectiveRent - monthlyOpEx;
  const monthlyCF = monthlyNOI - monthlyPmt;
  const annualCF = monthlyCF * 12;

  // Calculate cash-on-cash return
  const cashOnCash = cashInvested > 0 ? annualCF / cashInvested : 0;

  return {
    cashInvested,
    monthlyPmt,
    annualCashFlow: annualCF,
    cashOnCash,
  };
}

/**
 * Calculate refinance metrics
 */
export function computeRefi(currentPmt: number, refi: RefiInputs) {
  if (!refi.enabled) return null;

  const newPmt = calculateMonthlyPayment(
    Number(refi.newLoanAmount) || 0,
    Number(refi.newRate) || 0,
    Number(refi.newTermYears) || 30
  );

  const monthlySavings = currentPmt - newPmt;
  const closingCosts = Number(refi.closingCosts) || 0;
  const breakEvenMonths = monthlySavings > 0 ? closingCosts / monthlySavings : Infinity;

  return {
    newPmt,
    monthlySavings,
    breakEvenMonths,
  };
}

/**
 * Generate amortization schedule with cash flows
 */
export function amortizationSchedule(
  inputs: Inputs,
  years: number = 10
): Array<{ year: number; balance: number; cashFlow: number }> {
  const purchasePrice = Number(inputs.purchasePrice) || 0;
  const downPercent = Number(inputs.downPercent) || 0;
  const interestRate = Number(inputs.interestRate) || 0;
  const amortYears = Number(inputs.amortYears) || 30;
  const monthlyRent = Number(inputs.monthlyRent) || 0;
  const vacancyRate = Number(inputs.vacancyRate) || 0;
  const rentGrowthRate = Number(inputs.rentGrowthRate) || 0;

  const loanAmount = purchasePrice * (1 - downPercent);
  const monthlyRate = interestRate / 12;
  const totalMonths = amortYears * 12;
  const monthlyPmt = calculateMonthlyPayment(loanAmount, interestRate, amortYears);

  const schedule: Array<{ year: number; balance: number; cashFlow: number }> = [];
  let currentRent = monthlyRent;

  for (let year = 0; year <= years; year++) {
    const monthsPassed = Math.min(year * 12, totalMonths);

    // Calculate remaining balance
    let balance = 0;
    if (monthsPassed < totalMonths && monthlyRate > 0) {
      balance = loanAmount * Math.pow(1 + monthlyRate, monthsPassed) -
        monthlyPmt * (Math.pow(1 + monthlyRate, monthsPassed) - 1) / monthlyRate;
    }
    balance = Math.max(0, balance); // Ensure non-negative

    // Calculate annual cash flow for this year using helper
    const monthlyOpEx = calculateMonthlyOpEx(inputs);
    const effectiveRent = currentRent * (1 - vacancyRate);
    const monthlyNOI = effectiveRent - monthlyOpEx;
    const monthlyCF = monthlyNOI - monthlyPmt;
    const annualCF = monthlyCF * 12;

    schedule.push({ year, balance, cashFlow: annualCF });

    // Grow rent for next year
    currentRent *= (1 + rentGrowthRate);
  }

  return schedule;
}

/**
 * Calculate IRR using Newton-Raphson method
 */
export function calculateIRR(cashFlows: number[]): number {
  if (cashFlows.length === 0) return 0;

  // Check if all cash flows are the same sign (no IRR exists)
  const allPositive = cashFlows.every(cf => cf >= 0);
  const allNegative = cashFlows.every(cf => cf <= 0);
  if (allPositive || allNegative) return Infinity;

  let rate = 0.1; // Initial guess: 10%
  const maxIterations = 100;
  const tolerance = 0.00001;

  for (let i = 0; i < maxIterations; i++) {
    let npv = 0;
    let dnpv = 0;

    for (let t = 0; t < cashFlows.length; t++) {
      npv += cashFlows[t] / Math.pow(1 + rate, t);
      dnpv -= t * cashFlows[t] / Math.pow(1 + rate, t + 1);
    }

    if (Math.abs(npv) < tolerance) return rate;
    if (Math.abs(dnpv) < tolerance) break; // Derivative too small

    rate = rate - npv / dnpv;

    // Prevent extreme values
    if (rate < -0.99) rate = -0.99;
    if (rate > 10) return Infinity;
  }

  return rate;
}

/**
 * Calculate advanced investment metrics
 */
export function computeAdvanced(
  inputs: Inputs,
  years: number
): {
  irr: number;
  equityMultiple: number;
  npv: number;
  paybackYears: number;
} {
  // Get core metrics
  const { cashInvested, annualCashFlow } = compute(inputs);
  const schedule = amortizationSchedule(inputs, years);

  // Ensure all inputs are numbers
  const purchasePrice = Number(inputs.purchasePrice) || 0;
  const appreciationRate = Number(inputs.appreciationRate) || 0;
  const marketTrendAdjustment = Number(inputs.marketTrendAdjustment) || 0;
  const rentGrowthRate = Number(inputs.rentGrowthRate) || 0;

  // Calculate sale price at end of holding period
  const netAppreciationRate = appreciationRate + marketTrendAdjustment;
  const salePrice = purchasePrice * Math.pow(1 + netAppreciationRate, years);

  // Get remaining loan balance
  const remainingLoan = schedule[years]?.balance || 0;
  const saleProceeds = salePrice - remainingLoan;

  // Build cash flow array
  const cashFlows: number[] = [-cashInvested];

  for (let year = 1; year <= years; year++) {
    const yearlyGrowth = Math.pow(1 + rentGrowthRate, year - 1);
    const cf = annualCashFlow * yearlyGrowth;
    cashFlows.push(cf);
  }

  // Add sale proceeds to final year
  cashFlows[years] += saleProceeds;

  // Calculate IRR
  const irrValue = calculateIRR(cashFlows);

  // Calculate equity multiple
  const totalInflows = cashFlows.slice(1).reduce((sum, cf) => sum + cf, 0);
  const equityMultiple = cashInvested > 0 ? totalInflows / cashInvested : 0;

  // Calculate NPV @ 8%
  const discountRate = 0.08;
  const npv = cashFlows.reduce((sum, cf, t) => {
    return sum + cf / Math.pow(1 + discountRate, t);
  }, 0);

  // Calculate payback period
  let cumulativeCF = -cashInvested;
  let paybackYears = Infinity;

  for (let t = 1; t < cashFlows.length; t++) {
    cumulativeCF += cashFlows[t];
    if (cumulativeCF >= 0) {
      // Linear interpolation for fractional year
      const previousCumulative = cumulativeCF - cashFlows[t];
      const fraction = -previousCumulative / cashFlows[t];
      paybackYears = t - 1 + fraction;
      break;
    }
  }

  return {
    irr: irrValue,
    equityMultiple,
    npv,
    paybackYears,
  };
}
