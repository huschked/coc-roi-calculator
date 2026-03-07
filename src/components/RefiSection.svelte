<script lang="ts">
    import type { RefiInputs } from "../lib/formulas";
    export let refi: RefiInputs;

    let newRatePct = "";

    const syncRate = () => {
        const parsed = parseFloat(newRatePct);
        refi.newRate = Number.isFinite(parsed) ? parsed / 100 : 0;
    };

    $: {
        const fromModel = (Number(refi.newRate) || 0) * 100;
        const asNumber = parseFloat(newRatePct);
        if (!Number.isFinite(asNumber) || Math.abs(asNumber - fromModel) > 0.0005) {
            newRatePct = fromModel.toFixed(3);
        }
    }
</script>

<!-- Collapsible section -->
<div class="mt-8">
    <button
        on:click={() => (refi.enabled = !refi.enabled)}
        class="w-full flex items-center justify-between p-4 bg-surface/50 hover:bg-surface/80 border border-white/10 rounded-xl transition-all group"
    >
        <div class="flex items-center space-x-3">
            <div
                class={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${refi.enabled ? "bg-primary text-white" : "bg-slate-700 text-gray-400"}`}
            >
                <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    ><path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                    ></path></svg
                >
            </div>
            <div class="text-left">
                <span class="block text-sm font-semibold text-white"
                    >Refinance Analysis</span
                >
                <span class="block text-xs text-gray-400"
                    >Compare with a new loan scenario</span
                >
            </div>
        </div>
        <div
            class={`transform transition-transform duration-200 ${refi.enabled ? "rotate-180" : ""}`}
        >
            <svg
                class="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                ><path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                ></path></svg
            >
        </div>
    </button>

    {#if refi.enabled}
        <div class="mt-6 grid gap-6 md:grid-cols-2 animate-slide-up">
            <!-- New Loan Amount -->
            <label class="block group">
                <span
                    class="text-sm font-medium text-gray-300 mb-1 block group-hover:text-white transition-colors"
                    >New Loan Amount ($)</span
                >
                <input
                    class="input-field"
                    type="number"
                    min="0"
                    step="1000"
                    bind:value={refi.newLoanAmount}
                />
            </label>

            <!-- New Interest Rate -->
            <label class="block group">
                <span
                    class="text-sm font-medium text-gray-300 mb-1 block group-hover:text-white transition-colors"
                    >New Interest Rate (%)</span
                >
                <input
                    class="input-field"
                    type="number"
                    min="0"
                    max="100"
                    step="0.001"
                    bind:value={newRatePct}
                    on:input={syncRate}
                />
            </label>

            <!-- New Term (Years) -->
            <label class="block group">
                <span
                    class="text-sm font-medium text-gray-300 mb-1 block group-hover:text-white transition-colors"
                    >New Term (Years)</span
                >
                <input
                    class="input-field"
                    type="number"
                    min="1"
                    max="40"
                    step="1"
                    bind:value={refi.newTermYears}
                />
            </label>

            <!-- Refi Closing Costs -->
            <label class="block group">
                <span
                    class="text-sm font-medium text-gray-300 mb-1 block group-hover:text-white transition-colors"
                    >Refi Closing Costs ($)</span
                >
                <input
                    class="input-field"
                    type="number"
                    min="0"
                    step="100"
                    bind:value={refi.closingCosts}
                />
            </label>
        </div>
    {/if}
</div>

<style lang="postcss">
    /* No custom styles needed, using global classes */
</style>
