<script lang="ts">
  import Stat from './Stat.svelte'; 
  /* Props coming from App.svelte */
  export let results: {
    cashInvested:   number;
    monthlyPmt:     number;
    annualCashFlow: number;
    cashOnCash:     number;
  };
</script>

<div class="grid gap-6 sm:grid-cols-2 mt-8">
  <Stat label="Cash Invested"        value={results.cashInvested}   prefix="$" />
  <Stat label="Monthly Mortgage P&I" value={results.monthlyPmt}     prefix="$" />
  <Stat label="Annual Cash Flow"     value={results.annualCashFlow} prefix="$" />
  <Stat label="Cash‑on‑Cash Return"  value={results.cashOnCash * 100} suffix="%" />
</div>
