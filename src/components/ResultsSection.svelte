<script lang="ts">
  const fmt = (n: number) => Math.abs(n).toLocaleString();

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
</script>

<style lang="postcss">
  .stat-card {
    @apply relative rounded-xl bg-white dark:bg-gray-800 p-6 flex flex-col justify-center items-center shadow transition transform hover:shadow-lg hover:-translate-y-1;
  }

  .help-icon {
    @apply absolute top-2 left-2 w-6 h-6 flex items-center justify-center bg-gray-900 text-white rounded-full text-xs cursor-pointer;
  }
  .tooltip {
    @apply absolute z-20 hidden w-48 p-2 text-xs text-white bg-gray-900 rounded;
    top: 100%;
    left: 0;
  }
  .help-icon:hover .tooltip {
    @apply block;
  }
</style>

<div class="grid gap-6 sm:grid-cols-2 mt-8">
  <!-- Cash Invested -->
  <div class="stat-card">
    <div class="help-icon">
      ❓
      <div class="tooltip">
        Total cash out-of-pocket: down payment + closing costs + rehab.
      </div>
    </div>
    <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">
      Cash Invested
    </span>
    <div class="text-2xl font-bold text-green-600 mt-2">
      ${fmt(results.cashInvested)}
    </div>
  </div>

  <!-- Monthly Mortgage P&I -->
  <div class="stat-card">
    <div class="help-icon">
      ❓
      <div class="tooltip">
        Your monthly principal & interest payment on the mortgage.
      </div>
    </div>
    <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">
      Monthly Mortgage P&I
    </span>
    <div class="text-2xl font-bold text-green-600 mt-2">
      ${fmt(results.monthlyPmt)}
    </div>
  </div>

  <!-- Projected Annual Cash Flow -->
  <div class="stat-card">
    <div class="help-icon">
      ❓
      <div class="tooltip">
        Annual rent (net of vacancy & OpEx) minus P&I payments.
      </div>
    </div>
    <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">
      Projected Annual Cash Flow
    </span>
    <span class="text-xs text-gray-500">(based on your inputs)</span>
    <div class={`text-2xl font-bold mt-2 ${
      results.annualCashFlow >= 0 ? 'text-green-600' : 'text-red-600'
    }`}>
      ${results.annualCashFlow.toLocaleString()}
    </div>
  </div>

  <!-- Cash-on-Cash Return -->
  <div class="stat-card">
    <div class="help-icon">
      ❓
      <div class="tooltip">
        Annual cash flow ÷ total cash invested.
      </div>
    </div>
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
    <div class="stat-card">
      <div class="help-icon">
        ❓
        <div class="tooltip">
          Your new monthly P&I after refinancing.
        </div>
      </div>
      <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">
        New P&I Payment
      </span>
      <div class="text-2xl font-bold text-green-600 mt-2">
        ${fmt(refiResults.newPmt)}
      </div>
    </div>

    <!-- Monthly Savings -->
    <div class="stat-card">
      <div class="help-icon">
        ❓
        <div class="tooltip">
          Difference between old & new P&I payments.
        </div>
      </div>
      <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">
        Monthly Savings
      </span>
      <div class={`text-2xl font-bold mt-2 ${
        refiResults.monthlySavings >= 0 ? 'text-green-600' : 'text-red-600'
      }`}>
        ${fmt(refiResults.monthlySavings)}
      </div>
    </div>

    <!-- Break-Even (months) -->
    <div class="stat-card">
      <div class="help-icon">
        ❓
        <div class="tooltip">
          How many months to recoup your refinance closing costs.
        </div>
      </div>
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
