<script lang="ts">
  import InputSection   from './components/InputSection.svelte';
  import ResultsSection from './components/ResultsSection.svelte';
  import { compute, type Inputs }  from './lib/formulas';

  /* --- reactive calculator state --- */
  let form: Inputs = {
    purchasePrice: 300000,
    downPercent:   0.05,
    closingCosts:  8000,
    rehabCosts:    10000,
    interestRate:  0.06625,
    amortYears:    30,
    monthlyRent:   2000,
    vacancyRate:   0.05,
    monthlyOpEx:   500,
  };

  /* Runs every time any `form` field changes */
  $: results = compute(form);
</script>

<main class="max-w-4xl mx-auto p-6 space-y-10">
  <h1 class="text-3xl font-bold text-gray-800">
    Cash‑on‑Cash Return Calculator
  </h1>

  <!-- EXPLICIT two‑way bind (component variant) -->
  <InputSection bind:form={form} />

  <!-- Prop shorthand is fine here because `results` exists in script -->
  <ResultsSection {results} />
</main>
