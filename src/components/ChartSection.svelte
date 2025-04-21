<!-- ── src/components/ChartSection.svelte ── -->
<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import type { Inputs } from '../lib/formulas';
    import { amortizationSchedule } from '../lib/formulas';
  
    /** Receive the main form inputs */
    export let form: Inputs;
    /** How many years to plot */
    export let projectYears = 10;
  
    let chart: any;
    let canvasEl: HTMLCanvasElement;
  
    // Reactive yearly data when form or projectYears change
    $: yearly = amortizationSchedule(form, projectYears);
  
    onMount(async () => {
      // Lazy‑load Chart.js so it isn't in the initial bundle
      const { default: Chart } = await import('chart.js/auto');
  
      chart = new Chart(canvasEl, {
        type: 'line',
        data: {
          labels: yearly.map((d) => d.year.toString()),
          datasets: [
            {
              label: 'Loan Balance',
              data: yearly.map((d) => d.balance),
              yAxisID: 'balanceAxis',
              borderColor: 'rgba(59, 130, 246, 1)', // blue‑500
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              fill: false,
            },
            {
              label: 'Annual Cash Flow',
              data: yearly.map((d) => d.cashFlow),
              yAxisID: 'cashFlowAxis',
              borderColor: 'rgba(16, 185, 129, 1)', // emerald‑500
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            balanceAxis: {
              type: 'linear',
              position: 'left',
              title: {
                display: true,
                text: 'Balance ($)',
              },
              ticks: {
                callback: (val) => `$${Number(val).toLocaleString()}`,
              },
            },
            cashFlowAxis: {
              type: 'linear',
              position: 'right',
              title: {
                display: true,
                text: 'Cash Flow ($)',
              },
              grid: {
                drawOnChartArea: false,
              },
              ticks: {
                callback: (val) => `$${Number(val).toLocaleString()}`,
              },
            },
          },
          plugins: {
            legend: {
              position: 'bottom',
            },
            tooltip: {
              callbacks: {
                label: (ctx) =>
                  `${ctx.dataset.label}: $${ctx.parsed.y.toLocaleString()}`,
              },
            },
          },
        },
      });
    });
  
    // Update chart when data changes
    $: if (chart) {
      chart.data.labels = yearly.map((d) => d.year.toString());
      chart.data.datasets[0].data = yearly.map((d) => d.balance);
      chart.data.datasets[1].data = yearly.map((d) => d.cashFlow);
      chart.update();
    }
  
    onDestroy(() => {
      chart?.destroy();
    });
  </script>
  
  <div class="mt-10">
    <canvas bind:this={canvasEl} class="w-full h-64"></canvas>
  </div>
  