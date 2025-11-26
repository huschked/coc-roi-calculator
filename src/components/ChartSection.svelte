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

        // Set global defaults for dark mode
        Chart.defaults.color = "#94a3b8";
        Chart.defaults.borderColor = "rgba(255, 255, 255, 0.1)";

        chart = new Chart(canvasEl, {
            type: "line",
            data: {
                labels: yearly.map((d) => d.year.toString()),
                datasets: [
                    {
                        label: "Loan Balance",
                        data: yearly.map((d) => d.balance),
                        yAxisID: "balanceAxis",
                        borderColor: "#3b82f6", // primary
                        backgroundColor: "rgba(59, 130, 246, 0.1)",
                        fill: true,
                        tension: 0.4,
                        pointRadius: 4,
                        pointBackgroundColor: "#1e293b",
                        pointBorderColor: "#3b82f6",
                        pointBorderWidth: 2,
                    },
                    {
                        label: "Annual Cash Flow",
                        data: yearly.map((d) => d.cashFlow),
                        yAxisID: "cashFlowAxis",
                        borderColor: "#10b981", // accent
                        backgroundColor: "rgba(16, 185, 129, 0.1)",
                        fill: true,
                        tension: 0.4,
                        pointRadius: 4,
                        pointBackgroundColor: "#1e293b",
                        pointBorderColor: "#10b981",
                        pointBorderWidth: 2,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 1200,
                    easing: "easeOutQuart",
                },
                interaction: {
                    mode: "index",
                    intersect: false,
                },
                scales: {
                    x: {
                        grid: {
                            display: false,
                        },
                    },
                    balanceAxis: {
                        type: "linear",
                        position: "left",
                        title: {
                            display: true,
                            text: "Balance ($)",
                            color: "#64748b",
                        },
                        ticks: {
                            callback: (val) =>
                                `$${Number(val).toLocaleString()}`,
                        },
                        grid: {
                            color: "rgba(255, 255, 255, 0.05)",
                        },
                    },
                    cashFlowAxis: {
                        type: "linear",
                        position: "right",
                        title: {
                            display: true,
                            text: "Cash Flow ($)",
                            color: "#64748b",
                        },
                        grid: {
                            drawOnChartArea: false,
                        },
                        ticks: {
                            callback: (val) =>
                                `$${Number(val).toLocaleString()}`,
                        },
                    },
                },
                plugins: {
                    legend: {
                        position: "top",
                        align: "end",
                        labels: {
                            usePointStyle: true,
                            boxWidth: 8,
                        },
                    },
                    tooltip: {
                        backgroundColor: "rgba(15, 23, 42, 0.9)",
                        titleColor: "#f8fafc",
                        bodyColor: "#cbd5e1",
                        borderColor: "rgba(255, 255, 255, 0.1)",
                        borderWidth: 1,
                        padding: 12,
                        displayColors: true,
                        callbacks: {
                            label: (ctx) =>
                                `${ctx.dataset.label}: $${ctx.parsed.y.toLocaleString()}`,
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

<div class="glass-panel p-6">
    <div class="flex items-center justify-between mb-6">
        <h2
            class="text-xl font-display font-bold text-white flex items-center gap-2"
        >
            <svg
                class="w-5 h-5 text-primary"
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
            Projections
        </h2>

        <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
                <label for="projectYears" class="text-sm text-gray-400">
                    Horizon
                </label>
                <select
                    id="projectYears"
                    bind:value={projectYears}
                    class="bg-surface border border-white/10 text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-1.5"
                >
                    {#each yearOptions as y}
                        <option value={y}>{y} Years</option>
                    {/each}
                </select>
            </div>
            <button
                on:click={resetZoom}
                class="text-xs text-primary hover:text-primary-glow transition-colors uppercase tracking-wider font-semibold"
            >
                Reset Zoom
            </button>
        </div>
    </div>

    <div class="relative w-full h-[400px]">
        <canvas bind:this={canvasEl}></canvas>
    </div>
</div>
