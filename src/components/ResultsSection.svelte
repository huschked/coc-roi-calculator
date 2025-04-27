<script lang="ts">
  import Stat from "./Stat.svelte";

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

  const fmt = (n: number) => Math.abs(n);
</script>

<div class="grid gap-6 sm:grid-cols-2 mt-8">
  <!-- Cash Invested -->
  <div class="rounded-xl bg-white dark:bg-gray-800 p-6 flex flex-col justify-center items-center shadow transition transform hover:shadow-lg hover:-translate-y-1">
    <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">
      Cash Invested
    </span>
    <div class="text-2xl font-bold text-green-600 mt-2">
      ${results.cashInvested.toLocaleString()}
    </div>
  </div>

  <!-- Monthly Mortgage P&I -->
  <div class="rounded-xl bg-white dark:bg-gray-800 p-6 flex flex-col justify-center items-center shadow transition transform hover:shadow-lg hover:-translate-y-1">
    <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">
      Monthly Mortgage P&I
    </span>
    <div class="text-2xl font-bold text-green-600 mt-2">
      ${fmt(results.monthlyPmt).toLocaleString()}
    </div>
  </div>

  <!-- Projected Annual Cash Flow -->
  <div class="rounded-xl bg-white dark:bg-gray-800 p-6 flex flex-col justify-center items-center shadow transition transform hover:shadow-lg hover:-translate-y-1">
    <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">
      Projected Annual Cash Flow
    </span>
    <span class="text-xs text-gray-500">
      (based on your inputs)
    </span>
    <div class={`text-2xl font-bold mt-2 ${
      results.annualCashFlow >= 0 ? 'text-green-600' : 'text-red-600'
    }`}>
      ${results.annualCashFlow.toLocaleString()}
    </div>
  </div>

  <!-- Cash-on-Cash Return -->
  <div class="rounded-xl bg-white dark:bg-gray-800 p-6 flex flex-col justify-center items-center shadow transition transform hover:shadow-lg hover:-translate-y-1">
    <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">
      Cash-on-Cash Return
    </span>
    <div class={`text-2xl font-bold mt-2 ${
      results.cashOnCash >= 0 ? 'text-green-600' : 'text-red-600'
    }`}>
      {results.cashOnCash >= 0
        ? `${(results.cashOnCash * 100).toFixed(2)}%`
        : `-${(Math.abs(results.cashOnCash) * 100).toFixed(2)}%`}
    </div>
  </div>

  {#if refiResults}
    <!-- New P&I Payment -->
    <div class="rounded-xl bg-white dark:bg-gray-800 p-6 flex flex-col justify-center items-center shadow transition transform hover:shadow-lg hover:-translate-y-1">
      <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">
        New P&I Payment
      </span>
      <div class="text-2xl font-bold text-green-600 mt-2">
        ${fmt(refiResults.newPmt).toLocaleString()}
      </div>
    </div>

    <!-- Monthly Savings (🔥 if >= $500) -->
    <div class="rounded-xl bg-white dark:bg-gray-800 p-6 flex flex-col justify-center items-center shadow transition transform hover:shadow-lg hover:-translate-y-1">
      <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">
        Monthly Savings
      </span>
      <div class={`text-2xl font-bold mt-2 ${
        refiResults.monthlySavings >= 0 ? 'text-green-600' : 'text-red-600'
      }`}>
        ${fmt(refiResults.monthlySavings).toLocaleString()}
        {#if refiResults.monthlySavings >= 500}
          🔥
        {/if}
      </div>
    </div>

    <!-- Break-Even (months) -->
    <div class="rounded-xl bg-white dark:bg-gray-800 p-6 flex flex-col justify-center items-center shadow transition transform hover:shadow-lg hover:-translate-y-1">
      <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">
        Break-Even (months)
      </span>
      <div class="text-2xl font-bold text-green-600 mt-2">
        {refiResults.breakEvenMonths === Infinity
          ? '—'
          : `${refiResults.breakEvenMonths.toFixed(1)} mo`}
      </div>
    </div>
  {/if}
</div>
