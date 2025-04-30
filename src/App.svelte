<script lang="ts">
  import { onMount } from "svelte";
  import InputSection from "./components/InputSection.svelte";
  import RefiSection from "./components/RefiSection.svelte";
  import ResultsSection from "./components/ResultsSection.svelte";
  import ChartSection from "./components/ChartSection.svelte";
  import BreakEvenChart from "./components/BreakEvenChart.svelte";
  import MapSection from "./components/MapSection.svelte";
  import SavedScenarios from "./components/SavedScenarios.svelte";

  import {
    compute,
    type Inputs,
    computeRefi,
    type RefiInputs,
  } from "./lib/formulas";
  import { readState, writeState } from "./lib/urlSync";

  // ——— Only numeric inputs here ———
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
    rentGrowthRate: 0.02,
  };

  // ——— Free-text address lives separately ———
  let address = "";

  let refi: RefiInputs = {
    enabled: false,
    newLoanAmount: 250000,
    newRate: 0.055,
    newTermYears: 30,
    closingCosts: 5000,
  };

  let savedScenarios: { name: string; inputs: Inputs }[] = [];
  let seen = false;
  let copied = false;

  onMount(() => {
    // restore newsletter popup state
    seen = Boolean(localStorage.getItem("subSeen"));
    // hydrate numeric state from URL
    Object.assign(form, readState<Inputs>());
    Object.assign(refi, readState<RefiInputs>());

    // load saved scenarios
    const stored = localStorage.getItem("savedScenarios");
    if (stored) savedScenarios = JSON.parse(stored);

    // restore last-used address
    const last = localStorage.getItem("address");
    if (last) address = last;
  });

  function saveScenario() {
    const name = prompt("Name this scenario:");
    if (!name) return;
    savedScenarios = [...savedScenarios, { name, inputs: { ...form } }];
    localStorage.setItem("savedScenarios", JSON.stringify(savedScenarios));
  }

  function loadScenario(i: number) {
    form = { ...savedScenarios[i].inputs };
  }

  function deleteScenario(i: number) {
    savedScenarios.splice(i, 1);
    localStorage.setItem("savedScenarios", JSON.stringify(savedScenarios));
  }

  function copyLink() {
    navigator.clipboard.writeText(location.href);
    copied = true;
    setTimeout(() => (copied = false), 1500);
  }

  function handleClose() {
    seen = true;
    localStorage.setItem("subSeen", "1");
  }

  /** Simple Nominatim lookup */
  async function geocode(addr: string) {
    const url = new URL("https://nominatim.openstreetmap.org/search");
    url.searchParams.set("q", addr);
    url.searchParams.set("format", "json");
    url.searchParams.set("limit", "1");
    const res = await fetch(url.toString(), {
      headers: { "User-Agent": "RentROICalc/1.0" },
    });
    const [first] = (await res.json()) as Array<{ lat: string; lon: string }>;
    if (first) {
      return [parseFloat(first.lat), parseFloat(first.lon)] as [number, number];
    }
    throw new Error("No results");
  }

  // default map center (USA)
  let center: [number, number] = [39.833, -98.583];

  // debounce geocoding
  let addrTimer: ReturnType<typeof setTimeout>;
  $: if (address) {
    clearTimeout(addrTimer);
    addrTimer = setTimeout(async () => {
      try {
        center = await geocode(address);
        localStorage.setItem("address", address);
      } catch {
        // ignore lookup failures
      }
    }, 500);
  }

  // reactive calculations
  $: results = compute(form);
  $: refiResults = computeRefi(results.monthlyPmt, refi);

  // sync numeric state to URL
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
      rentGrowthRate,
    } = form;
    const {
      enabled,
      newLoanAmount,
      newRate,
      newTermYears,
      closingCosts: rc,
    } = refi;

    clearTimeout(urlTimer);
    urlTimer = setTimeout(() => {
      writeState({
        purchasePrice,
        downPercent,
        closingCosts,
        rehabCosts,
        interestRate,
        amortYears,
        monthlyRent,
        vacancyRate,
        monthlyOpEx,
        rentGrowthRate,
        refiEnabled: enabled,
        newLoanAmount,
        newRate,
        newTermYears,
        refiClosingCosts: rc,
      });
    }, 400);
  }

  /** Export saved scenarios to CSV */
  function exportCSV() {
    if (!savedScenarios.length) return;

    const headers = [
      "Name",
      "Purchase Price",
      "Down %",
      "Closing Costs",
      "Rehab Costs",
      "Interest Rate %",
      "Amort Years",
      "Monthly Rent",
      "Vacancy %",
      "OpEx",
      "Rent Growth %",
    ];

    const rows = savedScenarios.map(({ name, inputs }) => [
      `"${name}"`,
      inputs.purchasePrice,
      (inputs.downPercent * 100).toFixed(2),
      inputs.closingCosts,
      inputs.rehabCosts,
      (inputs.interestRate * 100).toFixed(3),
      inputs.amortYears,
      inputs.monthlyRent,
      (inputs.vacancyRate * 100).toFixed(1),
      inputs.monthlyOpEx,
      (inputs.rentGrowthRate * 100).toFixed(2),
    ]);

    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\r\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rentroicalc-scenarios.csv";
    a.click();
    URL.revokeObjectURL(url);
  }
</script>

<main class="max-w-4xl mx-auto pt-4 px-4 space-y-6">
  <!-- Logo / Title -->
  <section class="flex flex-col items-center space-y-4">
    <img src="/page-title.png" alt="RentROIcalc Logo" class="w-full max-w-xs" />
    <hr class="border-t border-gray-300 dark:border-gray-700 w-3/4" />
  </section>

  <!-- Saved Scenarios + Export -->
  <SavedScenarios
    {savedScenarios}
    {saveScenario}
    {loadScenario}
    {deleteScenario}
  />
  <div class="flex justify-center mt-4">
    <button
      on:click={exportCSV}
      class="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
      disabled={savedScenarios.length === 0}
    >
      Export Scenarios to CSV
    </button>
  </div>

  <!-- Reset / Copy Link -->
  <div class="flex flex-wrap justify-center gap-4">
    <button on:click={() => (location.href = ".")} class="btn-secondary">
      Reset All Inputs
    </button>
    <button on:click={copyLink} class="btn-primary">
      Copy Shareable Link
    </button>
  </div>
  {#if copied}
    <p class="text-center text-green-500">Link copied!</p>
  {/if}

  <!-- Core Form -->
  <InputSection bind:form />
  <RefiSection bind:refi />
  <ResultsSection {results} {refiResults} />

  <!-- Projection Chart -->
  <h2 class="text-2xl font-semibold">Projection</h2>
  <ChartSection bind:form initialYears={form.amortYears} />

  <!-- Break-Even only if refinance is on with positive savings -->
  {#if refi.enabled && (refiResults?.monthlySavings ?? 0) > 0}
    <BreakEvenChart
      monthlyPmt={results.monthlyPmt}
      {refi}
    />
  {/if}

  <!-- Property Address -->
  <section class="mt-6">
    <label
      for="property-address"
      class="block mb-1 font-medium text-gray-700 dark:text-gray-300"
    >
      Property Address
    </label>
    <input
      id="property-address"
      type="text"
      bind:value={address}
      placeholder="123 Main St, Anytown, USA"
      class="w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 focus:border-primary focus:ring-primary"
    />
  </section>

  <!-- Map -->
  <MapSection {center} zoom={16} />

  <!-- Save Button -->
  <div class="text-center mt-6">
    <button on:click={saveScenario} class="btn-primary-lg">
      Save This Scenario
    </button>
  </div>
</main>

<footer class="text-center text-sm py-6 border-t mt-10">
  © 2025 RentROICalc. All rights reserved.
</footer>

<style lang="postcss">
  .btn-primary {
    /* add your primary button styles or Tailwind @apply here */
  }
  .btn-secondary {
    @apply bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200;
  }
  .btn-primary-lg {
    /* your large primary button styles */
  }
</style>
