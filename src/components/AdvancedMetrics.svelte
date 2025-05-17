<script lang="ts">
  export interface Advanced {
    irr: number;
    equityMultiple: number;
    npv: number;
    paybackYears: number;
  }
  export let advanced: Advanced;
  const fmt = (n: number) => Math.abs(n).toLocaleString();
  const tips = {
    irr: `Internal Rate of Return (IRR) is the annualized rate at which the net present value of all cash flows equals zero.`,
    equityMultiple: `Equity Multiple is total cash returned divided by total cash invested—how many dollars you get back per dollar in.`,
    npv: `Net Present Value (NPV) @ 8% is the sum of all future cash flows discounted at 8%, minus your initial investment.`,
    payback: `Payback Period is how many years it takes for cumulative cash flows to equal your initial cash investment.`
  };
</script>

<style lang="postcss">
  .stat-card {
    @apply relative
           rounded-xl
           bg-white dark:bg-gray-800
           p-6
           flex flex-col justify-center items-center
           shadow
           transition transform hover:shadow-lg hover:-translate-y-1;
  }
  .help-icon {
    @apply absolute top-2 left-2 w-6 h-6 flex items-center justify-center
           bg-gray-900 text-white rounded-full text-xs cursor-pointer;
  }
  .tooltip {
    @apply absolute z-20 hidden w-48 p-2 text-xs text-white bg-gray-900 rounded;
    top: 100%;
    left: 0;
  }
  .help-icon:hover .tooltip {
    @apply block;
  }
</style>

<!-- Header to separate sections -->
<div class="mt-12">

  <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
    <!-- IRR -->
    <div class="stat-card">
      <div class="help-icon">
        ❓
        <div class="tooltip">{tips.irr}</div>
      </div>
      <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">
        IRR
      </span>
      <div class="text-2xl font-bold text-green-600 mt-2">
        {fmt(advanced.irr * 100)}%
      </div>
    </div>

    <!-- Equity Multiple -->
    <div class="stat-card">
      <div class="help-icon">
        ❓
        <div class="tooltip">{tips.equityMultiple}</div>
      </div>
      <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">
        Equity Multiple
      </span>
      <div class="text-2xl font-bold text-green-600 mt-2">
        {fmt(advanced.equityMultiple)}
      </div>
    </div>

    <!-- NPV @ 8% -->
    <div class="stat-card">
      <div class="help-icon">
        ❓
        <div class="tooltip">{tips.npv}</div>
      </div>
      <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">
        NPV @ 8%
      </span>
      <div class={`text-2xl font-bold mt-2 ${advanced.npv >= 0 ? 'text-green-600' : 'text-red-600'}`}>
        ${fmt(advanced.npv)}
      </div>
    </div>

    <!-- Payback Period -->
    <div class="stat-card">
      <div class="help-icon">
        ❓
        <div class="tooltip">{tips.payback}</div>
      </div>
      <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">
        Payback
      </span>
      <div class="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">
        {advanced.paybackYears.toFixed(1)} yrs
      </div>
    </div>
  </div>
</div>
