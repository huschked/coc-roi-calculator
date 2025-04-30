/**
 * All calculator math lives here so the UI stays clean.
 * -----------------------------------------------------
 *  - User inputs in *percent* form (e.g. 5 → 5%).
 *  - Inside we convert to *decimals* (5% → 0.05).
 */

export interface Inputs {
    purchasePrice: number;
    downPercent: number;    // decimal (0.05 = 5%)
    closingCosts: number;
    rehabCosts: number;
    interestRate: number;   // decimal (0.06625 = 6.625%)
    amortYears: number;
    monthlyRent: number;
    vacancyRate: number;    // decimal (0.05 = 5%)
    monthlyOpEx: number;
    rentGrowthRate: number; // decimal (0.02 = 2%)
  }
  
  export interface RefiInputs {
    enabled: boolean;
    newLoanAmount: number;
    newRate: number;         // decimal (e.g. 0.055 = 5.5%)
    newTermYears: number;
    closingCosts: number;
  }
  
  /** Standard mortgage payment formula (constant amortisation) */
  export function pmt(ratePerPeriod: number, nPeriods: number, present: number) {
    return -(ratePerPeriod * present) / (1 - Math.pow(1 + ratePerPeriod, -nPeriods));
  }
  
  /** Compute main results */
  export function compute(inputs: Inputs) {
    const downPct   = +inputs.downPercent;
    const intRate   = +inputs.interestRate;
    const vacancy   = +inputs.vacancyRate;
    const rentGrow  = +inputs.rentGrowthRate;
  
    // coerce everything else to Number
    const P = +inputs.purchasePrice;
    const C = +inputs.closingCosts;
    const R = +inputs.rehabCosts;
    const M = +inputs.monthlyRent;
    const O = +inputs.monthlyOpEx;
    const A = +inputs.amortYears;
  
    // now all arithmetic is numeric
    const cashInvested = P * downPct + C + R;
    const loanAmount   = P * (1 - downPct);
    const rawPmt       = pmt(intRate / 12, A * 12, loanAmount);
    const monthlyPmt   = Math.abs(rawPmt);
  
    const monthlyNOI   = M * (1 - vacancy) - O;
    const monthlyCF    = monthlyNOI - monthlyPmt;
    const annualCF     = monthlyCF * 12;
    const cashOnCash   = annualCF / cashInvested;
  
    return { cashInvested, monthlyPmt, annualCashFlow: annualCF, cashOnCash };
  }
  
  /** Compute refinance results or null if not enabled */
  export function computeRefi(currentPmt: number, r: RefiInputs) {
    if (!r.enabled) return null;
  
    const newPmt = pmt(r.newRate / 12, r.newTermYears * 12, r.newLoanAmount);
    const monthlySavings = Math.abs(currentPmt) - Math.abs(newPmt);
    const breakEvenMonths = monthlySavings > 0 ? r.closingCosts / monthlySavings : Infinity;
  
    return { newPmt, monthlySavings, breakEvenMonths };
  }
  
  /**
   * Build a yearly schedule of loan balance & cash flow.
   * Rent grows at rentGrowthRate each year.
   */
  // formulas.ts

export function amortizationSchedule(
  inputs: Inputs,
  years = 10
): { year: number; balance: number; cashFlow: number }[] {
  const pv = inputs.purchasePrice * (1 - inputs.downPercent);
  const monthlyRate = inputs.interestRate / 12;
  const totalMonths = inputs.amortYears * 12;
  const pmtAmt = Math.abs(pmt(monthlyRate, totalMonths, pv));

  // interpret rentGrowthRate as percent
  // e.g. if user types "2" for 2%, we want 0.02
  const growthDecimal = inputs.rentGrowthRate / 100;

  let currentMonthlyRent = inputs.monthlyRent;
  const schedule: { year: number; balance: number; cashFlow: number }[] = [];

  for (let y = 0; y <= years; y++) {
    const m = Math.min(y * 12, totalMonths);

    const balance =
      m >= totalMonths
        ? 0
        : pv * Math.pow(1 + monthlyRate, m) -
          (pmtAmt / monthlyRate) * (Math.pow(1 + monthlyRate, m) - 1);

    const monthlyNOI =
      currentMonthlyRent * (1 - inputs.vacancyRate / 100) -
      inputs.monthlyOpEx;
    const annualCashFlow = (monthlyNOI - pmtAmt) * 12;

    schedule.push({ year: y, balance, cashFlow: annualCashFlow });

    // apply the _decimal_ growth
    currentMonthlyRent *= 1 + growthDecimal;
  }

  return schedule;
}

  