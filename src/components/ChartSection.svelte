<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import type { Inputs } from "../lib/formulas";
    import { amortizationSchedule } from "../lib/formulas";

    const yearOptions = [5, 10, 15, 20, 25, 30];

    export let form: Inputs;
    export let initialYears = 10;
    let projectYears = initialYears;

    let chart: any;
    let canvasEl: HTMLCanvasElement;

    $: yearly = amortizationSchedule(form, projectYears);

    onMount(async () => {
        const { default: Chart } = await import("chart.js/auto");
        const { default: zoomPlugin } = await import("chartjs-plugin-zoom");
        Chart.register(zoomPlugin);

        chart = new Chart(canvasEl, {
            type: "line",
            data: {
                labels: yearly.map((d) => d.year.toString()),
                datasets: [
                    {
                        label: "Loan Balance",
                        data: yearly.map((d) => d.balance),
                        yAxisID: "balanceAxis",
                        borderColor: "rgba(59, 130, 246, 1)",  // blue-500
                        backgroundColor: "rgba(59, 130, 246, 0.1)",
                        fill: false,
                        tension: 0.4, // ← smooth curve
                        pointRadius: 3, // nice dots
                    },
                    {
                        label: "Annual Cash Flow",
                        data: yearly.map((d) => d.cashFlow),
                        yAxisID: "cashFlowAxis",
                        borderColor: "rgba(16, 185, 129, 1)", // emerald-500
                        backgroundColor: "rgba(16, 185, 129, 0.1)",
                        fill: false,
                        tension: 0.4,
                        pointRadius: 3,
                    },
                ],
            },
            options: {
                responsive: true,
                animation: {
                    duration: 1200,
                    easing: "easeOutQuart",
                },
                scales: {
                    balanceAxis: {
                        type: "linear",
                        position: "left",
                        title: {
                            display: true,
                            text: "Balance ($)",
                        },
                        ticks: {
                            callback: (val) => `$${Number(val).toLocaleString()}`,
                        },
                    },
                    cashFlowAxis: {
                        type: "linear",
                        position: "right",
                        title: {
                            display: true,
                            text: "Cash Flow ($)",
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
                        position: "bottom",
                    },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => `${ctx.dataset.label}: $${ctx.parsed.y.toLocaleString()}`,
                        },
                    },
                    zoom: {
                        pan: {
                            enabled: true,
                            mode: "x",
                        },
                        zoom: {
                            wheel: { enabled: true },
                            pinch: { enabled: true },
                            mode: "x",
                        },
                    },
                },
                elements: {
                    line: {
                        tension: 0.4, // smooth curve (again here for older chartjs)
                    },
                },
            },
        });
    });

    $: if (chart) {
        chart.data.labels = yearly.map((d) => d.year.toString());
        chart.data.datasets[0].data = yearly.map((d) => d.balance);
        chart.data.datasets[1].data = yearly.map((d) => d.cashFlow);
        chart.update();
    }

    onDestroy(() => {
        chart?.destroy();
    });

    const resetZoom = () => chart?.resetZoom();
</script>

<div class="mt-10 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow">
    <div class="flex items-center mb-4 space-x-4">
        <label for="projectYears" class="text-gray-700 dark:text-gray-300">
            Projection horizon
        </label>
        <select
            id="projectYears"
            bind:value={projectYears}
            class="rounded border-gray-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-1"
        >
            {#each yearOptions as y}
                <option value={y}>{y} yrs</option>
            {/each}
        </select>
        <button
            on:click={resetZoom}
            class="ml-auto text-sm text-primary hover:underline"
        >
            Reset Zoom
        </button>
    </div>
    <canvas bind:this={canvasEl} class="w-full h-64"></canvas>
</div>
