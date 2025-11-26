
import { compute, computeAdvanced, computeRefi } from './formulas';

const inputs = {
    purchasePrice: 300000,
    downPercent: 0.05,
    closingCosts: 8000,
    rehabCosts: 10000,
    interestRate: 0.06625,
    amortYears: 30,
    monthlyRent: 2000,
    vacancyRate: 0.05,
    monthlyOpEx: 500,
    rentGrowthRate: 0.02,
    appreciationRate: 0.03, // 3%
    marketTrendAdjustment: 0.0,
    locationScore: 5,
};

console.log("--- Testing Core Metrics ---");
const core = compute(inputs);
console.log("Cash Invested:", core.cashInvested);

console.log("--- Testing Advanced Metrics ---");
const advanced = computeAdvanced(inputs, 30);
console.log("IRR:", advanced.irr);
console.log("Equity Multiple:", advanced.equityMultiple);
console.log("NPV:", advanced.npv);

// Verification
const netAppRate = inputs.appreciationRate + inputs.marketTrendAdjustment;
const expectedSalePrice = inputs.purchasePrice * Math.pow(1 + netAppRate, 30);

// We can't access salePrice directly from advanced, but we can check if the results look reasonable (much higher than before).
// Before fix: Sale Price ~ 302k
// After fix: Sale Price ~ 728k
// This will massively affect Equity Multiple and IRR.

console.log("Expected Sale Price:", expectedSalePrice);

if (advanced.equityMultiple > 5) {
    console.log("PASS: Equity Multiple is high (>5), indicating appreciation is working correctly.");
} else {
    console.error("FAIL: Equity Multiple is too low (" + advanced.equityMultiple + "), appreciation might still be broken.");
}
