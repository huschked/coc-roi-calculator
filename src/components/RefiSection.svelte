<script lang="ts">
    import type { RefiInputs } from "../lib/formulas";
    export let refi: RefiInputs;

    let newRatePct = (refi.newRate * 100).toFixed(3);
    const syncRate = () => (refi.newRate = +newRatePct / 100);
</script>

<!-- Collapsible section -->
<details bind:open={refi.enabled} class="mt-8">
    <!-- Styled button in place of the summary link -->
    <summary>
        <button
            on:click|stopPropagation={() => (refi.enabled = !refi.enabled)}
            class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700
                   text-white font-medium rounded-lg shadow
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
            <span class="mr-2"></span>
            <span
                >{refi.enabled
                    ? "Hide Refinance Options"
                    : "Consider a Refinance?"}</span
            >
        </button>
    </summary>

    <div class="grid gap-6 md:grid-cols-2 mt-4">
        <!-- New Loan Amount -->
        <label class="block">
            <div class="flex items-center gap-1">
                <span class="label">New Loan Amount ($)</span>
                <div class="tooltip-container">
                    ❓
                    <div class="tooltip">
                        New mortgage balance after refinance (typically the
                        amount being borrowed).
                    </div>
                </div>
            </div>
            <input
                class="input with-prefix"
                type="number"
                min="0"
                step="1000"
                bind:value={refi.newLoanAmount}
            />
        </label>

        <!-- New Interest Rate -->
        <label class="block">
            <div class="flex items-center gap-1">
                <span class="label">New Interest Rate (%)</span>
                <div class="tooltip-container">
                    ❓
                    <div class="tooltip">
                        New mortgage interest rate you expect after refinancing.
                    </div>
                </div>
            </div>
            <input
                class="input with-suffix"
                type="number"
                min="0"
                step="0.001"
                bind:value={newRatePct}
                on:blur={syncRate}
            />
        </label>

        <!-- New Term (Years) -->
        <label class="block">
            <div class="flex items-center gap-1">
                <span class="label">New Term (Years)</span>
                <div class="tooltip-container">
                    ❓
                    <div class="tooltip">
                        Length of the new loan after refinancing (e.g., 15 or 30
                        years).
                    </div>
                </div>
            </div>
            <input
                class="input"
                type="number"
                min="1"
                max="40"
                step="1"
                bind:value={refi.newTermYears}
            />
        </label>

        <!-- Refi Closing Costs -->
        <label class="block">
            <div class="flex items-center gap-1">
                <span class="label">Refi Closing Costs ($)</span>
                <div class="tooltip-container">
                    ❓
                    <div class="tooltip">
                        Estimated closing costs paid during the refinancing
                        process.
                    </div>
                </div>
            </div>
            <input
                class="input with-prefix"
                type="number"
                min="0"
                step="100"
                bind:value={refi.closingCosts}
            />
        </label>
    </div>
</details>

<style lang="postcss">
    /* ——— Hide the browser’s built-in <details> arrow ——— */
    details summary::-webkit-details-marker {
        display: none;
    }
    details summary::marker {
        display: none;
    }
    details summary {
        list-style: none;
    }
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
