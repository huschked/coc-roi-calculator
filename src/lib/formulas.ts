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
    const monthlyPmt = pmt(
        inputs.interestRate / 12,      // monthly rate
        inputs.amortYears * 12,        // number of months
        loanAmount
    );

    /* ---- Net operating income (monthly) ---- */
    const monthlyNOI =
        inputs.monthlyRent * (1 - inputs.vacancyRate) - inputs.monthlyOpEx;

    /* ---- Key returns ---- */
    const annualCashFlow = (monthlyNOI - monthlyPmt) * 12;
    const cashOnCash = annualCashFlow / cashInvested;

    return { cashInvested, monthlyPmt, annualCashFlow, cashOnCash };
}
