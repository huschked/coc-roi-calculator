<script lang="ts">
  import { onMount } from "svelte";
  import InputSection from "./components/InputSection.svelte";
  import RefiSection from "./components/RefiSection.svelte";
  import ResultsSection from "./components/ResultsSection.svelte";
  import AdvancedMetrics from "./components/AdvancedMetrics.svelte";
  import ChartSection from "./components/ChartSection.svelte";
  import BreakEvenChart from "./components/BreakEvenChart.svelte";

  import {
    compute,
    computeRefi,
    computeAdvanced,
    type Inputs,
    type RefiInputs,
  } from "./lib/formulas";
  import { readState, writeState } from "./lib/urlSync";

  // State
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
    savedScenarios = savedScenarios; // reassign for Svelte
    localStorage.setItem("savedScenarios", JSON.stringify(savedScenarios));
  }
  function copyLink() {
    navigator.clipboard.writeText(location.href);
    copied = true;
    setTimeout(() => (copied = false), 1500);
  }

  // Computations
  $: results = compute(form);
  $: refiResults = computeRefi(results.monthlyPmt, refi);
  $: advanced = computeAdvanced(form, form.amortYears);

  // Sync URL
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
</script>

<main class="max-w-4xl mx-auto pt-4 px-4 space-y-6">
  <!-- Compact Sticky Header/Navigation -->
  <header
    class="sticky top-0 z-50 backdrop-blur-lg bg-background/95 border-b border-white/10 shadow-lg"
  >
    <nav class="max-w-7xl mx-auto px-4 py-3">
      <div class="flex items-center justify-between">
        <!-- Logo & Branding (Left) -->
        <div class="flex items-center gap-3">
          <img src="/page-title.png" alt="RentROIcalc Logo" class="h-10" />
        </div>

        <!-- Action Buttons (Right) -->
        <div class="flex items-center gap-2">
          <!-- Saved Scenarios Dropdown -->
          <details class="relative">
            <summary
              class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white bg-surface/50 hover:bg-surface/70 rounded-lg cursor-pointer transition-colors list-none"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"
                ></path>
              </svg>
              <span class="hidden sm:inline">Scenarios</span>
            </summary>
            <ul
              class="absolute right-0 mt-2 w-56 bg-slate-800 border border-white/10 rounded-lg shadow-xl z-10 overflow-hidden"
            >
              {#if savedScenarios.length === 0}
                <li class="px-4 py-3 text-sm text-gray-400 text-center">
                  No saved scenarios
                </li>
              {:else}
                {#each savedScenarios as { name }, i}
                  <li
                    class="flex justify-between items-center px-4 py-2 hover:bg-slate-700/50 transition-colors"
                  >
                    <span class="text-gray-200 text-sm truncate flex-1"
                      >{name}</span
                    >
                    <div class="flex gap-2 ml-2">
                      <button
                        on:click={() => loadScenario(i)}
                        class="text-xs text-blue-400 hover:text-blue-300 font-medium"
                        title="Load scenario"
                      >
                        Load
                      </button>
                      <button
                        on:click={() => deleteScenario(i)}
                        class="text-xs text-red-400 hover:text-red-300 font-medium"
                        title="Delete scenario"
                      >
                        ×
                      </button>
                    </div>
                  </li>
                {/each}
              {/if}
            </ul>
          </details>

          <!-- Reset Button -->
          <button
            on:click={() => (location.href = ".")}
            class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white bg-surface/50 hover:bg-surface/70 rounded-lg transition-colors"
            title="Reset all inputs"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              ></path>
            </svg>
            <span class="hidden sm:inline">Reset</span>
          </button>

          <!-- Copy Link Button -->
          <button
            on:click={copyLink}
            class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/80 rounded-lg transition-colors"
            title="Copy shareable link"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              ></path>
            </svg>
            <span class="hidden sm:inline">Share</span>
          </button>
        </div>
      </div>

      <!-- Success Message -->
      {#if copied}
        <div class="mt-2 text-center">
          <span class="inline-flex items-center gap-1 text-sm text-green-400">
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            Link copied to clipboard!
          </span>
        </div>
      {/if}
    </nav>
  </header>

  <!-- 1) Core Metrics -->
  <section
    class="mt-16 p-8 rounded-2xl bg-gradient-to-br from-blue-950/20 via-background to-background"
  >
    <h2
      class="text-3xl font-display font-bold bg-gradient-to-r from-white via-blue-200 to-gray-400 bg-clip-text text-transparent mb-8 flex items-center gap-3"
    >
      <svg
        class="w-8 h-8 text-blue-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        ><path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        ></path></svg
      >
      Core Metrics
    </h2>
    <ResultsSection {results} {refiResults} irr={advanced.irr} />
  </section>

  <!-- 2) Advanced Metrics -->
  <section
    class="mt-16 p-8 rounded-2xl bg-gradient-to-br from-purple-950/20 via-background to-background"
  >
    <h2
      class="text-3xl font-display font-bold bg-gradient-to-r from-white via-purple-200 to-gray-400 bg-clip-text text-transparent mb-8 flex items-center gap-3"
    >
      <svg
        class="w-8 h-8 text-purple-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        ><path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        ></path></svg
      >
      Advanced Metrics
    </h2>
    <AdvancedMetrics {advanced} />
  </section>

  <!-- 3) Assumptions -->
  <section class="mt-16 bg-gray-800 p-8 rounded-2xl border border-white/5">
    <h2
      class="text-3xl font-display font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-8 flex items-center gap-3"
    >
      <svg
        class="w-8 h-8 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        ><path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
        ></path></svg
      >
      Assumptions
    </h2>
    <InputSection bind:form />
    <div class="mt-8 pt-8 border-t border-white/10">
      <RefiSection bind:refi />
    </div>
  </section>

  <!-- 4) Projection -->
  <section
    class="mt-16 p-8 rounded-2xl bg-gradient-to-br from-slate-900/40 via-background to-background"
  >
    <h2
      class="text-3xl font-display font-bold bg-gradient-to-r from-white via-green-200 to-gray-400 bg-clip-text text-transparent mb-8 flex items-center gap-3"
    >
      <svg
        class="w-8 h-8 text-green-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        ><path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
        ></path></svg
      >
      Financial Projection
    </h2>
    <ChartSection bind:form initialYears={form.amortYears} />
    {#if refi.enabled && isFinite(refiResults.breakEvenMonths)}
      <div class="mt-8">
        <BreakEvenChart monthlyPmt={results.monthlyPmt} {refi} />
      </div>
    {/if}
  </section>

  <!-- 5) Actions -->
  <section class="mt-16 mb-8 flex justify-center space-x-4">
    <button on:click={saveScenario} class="btn-primary-lg">Save Scenario</button
    >
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
