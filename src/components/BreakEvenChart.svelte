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
  $: refiResults     = computeRefi(monthlyPmt, refi);
  $: monthlySavings  = refiResults?.monthlySavings  ?? 0;
  $: breakEvenMonths = refiResults?.breakEvenMonths ?? Infinity;

  // 2) Build our data array
  $: data =
    refi.enabled && isFinite(breakEvenMonths)
      ? Array.from(
          { length: Math.ceil(breakEvenMonths * 1.2) + 1 },
          (_, m) => ({ month: m, value: monthlySavings * m - refi.closingCosts })
        )
      : [{ month: 0, value: -refi.closingCosts }];

  onMount(async () => {
    const { default: Chart } = await import("chart.js/auto");
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
                ? "rgba(239,68,68,1)"   // red-500
                : "rgba(16,185,129,1)"; // emerald-500
            },
            // 4) Fill area: green above 0, red below
            fill: {
              target: "origin",
              above: "rgba(16,185,129,0.2)",
              below: "rgba(239,68,68,0.2)",
            },
            tension: 0.4,
            pointRadius: 2,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: { display: true, text: "Month", color: "#fff" },
            ticks: { color: "#aaa" },
            grid: { color: "rgba(255,255,255,0.1)" },
          },
          y: {
            title: { display: true, text: "Savings ($)", color: "#fff" },
            ticks: {
              color: "#aaa",
              callback: (v: any) => `$${Number(v).toLocaleString()}`,
            },
            grid: { color: "rgba(255,255,255,0.1)" },
          },
        },
        plugins: {
          legend: { labels: { color: "#fff" } },
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

<figure class="mt-10 p-6 bg-gray-800 rounded-2xl shadow">
  <h3 class="text-xl font-semibold mb-4 text-white">
    Break-Even Timeline
  </h3>

  <canvas bind:this={canvasEl} class="w-full h-48"></canvas>

  {#if refi.enabled && isFinite(breakEvenMonths)}
    <figcaption class="mt-4 text-sm text-gray-300">
      This chart shows your cumulative refinance savings over time. You start
      at – your closing costs
      (<code>–${refi.closingCosts.toLocaleString()}</code>), then each month add
      your monthly savings
      (<code>+${monthlySavings.toLocaleString()}</code>). When the line crosses
      zero at about <strong>{breakEvenMonths.toFixed(1)} months</strong>
      (~{(breakEvenMonths / 12).toFixed(2)} years), you’ve fully recouped those
      costs.
    </figcaption>
  {/if}
</figure>
