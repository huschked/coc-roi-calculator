<script lang="ts">
  import InputSection from "./components/InputSection.svelte";
  import ResultsSection from "./components/ResultsSection.svelte";
  import RefiSection from "./components/RefiSection.svelte";
  import { compute, type Inputs } from "./lib/formulas";
  import { computeRefi, type RefiInputs } from "./lib/formulas";
  import { readState, writeState } from "./lib/urlSync";
  import { onMount } from "svelte";
  import NewsletterModal from "./components/NewsletterModal.svelte";
  import ChartSection from "./components/ChartSection.svelte";
  // import { SpeedInsights } from "@vercel/speed-insights/next"

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

  // Your Brevo embed script (from Forms → Embed)
  const BREVO_URL = "https://sibforms.com/forms/XXXXXXXXX.js";

  // Optionally: track if user already saw it in localStorage
  let seen = false;
  function handleClose() {
    seen = true;
    localStorage.setItem("subSeen", "1");
  }

  // On app load, check if they've seen it before
  onMount(() => {
    seen = Boolean(localStorage.getItem("subSeen"));
  });

  // ----- hydrate from query once on mount -----
  onMount(() => {
    Object.assign(form, readState<Inputs>());
    Object.assign(refi, readState<RefiInputs>());
  });

  /* ---- reactive calculations ---- */
  $: results = compute(form);
  $: refiResults = computeRefi(results.monthlyPmt, refi);

  // debounce so we don’t spam history.replaceState on every keystroke
  let urlTimer: ReturnType<typeof setTimeout>;
  // this $: reruns automatically whenever `form` *or* `refi` changes
  $: {
    // Destructure the nested fields so Svelte knows to re‑run this
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

    console.log("🔍 fields changed →", {
      purchasePrice,
      downPercent,
      interestRate,
      monthlyRent,
      refiEnabled: enabled,
      newRate,
    });

    // Now every time *any* of the above changes, this block re‑fires:
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

<main class="max-w-4xl mx-auto p-6 space-y-10">
  <h1 class="text-3xl font-bold">Cash‑on‑Cash Return Calculator</h1>
  <!-- QoL controls -->
  <div class="text-sm text-gray-500 space-x-4">
    <a href=".">Reset all inputs</a>
    <button
      class="text-primary hover:underline"
      on:click={() => navigator.clipboard.writeText(location.href)}
    >
      Copy shareable link
    </button>
    {#if copied}
      <span class="text-green-600 ml-2">Copied!</span>
    {/if}
  </div>
  <InputSection bind:form />
  <RefiSection bind:refi />

  <!-- Pass both result objects down -->
  <ResultsSection {results} {refiResults} />
  <h2 class="text-2xl font-semibold pt-8">Projection</h2>
  <ChartSection bind:form initialYears={form.amortYears} />
  
  <!-- Popup modal: auto-open after 10s (10000ms), only once per session -->
  {#if !seen}
    <NewsletterModal
      embedScriptUrl={BREVO_URL}
      autoOpenAfter={10000}
      on:close={handleClose}
    />
  {/if}
</main>
