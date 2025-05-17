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
  newRate: number;        // decimal (0.055 = 5.5%)
  newTermYears: number;
  closingCosts: number;
}

/** Standard mortgage payment formula (constant amortisation) */
export function pmt(ratePerPeriod: number, nPeriods: number, present: number) {
  return -(ratePerPeriod * present) /
         (1 - Math.pow(1 + ratePerPeriod, -nPeriods));
}

/** Compute the 4 core outputs */
export function compute(inputs: Inputs) {
  const P = +inputs.purchasePrice;
  const d = +inputs.downPercent;
  const C = +inputs.closingCosts;
  const R = +inputs.rehabCosts;

  const cashInvested = P * d + C + R;
  const loanAmount   = P * (1 - d);

  const rawPmt = pmt(
    +inputs.interestRate / 12,
    +inputs.amortYears * 12,
    loanAmount
  );
  const monthlyPmt = Math.abs(rawPmt);

  const monthlyNOI = +inputs.monthlyRent * (1 - +inputs.vacancyRate)
                   - +inputs.monthlyOpEx;
  const monthlyCF  = monthlyNOI - monthlyPmt;
  const annualCF   = monthlyCF * 12;
  const cashOnCash = annualCF / cashInvested;

  return {
    cashInvested,
    monthlyPmt,
    annualCashFlow: annualCF,
    cashOnCash,
  };
}

/** Compute refinance results or null if not enabled */
export function computeRefi(currentPmt: number, r: RefiInputs) {
  if (!r.enabled) return null;

  const newPmt = pmt(r.newRate / 12, r.newTermYears * 12, r.newLoanAmount);
  const savings = Math.abs(currentPmt) - Math.abs(newPmt);
  const breakeven = savings > 0 ? r.closingCosts / savings : Infinity;

  return {
    newPmt,
    monthlySavings: savings,
    breakEvenMonths: breakeven,
  };
}

/**
 * Yearly amortization schedule plus growing cash flow.
 * ✅ Treat rates as decimals.  No extra “/100” here.
 */
export function amortizationSchedule(
  inputs: Inputs,
  years = 10
): { year: number; balance: number; cashFlow: number }[] {
  const pv          = +inputs.purchasePrice * (1 - +inputs.downPercent);
  const monthlyRate = +inputs.interestRate / 12;
  const totalMonths = +inputs.amortYears * 12;
  const pmtAmt      = Math.abs(pmt(monthlyRate, totalMonths, pv));

  let rent = inputs.monthlyRent;
  const schedule: { year: number; balance: number; cashFlow: number }[] = [];

  for (let y = 0; y <= years; y++) {
    const m = Math.min(y * 12, totalMonths);

    // remaining balance formula
    const balance =
      m >= totalMonths
        ? 0
        : pv * Math.pow(1 + monthlyRate, m)
          - (pmtAmt / monthlyRate) * (Math.pow(1 + monthlyRate, m) - 1);

    // here vacancyRate is already a decimal
    const monthlyNOI = rent * (1 - +inputs.vacancyRate) - +inputs.monthlyOpEx;
    const annualCF   = (monthlyNOI - pmtAmt) * 12;

    schedule.push({ year: y, balance, cashFlow: annualCF });

    // grow next year’s rent by decimal rate
    rent *= 1 + +inputs.rentGrowthRate;
  }

  return schedule;
}

/**
 * Newton’s method IRR, equity multiple, NPV, payback.
 * Uses the _remaining principal_ to compute true net sale proceeds.
 */
export function irr(cashFlows: number[], guess = 0.1): number {
  const maxIter = 50, tol = 1e-6;
  let rate = guess;

  for (let i = 0; i < maxIter; i++) {
    let npv = 0, deriv = 0;
    for (let t = 0; t < cashFlows.length; t++) {
      npv   += cashFlows[t] / Math.pow(1 + rate, t);
      deriv -= t * cashFlows[t] / Math.pow(1 + rate, t + 1);
    }
    const delta = npv / deriv;
    rate -= delta;
    if (Math.abs(delta) < tol) break;
  }
  return rate;
}

export function computeAdvanced(
  inputs: Inputs,
  years: number
): {
  irr: number;
  equityMultiple: number;
  npv: number;
  paybackYears: number;
} {
  // 1️⃣ grab the static results plus schedule
  const { cashInvested, annualCashFlow } = compute(inputs);
  const schedule = amortizationSchedule(inputs, years);

  // 2️⃣ net sale proceeds = assumed sale price (here cost) minus remaining balance
  const salePrice      = +inputs.purchasePrice;          // or an ARV, your choice
  const remainingLoan  = schedule[years].balance;
  const saleProceeds   = salePrice - remainingLoan;

  // 3️⃣ build full cash‐flow array
  const cashFlows: number[] = [];
  cashFlows.push(-cashInvested);
  for (let y = 1; y <= years; y++) {
    // grow annualCF each year
    const cf = annualCashFlow * Math.pow(1 + +inputs.rentGrowthRate, y - 1);
    cashFlows.push(cf);
  }
  cashFlows[years] += saleProceeds;

  // 4️⃣ IRR
  const irrVal = irr(cashFlows);

  // 5️⃣ total positive inflows / outflow
  const totalInflows = cashFlows
    .slice(1)
    .reduce((sum, cf) => sum + cf, 0);
  const eqMult = totalInflows / cashInvested;

  // 6️⃣ NPV @ 8%
  const discount = 0.08;
  const npv = cashFlows.reduce(
    (sum, cf, t) => sum + cf / Math.pow(1 + discount, t),
    0
  );

  // 7️⃣ payback period
  let cum = -cashInvested, payback = Infinity;
  for (let t = 1; t < cashFlows.length; t++) {
    cum += cashFlows[t];
    if (cum >= 0) {
      // fractional payback in year t
      payback = t - 1 + (cashInvested + cashFlows
        .slice(1, t)
        .reduce((a, b) => a + b, 0)) / cashFlows[t];
      break;
    }
  }

  return {
    irr:           irrVal,
    equityMultiple: eqMult,
    npv,
    paybackYears:  payback,
  };
}
