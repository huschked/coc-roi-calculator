<script lang="ts">
    import type { RefiInputs } from "../lib/formulas";
    export let refi: RefiInputs;

    /* hold percent as string for the input, convert only on blur */
    let newRatePct = (refi.newRate * 100).toFixed(3);
    const syncRate = () => (refi.newRate = +newRatePct / 100);
</script>

<!-- Collapsible details element keeps UI tidy -->
<details bind:open={refi.enabled} class="mt-8">
    <summary class="cursor-pointer font-medium text-primary">
        Consider a refinance?
    </summary>

    <div class="grid gap-6 md:grid-cols-2 mt-4">
        <label class="block">
            <span class="label">New loan amount ($)</span>
            <input
                class="input"
                type="number"
                min="0"
                step="1000"
                bind:value={refi.newLoanAmount}
            />
        </label>

        <label class="block">
            <span class="label">New interest rate (%)</span>
            <input
                class="input with-suffix"
                type="number"
                min="0"
                step="0.001"
                bind:value={newRatePct}
                on:blur={syncRate}
            />
        </label>

        <label class="block">
            <span class="label">New term (years)</span>
            <input
                class="input"
                type="number"
                min="1"
                max="40"
                step="1"
                bind:value={refi.newTermYears}
            />
        </label>

        <label class="block">
            <span class="label">Refi closing costs ($)</span>
            <input
                class="input"
                type="number"
                min="0"
                step="100"
                bind:value={refi.closingCosts}
            />
        </label>
    </div>
</details>

<style>
    .label {
        @apply block mb-1 text-sm font-medium text-gray-700;
    }
    .input {
        @apply w-full rounded-md border border-gray-300 py-2 px-3
                     focus:border-primary focus:ring-primary;
    }
</style>
