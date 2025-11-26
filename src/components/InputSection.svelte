<script lang="ts">
    import type { Inputs } from "../lib/formulas";
    import { calculateMonthlyOpEx } from "../lib/formulas";
    export let form: Inputs;

    // Local display values for percentage inputs (shown as 5.00 for 5%)
    let downPercentDisplay = (form.downPercent * 100).toFixed(2);
    let interestRateDisplay = (form.interestRate * 100).toFixed(3);
    let rentGrowthDisplay = (form.rentGrowthRate * 100).toFixed(2);
    let vacancyRateDisplay = (form.vacancyRate * 100).toFixed(2);
    let appreciationDisplay = (form.appreciationRate * 100).toFixed(2);
    let marketTrendDisplay = (form.marketTrendAdjustment * 100).toFixed(2);
    let propertyMgmtDisplay = (form.propertyMgmtPercent * 100).toFixed(1);

    // Sync functions to convert percentage display to decimal
    function updateDownPercent() {
        const val = parseFloat(downPercentDisplay);
        form.downPercent = isNaN(val) ? 0 : val / 100;
    }

    function updateInterestRate() {
        const val = parseFloat(interestRateDisplay);
        form.interestRate = isNaN(val) ? 0 : val / 100;
    }

    function updateRentGrowth() {
        const val = parseFloat(rentGrowthDisplay);
        form.rentGrowthRate = isNaN(val) ? 0 : val / 100;
    }

    function updateVacancyRate() {
        const val = parseFloat(vacancyRateDisplay);
        form.vacancyRate = isNaN(val) ? 0 : val / 100;
    }

    function updateAppreciation() {
        const val = parseFloat(appreciationDisplay);
        form.appreciationRate = isNaN(val) ? 0 : val / 100;
    }

    function updateMarketTrend() {
        const val = parseFloat(marketTrendDisplay);
        form.marketTrendAdjustment = isNaN(val) ? 0 : val / 100;
    }

    function updatePropertyMgmt() {
        const val = parseFloat(propertyMgmtDisplay);
        form.propertyMgmtPercent = isNaN(val) ? 0 : val / 100;
    }

    // Calculate total detailed expenses for display
    $: totalDetailedExpenses = calculateMonthlyOpEx(form);

    // Watch for external changes to form and update displays
    $: downPercentDisplay = (form.downPercent * 100).toFixed(2);
    $: interestRateDisplay = (form.interestRate * 100).toFixed(3);
    $: rentGrowthDisplay = (form.rentGrowthRate * 100).toFixed(2);
    $: vacancyRateDisplay = (form.vacancyRate * 100).toFixed(2);
    $: appreciationDisplay = (form.appreciationRate * 100).toFixed(2);
    $: marketTrendDisplay = (form.marketTrendAdjustment * 100).toFixed(2);
    $: propertyMgmtDisplay = (form.propertyMgmtPercent * 100).toFixed(1);
</script>

<div class="space-y-8">
    <!-- Group 1: Acquisition -->
    <div>
        <h3
            class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 border-b border-white/10 pb-2"
        >
            Acquisition
        </h3>
        <div class="grid gap-6 md:grid-cols-2">
            <label class="block group">
                <span
                    class="text-sm font-medium text-gray-300 mb-1 block group-hover:text-white transition-colors"
                    >Purchase Price ($)</span
                >
                <input
                    class="input-field"
                    type="number"
                    min="0"
                    step="1000"
                    bind:value={form.purchasePrice}
                />
            </label>

            <label class="block group">
                <span
                    class="text-sm font-medium text-gray-300 mb-1 block group-hover:text-white transition-colors"
                    >Down Payment (%)</span
                >
                <input
                    class="input-field"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    bind:value={downPercentDisplay}
                    on:input={updateDownPercent}
                />
            </label>

            <label class="block group">
                <span
                    class="text-sm font-medium text-gray-300 mb-1 block group-hover:text-white transition-colors"
                    >Closing Costs ($)</span
                >
                <input
                    class="input-field"
                    type="number"
                    min="0"
                    step="100"
                    bind:value={form.closingCosts}
                />
            </label>

            <label class="block group">
                <span
                    class="text-sm font-medium text-gray-300 mb-1 block group-hover:text-white transition-colors"
                    >Rehab Budget ($)</span
                >
                <input
                    class="input-field"
                    type="number"
                    min="0"
                    step="100"
                    bind:value={form.rehabCosts}
                />
            </label>
        </div>
    </div>

    <!-- Group 2: Financing -->
    <div>
        <h3
            class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 border-b border-white/10 pb-2"
        >
            Financing
        </h3>
        <div class="grid gap-6 md:grid-cols-2">
            <label class="block group">
                <span
                    class="text-sm font-medium text-gray-300 mb-1 block group-hover:text-white transition-colors"
                    >Interest Rate (%)</span
                >
                <input
                    class="input-field"
                    type="number"
                    min="0"
                    max="100"
                    step="0.001"
                    bind:value={interestRateDisplay}
                    on:input={updateInterestRate}
                />
            </label>

            <label class="block group">
                <span
                    class="text-sm font-medium text-gray-300 mb-1 block group-hover:text-white transition-colors"
                    >Amortization (Years)</span
                >
                <input
                    class="input-field"
                    type="number"
                    min="1"
                    max="40"
                    step="1"
                    bind:value={form.amortYears}
                />
            </label>
        </div>
    </div>

    <!-- Group 3: Income & Expenses -->
    <div>
        <h3
            class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 border-b border-white/10 pb-2"
        >
            Income & Expenses
        </h3>
        <div class="grid gap-6 md:grid-cols-2">
            <label class="block group">
                <span
                    class="text-sm font-medium text-gray-300 mb-1 block group-hover:text-white transition-colors"
                    >Monthly Rent ($)</span
                >
                <input
                    class="input-field"
                    type="number"
                    min="0"
                    step="100"
                    bind:value={form.monthlyRent}
                />
            </label>

            <label class="block group">
                <span
                    class="text-sm font-medium text-gray-300 mb-1 block group-hover:text-white transition-colors"
                    >Annual Rent Growth (%)</span
                >
                <input
                    class="input-field"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    bind:value={rentGrowthDisplay}
                    on:input={updateRentGrowth}
                />
            </label>

            <label class="block group">
                <span
                    class="text-sm font-medium text-gray-300 mb-1 block group-hover:text-white transition-colors"
                    >Vacancy Rate (%)</span
                >
                <input
                    class="input-field"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    bind:value={vacancyRateDisplay}
                    on:input={updateVacancyRate}
                />
            </label>
        </div>

        <!-- Expense Mode Toggle -->
        <div class="mt-6 mb-4">
            <div
                class="flex items-center justify-between p-4 bg-surface/30 rounded-lg border border-white/10"
            >
                <div>
                    <span class="text-sm font-medium text-white"
                        >Expense Detail Level</span
                    >
                    <p class="text-xs text-gray-400 mt-1">
                        Choose between simple or itemized expenses
                    </p>
                </div>
                <div class="flex items-center gap-3">
                    <span
                        class="text-xs font-medium transition-colors"
                        class:text-white={!form.useDetailedExpenses}
                        class:text-gray-500={form.useDetailedExpenses}
                        >Simple</span
                    >
                    <button
                        type="button"
                        on:click={() =>
                            (form.useDetailedExpenses =
                                !form.useDetailedExpenses)}
                        class="relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                        class:bg-primary={form.useDetailedExpenses}
                        class:bg-gray-600={!form.useDetailedExpenses}
                    >
                        <span
                            class="inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200"
                            class:translate-x-5={form.useDetailedExpenses}
                            class:translate-x-1={!form.useDetailedExpenses}
                        ></span>
                    </button>
                    <span
                        class="text-xs font-medium transition-colors"
                        class:text-white={form.useDetailedExpenses}
                        class:text-gray-500={!form.useDetailedExpenses}
                        >Detailed</span
                    >
                </div>
            </div>
        </div>

        <!-- Simple Mode: Single OpEx Field -->
        {#if !form.useDetailedExpenses}
            <div class="grid gap-6 md:grid-cols-2 animate-slide-up">
                <label class="block group">
                    <span
                        class="text-sm font-medium text-gray-300 mb-1 block group-hover:text-white transition-colors"
                        >Monthly OpEx ($)</span
                    >
                    <input
                        class="input-field"
                        type="number"
                        min="0"
                        step="100"
                        bind:value={form.monthlyOpEx}
                    />
                </label>
            </div>
        {/if}

        <!-- Detailed Mode: Itemized Expenses -->
        {#if form.useDetailedExpenses}
            <div class="grid gap-6 md:grid-cols-2 animate-slide-up">
                <label class="block group">
                    <span
                        class="text-sm font-medium text-gray-300 mb-1 block group-hover:text-white transition-colors"
                        >Property Taxes ($/mo)</span
                    >
                    <input
                        class="input-field"
                        type="number"
                        min="0"
                        step="10"
                        bind:value={form.propertyTaxes}
                    />
                </label>

                <label class="block group">
                    <span
                        class="text-sm font-medium text-gray-300 mb-1 block group-hover:text-white transition-colors"
                        >Insurance ($/mo)</span
                    >
                    <input
                        class="input-field"
                        type="number"
                        min="0"
                        step="10"
                        bind:value={form.insurance}
                    />
                </label>

                <label class="block group">
                    <span
                        class="text-sm font-medium text-gray-300 mb-1 block group-hover:text-white transition-colors"
                        >Repairs & Maintenance ($/mo)</span
                    >
                    <input
                        class="input-field"
                        type="number"
                        min="0"
                        step="10"
                        bind:value={form.repairs}
                    />
                </label>

                <label class="block group">
                    <span
                        class="text-sm font-medium text-gray-300 mb-1 block group-hover:text-white transition-colors"
                        >Property Management (%)</span
                    >
                    <input
                        class="input-field"
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        bind:value={propertyMgmtDisplay}
                        on:input={updatePropertyMgmt}
                    />
                    <span class="text-xs text-gray-500 mt-1"
                        >% of monthly rent</span
                    >
                </label>

                <label class="block group">
                    <span
                        class="text-sm font-medium text-gray-300 mb-1 block group-hover:text-white transition-colors"
                        >CapEx Reserves ($/mo)</span
                    >
                    <input
                        class="input-field"
                        type="number"
                        min="0"
                        step="10"
                        bind:value={form.capexReserves}
                    />
                </label>

                <label class="block group">
                    <span
                        class="text-sm font-medium text-gray-300 mb-1 block group-hover:text-white transition-colors"
                        >HOA Fees ($/mo)</span
                    >
                    <input
                        class="input-field"
                        type="number"
                        min="0"
                        step="10"
                        bind:value={form.hoaFees}
                    />
                </label>
            </div>

            <!-- Total Expenses Display -->
            <div
                class="mt-4 p-4 bg-accent/10 border border-accent/20 rounded-lg"
            >
                <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-gray-300"
                        >Total Monthly Expenses:</span
                    >
                    <span class="text-lg font-bold text-accent"
                        >${totalDetailedExpenses.toLocaleString()}</span
                    >
                </div>
            </div>
        {/if}
    </div>

    <!-- Group 4: Market & Location -->
    <div>
        <h3
            class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 border-b border-white/10 pb-2"
        >
            Market & Location
        </h3>
        <div class="grid gap-6 md:grid-cols-2">
            <label class="block group">
                <span
                    class="text-sm font-medium text-gray-300 mb-1 block group-hover:text-white transition-colors"
                    >Annual Appreciation (%)</span
                >
                <input
                    class="input-field"
                    type="number"
                    min="0"
                    step="0.1"
                    bind:value={appreciationDisplay}
                    on:input={updateAppreciation}
                />
            </label>

            <label class="block group">
                <span
                    class="text-sm font-medium text-gray-300 mb-1 block group-hover:text-white transition-colors"
                    >Market Trend Adj. (%)</span
                >
                <input
                    class="input-field"
                    type="number"
                    step="0.1"
                    bind:value={marketTrendDisplay}
                    on:input={updateMarketTrend}
                />
            </label>

            <label class="block group">
                <span
                    class="text-sm font-medium text-gray-300 mb-1 block group-hover:text-white transition-colors"
                    >Location Score (1-10)</span
                >
                <div class="flex items-center space-x-4">
                    <input
                        type="range"
                        min="1"
                        max="10"
                        step="1"
                        bind:value={form.locationScore}
                        class="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <span class="text-xl font-bold text-primary w-8 text-center"
                        >{form.locationScore}</span
                    >
                </div>
            </label>
        </div>
    </div>
</div>
