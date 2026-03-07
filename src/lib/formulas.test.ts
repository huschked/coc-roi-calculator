import { compute, computeAdvanced } from "./formulas";

const inputs = {
    purchasePrice: 300000,
    downPercent: 0.05,
    closingCosts: 8000,
    rehabCosts: 10000,
    interestRate: 0.06625,
    amortYears: 30,
    monthlyRent: 2000,
    vacancyRate: 0.05,
    useDetailedExpenses: false,
    monthlyOpEx: 500,
    propertyTaxes: 0,
    insurance: 0,
    repairs: 0,
    propertyMgmtPercent: 0.1,
    capexReserves: 0,
    hoaFees: 0,
    rentGrowthRate: 0.02,
    appreciationRate: 0.03,
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

const netAppRate = inputs.appreciationRate + inputs.marketTrendAdjustment;
const expectedSalePrice = inputs.purchasePrice * Math.pow(1 + netAppRate, 30);

console.log("Expected Sale Price:", expectedSalePrice);

if (advanced.equityMultiple > 5) {
    console.log("PASS: Equity Multiple is high (>5), indicating appreciation is working correctly.");
} else {
    console.error("FAIL: Equity Multiple is too low (" + advanced.equityMultiple + "), appreciation might still be broken.");
}
