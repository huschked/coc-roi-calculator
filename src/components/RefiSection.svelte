<script lang="ts">
    import type { RefiInputs } from "../lib/formulas";
    import Field from "./Field.svelte";
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
        <Field label="New Loan Amount" prefix="$" id="newLoanAmount">
            <input
                class="input with-prefix"
                id="newLoanAmount"
                type="number"
                min="0"
                step="1000"
                bind:value={refi.newLoanAmount}
            />
        </Field>

        <!-- New interest rate -->
        <Field label="New Rate" suffix="%" id="newRate">
            <input
                class="input with-suffix"
                id="newRate"
                type="number"
                min="0"
                step="0.001"
                bind:value={newRatePct}
                on:blur={syncRate}
            />
        </Field>

        <!-- New term (years) -->
        <Field label="New Term (Years)" id="newTermYears">
            <input
                class="input"
                id="newTermYears"
                type="number"
                min="1"
                max="40"
                step="1"
                bind:value={refi.newTermYears}
            />
        </Field>

        <!-- Refi closing costs -->
        <Field label="Refi Closing Costs ($)" prefix="$" id="refiClosingCosts">
            <input
                class="input with-prefix"
                id="refiClosingCosts"
                type="number"
                min="0"
                step="100"
                bind:value={refi.closingCosts}
            />
        </Field>
    </div>
</details>

<style lang="postcss">
    .label {
        @apply block mb-1 text-sm font-medium text-gray-700;
    }
    .input {
        @apply w-full rounded-md border border-gray-300 py-2 px-3
             focus:border-primary focus:ring-primary;
    }
    .with-prefix {
        padding-left: 2.5rem;
    } /* 44 px */
    .with-suffix {
        padding-right: 2.5rem;
    }
</style>
