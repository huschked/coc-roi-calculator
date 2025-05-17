<script lang="ts">
  import { onMount } from "svelte";
  import InputSection from "./components/InputSection.svelte";
  import RefiSection from "./components/RefiSection.svelte";
  import ResultsSection from "./components/ResultsSection.svelte";
  import AdvancedMetrics from "./components/AdvancedMetrics.svelte";
  import ChartSection from "./components/ChartSection.svelte";
  import BreakEvenChart from "./components/BreakEvenChart.svelte";
  import MapSection from "./components/MapSection.svelte";
  import SavedScenarios from "./components/SavedScenarios.svelte";

  import {
    compute,
    computeRefi,
    computeAdvanced,
    type Inputs,
    type RefiInputs,
  } from "./lib/formulas";
  import { readState, writeState } from "./lib/urlSync";

  // Leaflet setup
  import L from "leaflet";
  import "leaflet/dist/leaflet.css";
  import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
  import iconUrl from "leaflet/dist/images/marker-icon.png";
  import shadowUrl from "leaflet/dist/images/marker-shadow.png";
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

  // Form state
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
  let address = "";
  let refi: RefiInputs = {
    enabled: false,
    newLoanAmount: 250000,
    newRate: 0.055,
    newTermYears: 30,
    closingCosts: 5000,
  };
  let savedScenarios: { name: string; inputs: Inputs }[] = [];
  let copied = false;

  onMount(() => {
    Object.assign(form, readState<Inputs>());
    Object.assign(refi, readState<RefiInputs>());
    const stored = localStorage.getItem("savedScenarios");
    if (stored) savedScenarios = JSON.parse(stored);
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
    savedScenarios = savedScenarios; // trigger reactivity
    localStorage.setItem("savedScenarios", JSON.stringify(savedScenarios));
  }
  function copyLink() {
    navigator.clipboard.writeText(location.href);
    copied = true;
    setTimeout(() => (copied = false), 1500);
  }

  // debounce & geocode
  let center: [number, number] = [39.833, -98.583];
  let addrTimer: ReturnType<typeof setTimeout>;
  $: if (address) {
    clearTimeout(addrTimer);
    addrTimer = setTimeout(async () => {
      try {
        const url = new URL("https://nominatim.openstreetmap.org/search");
        url.searchParams.set("q", address);
        url.searchParams.set("format", "json");
        url.searchParams.set("limit", "1");
        const res = await fetch(url.toString(), {
          headers: { "User-Agent": "RentROICalc/1.0" },
        });
        const [first] = (await res.json()) as Array<{
          lat: string;
          lon: string;
        }>;
        if (first) {
          center = [parseFloat(first.lat), parseFloat(first.lon)];
          localStorage.setItem("address", address);
        }
      } catch {
        /* ignore */
      }
    }, 500);
  }

  // computations
  $: results     = compute(form);
  $: refiResults = computeRefi(results.monthlyPmt, refi);
  $: advanced    = computeAdvanced(form, form.amortYears);

  // sync URL state
  let urlTimer: ReturnType<typeof setTimeout>;
  $: {
    const {
      purchasePrice, downPercent, closingCosts,
      rehabCosts, interestRate, amortYears,
      monthlyRent, vacancyRate, monthlyOpEx,
      rentGrowthRate
    } = form;
    const {
      enabled, newLoanAmount, newRate,
      newTermYears, closingCosts: rc
    } = refi;
    clearTimeout(urlTimer);
    urlTimer = setTimeout(() => {
      writeState({
        purchasePrice, downPercent, closingCosts,
        rehabCosts, interestRate, amortYears,
        monthlyRent, vacancyRate, monthlyOpEx,
        rentGrowthRate, refiEnabled: enabled,
        newLoanAmount, newRate, newTermYears,
        refiClosingCosts: rc
      });
    }, 400);
  }
</script>

<main class="max-w-4xl mx-auto pt-4 px-4 space-y-6">

  <!-- Logo / Title -->
  <section class="flex flex-col items-center space-y-4">
    <img src="/page-title.png" alt="RentROIcalc Logo" class="w-full max-w-xs" />
    <hr class="border-t border-gray-300 dark:border-gray-700 w-3/4" />
  </section>

  <!-- Saved + Controls -->
  <section class="flex flex-col items-center space-y-4">
    <SavedScenarios
      {savedScenarios}
      {saveScenario}
      {loadScenario}
      {deleteScenario}
    />
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
  </section>

  <!-- 1) Core Metrics -->
  <section class="mt-8">
    <h2 class="text-2xl font-semibold text-gray-100 mb-2">
      Core Metrics
    </h2>
    <ResultsSection {results} {refiResults} />
  </section>

  <!-- 2) Advanced Metrics -->
  <section class="mt-12">
    <h2 class="text-2xl font-semibold text-gray-100 mb-2">
      Advanced Metrics
    </h2>
    <AdvancedMetrics {advanced} />
  </section>

  <!-- 3) Assumptions -->
  <section class="mt-12 bg-gray-800 p-6 rounded-xl">
    <h2 class="text-2xl font-semibold text-gray-100 mb-2">
      Assumptions
    </h2>
    <InputSection bind:form />
    <RefiSection bind:refi />
  </section>

  <!-- 4) Projection -->
  <section class="mt-12">
    <h2 class="text-2xl font-semibold text-gray-100 mb-2">
      Projection
    </h2>
    <ChartSection bind:form initialYears={form.amortYears} />
    {#if refi.enabled && isFinite(refiResults.breakEvenMonths)}
      <BreakEvenChart monthlyPmt={results.monthlyPmt} {refi} />
    {/if}
  </section>

  <!-- 5) Location (tinted container) -->
  <section class="mt-12 bg-gray-800 p-6 rounded-xl">
    <h2 class="text-2xl font-semibold text-center text-gray-100 mb-2">
      Location
    </h2>
    <label
      for="property-address"
      class="block mb-1 font-medium text-gray-300"
    >
      Property Address
    </label>
    <input
      id="property-address"
      type="text"
      bind:value={address}
      placeholder="123 Main St, Anytown, USA"
      class="w-full rounded-md border border-gray-600 py-2 px-3 focus:border-primary focus:ring-primary"
    />
    <div class="mt-4">
      <MapSection {center} zoom={16} label={address} />
    </div>
  </section>

  <!-- 6) Actions -->
  <section class="mt-8 flex justify-center space-x-4">
    <button on:click={copyLink} class="btn-primary">
      Copy Link
    </button>
    <button on:click={saveScenario} class="btn-primary-lg">
      Save Scenario
    </button>
  </section>

</main>

<footer class="text-center text-sm py-6 border-t mt-10">
  © 2025 RentROICalc. All rights reserved.
</footer>

<style lang="postcss">
  /* uniform card height */
  :global(.stat-card) {
    @apply min-h-[8rem];
  }
  .btn-primary {
    /* your primary button styles */
  }
  .btn-secondary {
    @apply bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200;
  }
  .btn-primary-lg {
    /* your large primary button styles */
  }
</style>
