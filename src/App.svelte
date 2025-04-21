<script lang="ts">
  import InputSection from "./components/InputSection.svelte";
  import ResultsSection from "./components/ResultsSection.svelte";
  import RefiSection from "./components/RefiSection.svelte";
  import { compute, type Inputs } from "./lib/formulas";
  import { computeRefi, type RefiInputs } from "./lib/formulas";


  /* --- reactive calculator state --- */
  let form: Inputs = {
    purchasePrice: 300000,
    downPercent: 0.05,
    closingCosts: 8000,
    rehabCosts: 10000,
    interestRate: 0.06625,
    amortYears: 30,
    monthlyRent: 2000,
    vacancyRate: 0.05,
    monthlyOpEx: 500,
  };

  /* ---- NEW: refinance inputs & defaults ---- */
  let refi: RefiInputs = {
    enabled: false,
    newLoanAmount: 250000,
    newRate: 0.055,
    newTermYears: 30,
    closingCosts: 5000,
  };

  /* ---- reactive calculations ---- */
  $: results = compute(form);
  $: refiResults = computeRefi(results.monthlyPmt, refi);
</script>

<main class="max-w-4xl mx-auto p-6 space-y-10">
  <h1 class="text-3xl font-bold">Cash‑on‑Cash Return Calculator</h1>

  <InputSection bind:form={form} />
  <RefiSection  bind:refi={refi}   />

  <!-- Pass both result objects down -->
  <ResultsSection {results} {refiResults} />
</main>
