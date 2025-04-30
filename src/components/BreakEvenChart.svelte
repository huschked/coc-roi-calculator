<!-- src/components/BreakEvenChart.svelte -->
<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import type { RefiInputs } from "../lib/formulas";
    import { computeRefi } from "../lib/formulas";
  
    export let monthlyPmt: number;
    export let refi: RefiInputs;
  
    let chart: any;
    let canvasEl: HTMLCanvasElement;
  
    // Re-compute when inputs change
    $: refiResults     = computeRefi(monthlyPmt, refi);
    $: monthlySavings  = refiResults?.monthlySavings ?? 0;
    $: breakEvenMonths = refiResults?.breakEvenMonths ?? 0;
  
    // Build the cumulative‐savings data
    $: data =
      refi.enabled && monthlySavings > 0
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
          labels: data.map(d => d.month.toString()),
          datasets: [{
            label: "Cumulative Savings ($)",
            data: data.map(d => d.value),
            borderColor: "rgba(16,185,129,1)",
            backgroundColor: "rgba(16,185,129,0.2)",
            fill: true,
            tension: 0.4,
            pointRadius: 2
          }]
        },
        options: {
          responsive: true,
          scales: {
            x: {
              title:  { display: true, text: "Month", color: "#fff" },
              ticks:  { color: "#aaa" },
              grid:   { color: "rgba(255,255,255,0.1)" }
            },
            y: {
              title:  { display: true, text: "Savings ($)", color: "#fff" },
              ticks:  {
                color: "#aaa",
                callback: v => `$${Number(v).toLocaleString()}`
              },
              grid:   { color: "rgba(255,255,255,0.1)" }
            }
          },
          plugins: {
            legend: { labels: { color: "#fff" } }
          }
        }
      });
    });
  
    // update on data change
    $: if (chart) {
      chart.data.labels = data.map(d => d.month.toString());
      chart.data.datasets[0].data = data.map(d => d.value);
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
  
    {#if refi.enabled && breakEvenMonths !== Infinity}
      <figcaption class="mt-4 text-sm text-gray-300">
        This chart shows your cumulative refinance savings over time. You start
        at –your closing costs (<code>–${refi.closingCosts.toLocaleString()}</code>),
        then each month add your monthly savings (<code>+${monthlySavings.toLocaleString()}</code>).
        When the line crosses zero at about <strong>{breakEvenMonths.toFixed(1)} months</strong>
        (~{(breakEvenMonths/12).toFixed(2)} years), you’ve fully recouped those costs.
      </figcaption>
    {/if}
  </figure>
  