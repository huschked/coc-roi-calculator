<script lang="ts">
  import Stat from "./Stat.svelte";
  /* Props coming from App.svelte */
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
  <Stat label="Cash Invested" value={results.cashInvested} prefix="$" />
  <Stat label="Monthly Mortgage P&I" value={fmt(results.monthlyPmt)} prefix="$" />
  <Stat label="Annual Cash Flow" value={results.annualCashFlow} prefix="$" />
  <Stat
    label="Cash‑on‑Cash Return"
    value={results.cashOnCash * 100}
    suffix="%"
  />
  {#if refiResults}
  <Stat label="New P&I Payment" value={fmt(refiResults.newPmt)} prefix="$" />
  <Stat label="Monthly Savings" value={fmt(refiResults.monthlySavings)} prefix="$" />
  <Stat
  label="Break‑Even (months)"
  value={refiResults.breakEvenMonths === Infinity
           ? '—'
           : refiResults.breakEvenMonths.toFixed(1)}
  suffix={refiResults.breakEvenMonths === Infinity ? '' : ' mo'} />
{/if}
</div>
