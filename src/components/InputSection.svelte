<script lang="ts">
    import Field from "./Field.svelte";
    import type { Inputs } from "../lib/formulas";

    export let form: Inputs;

    /* Percent helper – converts entered % into decimal form */
    const setPercent = (e: Event, key: keyof Inputs) =>
        (form[key] = +(e.target as HTMLInputElement).value / 100);
    /* Local helpers to manage % inputs */
    let interestPct = (form.interestRate * 100).toFixed(2);
    let vacancyPct = (form.vacancyRate * 100).toFixed(1);

    /* When user finishes editing (on:blur), push the decimal value back */
    const syncRate = () => (form.interestRate = +interestPct / 100);
    const syncVac = () => (form.vacancyRate = +vacancyPct / 100);
</script>

<!-- 2‑column grid on md+, stacked on mobile -->
<div class="grid gap-6 md:grid-cols-2">
    <!-- {/** ---------- Purchase & Rehab ---------- **/} -->
    <Field label="Purchase price" prefix="$">
        <input
            class="input with-prefix"
            type="number"
            min="0"
            step="1000"
            bind:value={form.purchasePrice}
        />
    </Field>

    <Field label="Down‑payment" suffix="%">
        <input
            class="input with-suffix"
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={form.downPercent * 100}
            on:input={(e) => setPercent(e, "downPercent")}
        />
    </Field>

    <Field label="Closing costs" prefix="$">
        <input
            class="input with-prefix"
            type="number"
            min="0"
            step="100"
            bind:value={form.closingCosts}
        />
    </Field>

    <Field label="Rehab budget" prefix="$">
        <input
            class="input with-prefix"
            type="number"
            min="0"
            step="500"
            bind:value={form.rehabCosts}
        />
    </Field>

    <!-- {/** ---------- Financing ---------- **/} -->
    <Field label="Interest rate" suffix="%">
        <input
            class="input with-suffix"
            type="number"
            min="0"
            step="0.01"
            bind:value={interestPct}
            on:blur={syncRate}
        />
    </Field>

    <Field label="Amortisation (years)">
        <input
            class="input"
            type="number"
            min="1"
            max="40"
            step="1"
            bind:value={form.amortYears}
        />
    </Field>

    <!-- {/** ---------- Income & Expenses ---------- **/} -->
    <Field label="Monthly rent" prefix="$">
        <input
            class="input with-prefix"
            type="number"
            min="0"
            step="50"
            bind:value={form.monthlyRent}
        />
    </Field>

    <!-- Vacancy -->
    <Field label="Vacancy rate" suffix="%">
        <input
            class="input with-suffix"
            type="number"
            min="0"
            max="100"
            step="0.1"
            bind:value={vacancyPct}
            on:blur={syncVac}
        />
    </Field>

    <Field label="Monthly operating expenses" prefix="$">
        <input
            class="input with-prefix"
            type="number"
            min="0"
            step="50"
            bind:value={form.monthlyOpEx}
        />
    </Field>
</div>

<style>
    /* Shared Tailwind utility bundle for all text inputs */
    .input {
        @apply w-full rounded-md border border-gray-300 py-2 px-3
             focus:border-primary focus:ring-primary;
    }
    /* Extra padding when adornments are present */
    .with-prefix {
        padding-left: 2.75rem;
    } /* 44 px */
    .with-suffix {
        padding-right: 2.75rem;
    } /* 44 px */
    /* Optional: mark negative numbers immediately */
    /* Stronger invalid highlight */
    :global(input:invalid) {
        @apply border-red-500 ring-1 ring-red-500 focus:border-red-600 focus:ring-red-600;
    }
</style>
