<script lang="ts">
    import type { Inputs } from "../lib/formulas";
    export let form: Inputs;
</script>

<div class="grid gap-6 md:grid-cols-2 mt-8">
    <!-- Purchase Price -->
    <label class="block">
        <div class="flex items-center gap-1">
            <span class="label">Purchase Price</span>
            <div class="tooltip-container">
                ❓
                <div class="tooltip">
                    Total price you are paying for the property.
                </div>
            </div>
        </div>
        <input
            class="input with-prefix"
            type="number"
            min="0"
            step="1000"
            bind:value={form.purchasePrice}
        />
    </label>

    <!-- Down Payment -->
    <label class="block">
        <div class="flex items-center gap-1">
            <span class="label">Down‑Payment</span>
            <div class="tooltip-container">
                ❓
                <div class="tooltip">
                    Percent of the price you are paying upfront.
                </div>
            </div>
        </div>
        <input
            class="input with-suffix"
            type="number"
            min="0"
            max="100"
            step="0.1"
            bind:value={form.downPercent}
        />
    </label>

    <!-- Closing Costs -->
    <label class="block">
        <div class="flex items-center gap-1">
            <span class="label">Closing Costs</span>
            <div class="tooltip-container">
                ❓
                <div class="tooltip">
                    Estimated additional costs at closing (taxes, fees).
                </div>
            </div>
        </div>
        <input
            class="input with-prefix"
            type="number"
            min="0"
            step="100"
            bind:value={form.closingCosts}
        />
    </label>

    <!-- Rehab Budget -->
    <label class="block">
        <div class="flex items-center gap-1">
            <span class="label">Rehab Budget</span>
            <div class="tooltip-container">
                ❓
                <div class="tooltip">
                    Estimated renovation or repair costs after purchase.
                </div>
            </div>
        </div>
        <input
            class="input with-prefix"
            type="number"
            min="0"
            step="100"
            bind:value={form.rehabCosts}
        />
    </label>

    <!-- Interest Rate -->
    <label class="block">
        <div class="flex items-center gap-1">
            <span class="label">Interest Rate</span>
            <div class="tooltip-container">
                ❓
                <div class="tooltip">
                    Annual interest rate for your mortgage loan.
                </div>
            </div>
        </div>
        <input
            class="input with-suffix"
            type="number"
            min="0"
            step="0.001"
            bind:value={form.interestRate}
        />
    </label>

    <!-- Amortisation Years -->
    <label class="block">
        <div class="flex items-center gap-1">
            <span class="label">Amortisation (Years)</span>
            <div class="tooltip-container">
                ❓
                <div class="tooltip">
                    Length of the loan in years (typically 15–30 years).
                </div>
            </div>
        </div>
        <input
            class="input"
            type="number"
            min="1"
            max="40"
            step="1"
            bind:value={form.amortYears}
        />
    </label>

    <!-- Monthly Rent -->
    <label class="block">
        <div class="flex items-center gap-1">
            <span class="label">Monthly Rent</span>
            <div class="tooltip-container">
                ❓
                <div class="tooltip">Expected monthly rental income.</div>
            </div>
        </div>
        <input
            class="input with-prefix"
            type="number"
            min="0"
            step="100"
            bind:value={form.monthlyRent}
        />
    </label>

    <!-- Vacancy Rate -->
    <label class="block">
        <div class="flex items-center gap-1">
            <span class="label">Vacancy Rate</span>
            <div class="tooltip-container">
                ❓
                <div class="tooltip">
                    Percentage of the year the property is expected to be
                    vacant.
                </div>
            </div>
        </div>
        <input
            class="input with-suffix"
            type="number"
            min="0"
            max="100"
            step="0.1"
            bind:value={form.vacancyRate}
        />
    </label>

    <!-- Monthly OpEx -->
    <label class="block md:col-span-2">
        <div class="flex items-center gap-1">
            <span class="label">Monthly Operating Expenses</span>
            <div class="tooltip-container">
                ❓
                <div class="tooltip">
                    Average monthly maintenance, management, and insurance
                    costs.
                </div>
            </div>
        </div>
        <input
            class="input with-prefix"
            type="number"
            min="0"
            step="100"
            bind:value={form.monthlyOpEx}
        />
    </label>
</div>

<style lang="postcss">
    .label {
        @apply block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300;
    }
    .input {
        @apply w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3
           focus:border-primary focus:ring-primary;
    }
    .tooltip-container {
        @apply relative text-xs text-gray-400 dark:text-gray-500 cursor-pointer;
    }

    .tooltip {
        @apply absolute z-10 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 w-64 sm:w-48 mt-2 left-0 sm:left-1/2 transform sm:-translate-x-1/2;
        top: 100%;
        white-space: normal;
        max-width: 16rem;
    }

    .tooltip-container:hover .tooltip {
        display: block;
    }
</style>
