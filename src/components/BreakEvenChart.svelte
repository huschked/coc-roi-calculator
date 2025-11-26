<!-- src/components/BreakEvenChart.svelte -->
<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import type { RefiInputs } from "../lib/formulas";
  import { computeRefi } from "../lib/formulas";

  // Props: monthly payment + refinance inputs
  export let monthlyPmt: number = 0;
  export let refi: RefiInputs = {
    enabled: false,
    newLoanAmount: 0,
    newRate: 0,
    newTermYears: 0,
    closingCosts: 0,
  };

  let chart: any;
  let canvasEl: HTMLCanvasElement;

  // 1) Recompute the refinance results on every change
  $: refiResults = computeRefi(monthlyPmt, refi);
  $: monthlySavings = refiResults?.monthlySavings ?? 0;
  $: breakEvenMonths = refiResults?.breakEvenMonths ?? Infinity;

  // 2) Build our data array
  $: data =
    refi.enabled && isFinite(breakEvenMonths)
      ? Array.from(
          { length: Math.ceil(breakEvenMonths * 1.2) + 1 },
          (_, m) => ({
            month: m,
            value: monthlySavings * m - refi.closingCosts,
          }),
        )
      : [{ month: 0, value: -refi.closingCosts }];

  onMount(async () => {
    const { default: Chart } = await import("chart.js/auto");

    // Set global defaults for dark mode
    Chart.defaults.color = "#94a3b8";
    Chart.defaults.borderColor = "rgba(255, 255, 255, 0.1)";

    chart = new Chart(canvasEl, {
      type: "line",
      data: {
        labels: data.map((d) => d.month.toString()),
        datasets: [
          {
            label: "Cumulative Savings ($)",
            data: data.map((d) => d.value),
            // 3) Scriptable borderColor: pick red if y<0, green otherwise
            borderColor: (ctx: any) => {
              const y = ctx.parsed?.y ?? ctx.raw ?? 0;
              return y < 0
                ? "#ef4444" // danger
                : "#10b981"; // accent
            },
            // 4) Fill area: green above 0, red below
            fill: {
              target: "origin",
              above: "rgba(16, 185, 129, 0.1)",
              below: "rgba(239, 68, 68, 0.1)",
            },
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: { display: true, text: "Month", color: "#64748b" },
            ticks: { color: "#94a3b8" },
            grid: { display: false },
          },
          y: {
            title: { display: true, text: "Savings ($)", color: "#64748b" },
            ticks: {
              color: "#94a3b8",
              callback: (v: any) => `$${Number(v).toLocaleString()}`,
            },
            grid: { color: "rgba(255,255,255,0.05)" },
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "rgba(15, 23, 42, 0.9)",
            titleColor: "#f8fafc",
            bodyColor: "#cbd5e1",
            borderColor: "rgba(255, 255, 255, 0.1)",
            borderWidth: 1,
            padding: 12,
            displayColors: false,
            callbacks: {
              label: (ctx) => `Savings: $${ctx.parsed.y.toLocaleString()}`,
            },
          },
        },
        interaction: {
          mode: "index",
          intersect: false,
        },
      },
    });
  });

  // 5) Update the chart whenever `data` changes
  $: if (chart) {
    chart.data.labels = data.map((d) => d.month.toString());
    chart.data.datasets[0].data = data.map((d) => d.value);
    chart.update();
  }

  onDestroy(() => {
    chart?.destroy();
  });
</script>

<div class="glass-panel p-6">
  <h3
    class="text-lg font-display font-bold text-white mb-4 flex items-center gap-2"
  >
    <svg
      class="w-5 h-5 text-accent"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      ><path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      ></path></svg
    >
    Break-Even Timeline
  </h3>

  <div class="relative w-full h-[300px]">
    <canvas bind:this={canvasEl}></canvas>
  </div>

  {#if refi.enabled && isFinite(breakEvenMonths)}
    <div
      class="mt-4 p-3 bg-surface/50 rounded-lg border border-white/5 text-sm text-gray-400 leading-relaxed"
    >
      You start at <span class="text-danger font-medium"
        >–${refi.closingCosts.toLocaleString()}</span
      >
      (closing costs). Each month you save
      <span class="text-accent font-medium"
        >+${monthlySavings.toLocaleString()}</span
      >.
      <div class="mt-2 pt-2 border-t border-white/5">
        Break-even in <strong class="text-white"
          >{breakEvenMonths.toFixed(1)} months</strong
        >
        (~{(breakEvenMonths / 12).toFixed(1)} years).
      </div>
    </div>
  {/if}
</div>
