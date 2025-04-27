<script lang="ts">
  import InputSection from "./components/InputSection.svelte";
  import ResultsSection from "./components/ResultsSection.svelte";
  import RefiSection from "./components/RefiSection.svelte";
  import ChartSection from "./components/ChartSection.svelte";
  import SavedScenarios from "./components/SavedScenarios.svelte";

  import { compute, type Inputs } from "./lib/formulas";
  import { computeRefi, type RefiInputs } from "./lib/formulas";
  import { readState, writeState } from "./lib/urlSync";
  import { onMount } from "svelte";

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

  let refi: RefiInputs = {
    enabled: false,
    newLoanAmount: 250000,
    newRate: 0.055,
    newTermYears: 30,
    closingCosts: 5000,
  };

  let savedScenarios: { name: string; inputs: any }[] = [];

  onMount(() => {
    seen = Boolean(localStorage.getItem("subSeen"));
    Object.assign(form, readState<Inputs>());
    Object.assign(refi, readState<RefiInputs>());

    const existing = localStorage.getItem("savedScenarios");
    if (existing) {
      savedScenarios = JSON.parse(existing);
    }
  });

  function saveScenario() {
    const name = prompt("Name this scenario:");
    if (!name) return;

    const newScenario = {
      name,
      inputs: { ...form },
    };

    savedScenarios = [...savedScenarios, newScenario];
    localStorage.setItem("savedScenarios", JSON.stringify(savedScenarios));
  }

  function loadScenario(index: number) {
    const scenario = savedScenarios[index];
    if (scenario) {
      form = { ...scenario.inputs };
    }
  }

  function deleteScenario(index: number) {
    savedScenarios = savedScenarios.filter((_, i) => i !== index);
    localStorage.setItem("savedScenarios", JSON.stringify(savedScenarios));
  }

  const BREVO_URL = "https://sibforms.com/forms/XXXXXXXXX.js";
  let seen = false;
  function handleClose() {
    seen = true;
    localStorage.setItem("subSeen", "1");
  }

  $: results = compute(form);
  $: refiResults = computeRefi(results.monthlyPmt, refi);

  let urlTimer: ReturnType<typeof setTimeout>;
  $: {
    const {
      purchasePrice,
      downPercent,
      closingCosts,
      rehabCosts,
      interestRate,
      amortYears,
      monthlyRent,
      vacancyRate,
      monthlyOpEx,
    } = form;

    const {
      enabled,
      newLoanAmount,
      newRate,
      newTermYears,
      closingCosts: refiClosingCosts,
    } = refi;

    clearTimeout(urlTimer);
    urlTimer = setTimeout(() => {
      const state = {
        purchasePrice,
        downPercent,
        closingCosts,
        rehabCosts,
        interestRate,
        amortYears,
        monthlyRent,
        vacancyRate,
        monthlyOpEx,
        refiEnabled: enabled,
        newLoanAmount,
        newRate,
        newTermYears,
        refiClosingCosts,
      };
      writeState(state);
    }, 400);
  }

  let copied = false;
  function copyLink() {
    navigator.clipboard.writeText(location.href);
    copied = true;
    setTimeout(() => (copied = false), 1500);
  }
</script>

<main class="max-w-4xl mx-auto pt-2 px-4 space-y-3">
  <!-- 🎯 Insert New Logo Here -->
  <section class="flex flex-col items-center text-center space-y-4">
    <img
      src="/page-title.png"
      alt="RentROIcalc Logo"
      class="w-[750px] max-w-xs mx-auto my-1"
    />

    <!-- Add separator line -->
    <hr
      class="border-t border-gray-300 dark:border-gray-700 w-full max-w-md mx-auto mt-4"
    />
  </section>

  <!-- 🔥 Copy Link and Reset below Saved Scenarios -->
  <div class="flex flex-wrap gap-4 justify-center mt-6">
    <button
      on:click={() => (location.href = ".")}
      class="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-sm transition"
    >
      Reset All Inputs
    </button>
    <button
      on:click={copyLink}
      class="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark text-sm transition"
    >
      Copy Shareable Link
    </button>
  </div>

  {#if copied}
    <div class="text-green-500 dark:text-green-400 text-center text-sm mt-2">
      Copied to clipboard!
    </div>
  {/if}

  <!-- Input Sections -->
  <InputSection bind:form />
  <RefiSection bind:refi />

  <!-- Results -->
  <ResultsSection {results} {refiResults} />

  <!-- Projection -->
  <h2 class="text-2xl font-semibold pt-8 text-gray-900 dark:text-gray-100">
    Projection
  </h2>
  <ChartSection bind:form initialYears={form.amortYears} />

  <!-- Save Button at Bottom -->
  <div class="flex justify-center mt-8">
    <button
      on:click={saveScenario}
      class="bg-primary text-white rounded px-6 py-3 hover:bg-primary-dark transform hover:scale-105 hover:shadow-lg transition-all"
    >
      Save This Scenario
    </button>
  </div>

  <hr
    class="border-t border-gray-300 dark:border-gray-700 w-full max-w-md mx-auto mt-4"
  />

  <!-- Saved Scenarios List -->
  <SavedScenarios
    {savedScenarios}
    {saveScenario}
    {loadScenario}
    {deleteScenario}
  />
</main>

<footer class="text-center text-gray-400 text-sm py-6 mt-10 border-t border-gray-200 dark:border-gray-700">
  © 2025 RentROIcalc. All rights reserved.
</footer>

