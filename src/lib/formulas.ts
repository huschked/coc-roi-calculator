/**
 * All calculator math lives here so the UI stays clean.
 * -----------------------------------------------------
 *  - Keep every numeric input in *dollars* or *decimal* form
 *    (e.g. 6 % interest  →  0.06).
 *  - Functions are pure → easy to unit‑test later.
 */

/*-------------------------------------------------------
  Type describing every form field the UI will expose
  -----------------------------------------------------*/
export interface Inputs {
    /* ---- Purchase & Rehab ---- */
    purchasePrice: number;      // Contract price for the property
    downPercent: number;      // e.g. 0.05 for 5 %
    closingCosts: number;      // Title fees, origination, etc.
    rehabCosts: number;      // Immediate renovation budget

    /* ---- Financing ---- */
    interestRate: number;       // Annual interest rate (decimal)
    amortYears: number;       // Term of the loan in years

    /* ---- Income & Expenses ---- */
    monthlyRent: number;       // Gross scheduled rent
    vacancyRate: number;       // Decimal fraction, e.g. 0.05 for 5 %
    monthlyOpEx: number;       // All operating expenses (taxes, repairs, etc.)
}

/* ---------- NEW INTERFACE ---------- */
/** Optional refinance inputs  */
export interface RefiInputs {
    enabled: boolean;
    newLoanAmount: number;   // $  (user can copy old balance or cash‑out amount)
    newRate: number;   // decimal (e.g. 0.06)
    newTermYears: number;   // years
    closingCosts: number;   // $ incurred at refi
}

/* ---------- REFI COMPUTATION ---------- */
export function computeRefi(currentPmt: number, r: RefiInputs) {
    if (!r.enabled) return null;

    const newPmt = pmt(r.newRate / 12, r.newTermYears * 12, r.newLoanAmount);

    // 1️⃣  use absolute values so payments are positive dollars
    const monthlySavings = Math.abs(currentPmt) - Math.abs(newPmt);

    // 2️⃣  guard against zero / negative savings
    const breakEvenMonths =
        monthlySavings > 0 ? r.closingCosts / monthlySavings : Infinity;

    return { newPmt, monthlySavings, breakEvenMonths };
}

/*-------------------------------------------------------
  Standard mortgage payment formula (constant amortisation)
  PMT = payment per period (negative because cash outflow)
  -----------------------------------------------------*/
export function pmt(ratePerPeriod: number, nPeriods: number, present: number) {
    return -(ratePerPeriod * present) / (1 - Math.pow(1 + ratePerPeriod, -nPeriods));
}

/*-------------------------------------------------------
  Core computation – returns everything the UI needs.
  Add new derived values here; the UI auto‑updates.
  -----------------------------------------------------*/
export function compute(inputs: Inputs) {
    /* ---- Cash invested upfront ---- */
    const cashInvested =
        inputs.purchasePrice * inputs.downPercent +
        inputs.closingCosts +
        inputs.rehabCosts;

    /* ---- Debt service ---- */
    const loanAmount = inputs.purchasePrice * (1 - inputs.downPercent);
    const rawPmt = pmt(
        inputs.interestRate / 12,      // monthly rate
        inputs.amortYears * 12,        // number of months
        loanAmount
    );

    const monthlyPmt = Math.abs(rawPmt);

    /* ---- Net operating income (monthly) ---- */
    const monthlyNOI =
        inputs.monthlyRent * (1 - inputs.vacancyRate) - inputs.monthlyOpEx;

        const monthlyCashFlow = monthlyNOI - monthlyPmt;
    /* ---- Key returns ---- */
    const annualCashFlow = (monthlyCashFlow) * 12;
    const cashOnCash = annualCashFlow / cashInvested;

    return { cashInvested, monthlyPmt, annualCashFlow, cashOnCash };
}

/**
 * Builds a yearly schedule of loan balance & cash flow.
 * @param inputs   Your Inputs object
 * @param years    How many years to project (default: 10)
 */
export function amortizationSchedule(
    inputs: Inputs,
    years = 10
  ): { year: number; balance: number; cashFlow: number }[] {
    // Present value = loan amount
    const pv = inputs.purchasePrice * (1 - inputs.downPercent);
    const monthlyRate = inputs.interestRate / 12;
    const totalMonths = inputs.amortYears * 12;
  
    // Payment amount (positive)
    const pmtAmt = Math.abs(pmt(monthlyRate, totalMonths, pv));
  
    // Monthly net operating income
    const monthlyNOI =
      inputs.monthlyRent * (1 - inputs.vacancyRate) - inputs.monthlyOpEx;
    // Annual cash flow is constant
    const annualCashFlow = (monthlyNOI - pmtAmt) * 12;
  
    const schedule: { year: number; balance: number; cashFlow: number }[] = [];
  
    for (let y = 0; y <= years; y++) {
      const m = Math.min(y * 12, totalMonths);
  
      // Outstanding balance formula for amortising loan
      const balance =
        m >= totalMonths
          ? 0
          : pv * Math.pow(1 + monthlyRate, m) -
            (pmtAmt / monthlyRate) * (Math.pow(1 + monthlyRate, m) - 1);
  
      schedule.push({ year: y, balance, cashFlow: annualCashFlow });
    }
  
    return schedule;
  }
  
