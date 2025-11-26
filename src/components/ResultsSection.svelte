<script lang="ts">
  import DealQualityBadge from "./DealQualityBadge.svelte";

  const fmt = (n: number) =>
    Math.abs(n).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

  export let results: {
    cashInvested: number;
    monthlyPmt: number;
    annualCashFlow: number;
    cashOnCash: number;
  };

  export let refiResults: {
    newPmt: number;
    monthlySavings: number;
    breakEvenMonths: number;
  } | null = null;

  export let irr: number = 0;

  // Helper functions for metric indicators
  const getCOCIndicator = (coc: number) => {
    if (coc >= 0.08) return { icon: "✓", color: "text-green-400" };
    if (coc >= 0.04) return { icon: "⚠", color: "text-yellow-400" };
    return { icon: "✗", color: "text-red-400" };
  };

  const getCashFlowIndicator = (cf: number) => {
    if (cf > 0) return { icon: "✓", color: "text-green-400" };
    return { icon: "✗", color: "text-red-400" };
  };

  $: cocIndicator = getCOCIndicator(results.cashOnCash);
  $: cfIndicator = getCashFlowIndicator(results.annualCashFlow);
</script>

<!-- Deal Quality Badge -->
<DealQualityBadge
  cashOnCash={results.cashOnCash}
  annualCashFlow={results.annualCashFlow}
  {irr}
/>

<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
  <!-- Cash Invested -->
  <div
    class="glass-panel p-6 relative overflow-hidden group shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border-l-4 border-l-blue-500"
  >
    <div
      class="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-30 transition-opacity"
    >
      <svg
        class="w-20 h-20 text-blue-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        ><path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
        ></path></svg
      >
    </div>
    <div class="relative z-10">
      <span class="text-sm font-medium text-gray-400 uppercase tracking-wider"
        >Cash Invested</span
      >
      <div class="text-3xl font-display font-bold text-white mt-2">
        ${fmt(results.cashInvested)}
      </div>
      <div class="text-xs text-gray-500 mt-1">Down + Closing + Rehab</div>
    </div>
  </div>

  <!-- Monthly Mortgage P&I -->
  <div
    class="glass-panel p-6 relative overflow-hidden group shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border-l-4 border-l-red-500"
  >
    <div
      class="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-30 transition-opacity"
    >
      <svg
        class="w-20 h-20 text-red-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        ><path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        ></path></svg
      >
    </div>
    <div class="relative z-10">
      <span class="text-sm font-medium text-gray-400 uppercase tracking-wider"
        >Monthly P&I</span
      >
      <div class="text-3xl font-display font-bold text-white mt-2">
        ${fmt(results.monthlyPmt)}
      </div>
      <div class="text-xs text-gray-500 mt-1">Principal & Interest</div>
    </div>
  </div>

  <!-- Projected Annual Cash Flow -->
  <div
    class="glass-panel p-6 relative overflow-hidden group shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border-l-4 {results.annualCashFlow >=
    0
      ? 'border-l-green-500'
      : 'border-l-red-500'}"
  >
    <div
      class="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-30 transition-opacity"
    >
      <svg
        class="w-20 h-20 {results.annualCashFlow >= 0
          ? 'text-green-400'
          : 'text-red-400'}"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        ><path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path></svg
      >
    </div>
    <div class="relative z-10">
      <span
        class="text-sm font-medium text-gray-400 uppercase tracking-wider flex items-center gap-2"
      >
        Annual Cash Flow
        <span class={`text-lg ${cfIndicator.color}`}>{cfIndicator.icon}</span>
      </span>
      <div
        class={`text-3xl font-display font-bold mt-2 ${results.annualCashFlow >= 0 ? "text-accent-glow" : "text-danger"}`}
      >
        ${results.annualCashFlow.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })}
      </div>
      <div class="text-xs text-gray-500 mt-1">Net Income after Expenses</div>
    </div>
  </div>

  <!-- Cash-on-Cash Return -->
  <div
    class="glass-panel p-6 relative overflow-hidden group bg-gradient-to-br from-surface/50 to-primary/10 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border-l-4 {results.cashOnCash >=
    0
      ? 'border-l-green-500'
      : 'border-l-red-500'}"
  >
    <div
      class="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-30 transition-opacity"
    >
      <svg
        class="w-20 h-20 {results.cashOnCash >= 0
          ? 'text-green-400'
          : 'text-red-400'}"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        ><path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        ></path></svg
      >
    </div>
    <div class="relative z-10">
      <span
        class="text-sm font-medium text-primary-glow uppercase tracking-wider flex items-center gap-2"
      >
        Cash-on-Cash
        <span class={`text-lg ${cocIndicator.color}`}>{cocIndicator.icon}</span>
      </span>
      <div
        class={`text-4xl font-display font-bold mt-2 ${results.cashOnCash >= 0 ? "text-primary-glow" : "text-danger"}`}
      >
        {results.cashOnCash >= 0
          ? `${(results.cashOnCash * 100).toFixed(2)}%`
          : `-${(Math.abs(results.cashOnCash) * 100).toFixed(2)}%`}
      </div>
      <div class="text-xs text-primary/60 mt-1">Annual ROI</div>
    </div>
  </div>

  {#if refiResults}
    <!-- Refi Section (Full Width or Grid) -->
    <div class="col-span-full mt-4 pt-4 border-t border-white/10">
      <h3
        class="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider"
      >
        Refinance Impact
      </h3>
      <div class="grid gap-6 sm:grid-cols-3">
        <div
          class="glass-panel p-4 bg-surface/30 shadow-md hover:shadow-lg transition-shadow"
        >
          <span class="text-xs text-gray-500">New P&I</span>
          <div class="text-xl font-bold text-white">
            ${fmt(refiResults.newPmt)}
          </div>
        </div>

        <div
          class="glass-panel p-4 bg-surface/30 shadow-md hover:shadow-lg transition-shadow"
        >
          <span class="text-xs text-gray-500">Monthly Savings</span>
          <div
            class={`text-xl font-bold ${refiResults.monthlySavings >= 0 ? "text-accent-glow" : "text-danger"}`}
          >
            ${fmt(refiResults.monthlySavings)}
          </div>
        </div>

        <div
          class="glass-panel p-4 bg-surface/30 shadow-md hover:shadow-lg transition-shadow"
        >
          <span class="text-xs text-gray-500">Break-Even</span>
          <div class="text-xl font-bold text-white">
            {refiResults.breakEvenMonths === Infinity
              ? "—"
              : `${refiResults.breakEvenMonths.toFixed(1)} mo`}
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>
