<script lang="ts">
    export let cashOnCash: number;
    export let annualCashFlow: number;
    export let irr: number;

    // Determine deal quality based on thresholds
    $: cocGood = cashOnCash >= 0.08;
    $: cashFlowGood = annualCashFlow > 0;
    $: irrGood = irr >= 0.12;

    $: criteriaMetCount = [cocGood, cashFlowGood, irrGood].filter(
        Boolean,
    ).length;

    $: dealQuality =
        criteriaMetCount === 3
            ? "great"
            : criteriaMetCount >= 2
              ? "decent"
              : "poor";

    $: badgeColor =
        dealQuality === "great"
            ? "bg-green-500/20 border-green-500 text-green-400"
            : dealQuality === "decent"
              ? "bg-yellow-500/20 border-yellow-500 text-yellow-400"
              : "bg-red-500/20 border-red-500 text-red-400";

    $: badgeIcon =
        dealQuality === "great" ? "✓" : dealQuality === "decent" ? "⚠" : "✗";

    $: badgeText =
        dealQuality === "great"
            ? "Great Deal"
            : dealQuality === "decent"
              ? "Decent Deal"
              : "Poor Deal";
</script>

<div class="mb-6 p-4 rounded-xl border-2 {badgeColor} backdrop-blur-sm">
    <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
            <span class="text-3xl">{badgeIcon}</span>
            <div>
                <h3 class="text-lg font-bold">{badgeText}</h3>
                <p class="text-xs opacity-75">
                    {criteriaMetCount} of 3 criteria met
                </p>
            </div>
        </div>
        <div class="text-right">
            <div class="text-xs opacity-75 space-y-1">
                <div
                    class:text-green-400={cocGood}
                    class:text-red-400={!cocGood}
                >
                    {cocGood ? "✓" : "✗"} COC ROI {cocGood ? "≥" : "<"} 8%
                </div>
                <div
                    class:text-green-400={cashFlowGood}
                    class:text-red-400={!cashFlowGood}
                >
                    {cashFlowGood ? "✓" : "✗"} Positive Cash Flow
                </div>
                <div
                    class:text-green-400={irrGood}
                    class:text-red-400={!irrGood}
                >
                    {irrGood ? "✓" : "✗"} IRR {irrGood ? "≥" : "<"} 12%
                </div>
            </div>
        </div>
    </div>
</div>
