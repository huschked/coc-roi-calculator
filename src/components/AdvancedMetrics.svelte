<script lang="ts">
  interface Advanced {
    irr: number;
    equityMultiple: number;
    npv: number;
    paybackYears: number;
  }
  export let advanced: Advanced;

  const fmt = (n: number) => {
    if (!isFinite(n)) return "∞";
    return Math.abs(n).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const fmtPercent = (n: number) => {
    if (!isFinite(n)) return "∞";
    return (n * 100).toFixed(0);
  };

  const fmtMultiple = (n: number) => {
    if (!isFinite(n)) return "∞";
    return n.toFixed(2);
  };

  const fmtYears = (n: number) => {
    if (!isFinite(n)) return "∞";
    return n.toFixed(1);
  };

  const tips = {
    irr: `Internal Rate of Return (IRR) is the annualized rate at which the net present value of all cash flows equals zero.`,
    equityMultiple: `Equity Multiple is total cash returned divided by total cash invested—how many dollars you get back per dollar in.`,
    npv: `Net Present Value (NPV) @ 8% is the sum of all future cash flows discounted at 8%, minus your initial investment.`,
    payback: `Payback Period is how many years it takes for cumulative cash flows to equal your initial cash investment.`,
  };

  // Helper functions for metric indicators
  const getIRRIndicator = (irr: number) => {
    if (!isFinite(irr)) return { icon: "?", color: "text-gray-400" };
    if (irr >= 0.12) return { icon: "✓", color: "text-green-400" };
    if (irr >= 0.08) return { icon: "⚠", color: "text-yellow-400" };
    return { icon: "✗", color: "text-red-400" };
  };

  const getNPVIndicator = (npv: number) => {
    if (!isFinite(npv)) return { icon: "?", color: "text-gray-400" };
    if (npv > 0) return { icon: "✓", color: "text-green-400" };
    return { icon: "✗", color: "text-red-400" };
  };

  const getPaybackIndicator = (years: number) => {
    if (!isFinite(years)) return { icon: "?", color: "text-gray-400" };
    if (years <= 10) return { icon: "✓", color: "text-green-400" };
    if (years <= 15) return { icon: "⚠", color: "text-yellow-400" };
    return { icon: "✗", color: "text-red-400" };
  };

  $: irrIndicator = getIRRIndicator(advanced.irr);
  $: npvIndicator = getNPVIndicator(advanced.npv);
  $: paybackIndicator = getPaybackIndicator(advanced.paybackYears);
</script>

<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
  <!-- IRR -->
  <div
    class="glass-panel p-6 relative overflow-hidden group shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border-l-4 border-l-green-500"
  >
    <div
      class="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-30 transition-opacity"
    >
      <svg
        class="w-20 h-20 text-green-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        ><path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        ></path></svg
      >
    </div>
    <div class="absolute top-3 right-3 group/icon z-20">
      <svg
        class="w-5 h-5 text-gray-500 cursor-help"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        ><path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path></svg
      >
      <div
        class="absolute z-20 hidden w-64 p-3 text-xs text-white bg-slate-900 border border-slate-700 rounded-lg shadow-xl -right-2 top-6 group-hover/icon:block"
      >
        {tips.irr}
      </div>
    </div>
    <div class="relative z-10">
      <span
        class="text-sm font-medium text-gray-400 uppercase tracking-wider flex items-center gap-2"
      >
        IRR
        <span class={`text-lg ${irrIndicator.color}`}>{irrIndicator.icon}</span>
      </span>
      <div class="text-4xl font-display font-bold text-accent-glow mt-2">
        {fmtPercent(advanced.irr)}%
      </div>
      <div class="text-xs text-gray-500 mt-1">Internal Rate of Return</div>
    </div>
  </div>

  <!-- Equity Multiple -->
  <div
    class="glass-panel p-6 relative overflow-hidden group shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border-l-4 border-l-blue-500"
  >
    <div
      class="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-30 transition-opacity"
    >
      <svg
        class="w-20 h-20 text-blue-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        ><path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
        ></path></svg
      >
    </div>
    <div class="absolute top-3 right-3 group/icon z-20">
      <svg
        class="w-5 h-5 text-gray-500 cursor-help"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        ><path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path></svg
      >
      <div
        class="absolute z-20 hidden w-64 p-3 text-xs text-white bg-slate-900 border border-slate-700 rounded-lg shadow-xl -right-2 top-6 group-hover/icon:block"
      >
        {tips.equityMultiple}
      </div>
    </div>
    <div class="relative z-10">
      <span class="text-sm font-medium text-gray-400 uppercase tracking-wider"
        >Equity Multiple</span
      >
      <div class="text-4xl font-display font-bold text-primary-glow mt-2">
        {fmtMultiple(advanced.equityMultiple)}x
      </div>
      <div class="text-xs text-gray-500 mt-1">Total Return / Invested</div>
    </div>
  </div>

  <!-- NPV @ 8% -->
  <div
    class="glass-panel p-6 relative overflow-hidden group shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border-l-4 {advanced.npv >=
    0
      ? 'border-l-green-500'
      : 'border-l-red-500'}"
  >
    <div
      class="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-30 transition-opacity"
    >
      <svg
        class="w-20 h-20 {advanced.npv >= 0
          ? 'text-green-400'
          : 'text-red-400'}"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        ><path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path></svg
      >
    </div>
    <div class="absolute top-3 right-3 group/icon z-20">
      <svg
        class="w-5 h-5 text-gray-500 cursor-help"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        ><path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path></svg
      >
      <div
        class="absolute z-20 hidden w-64 p-3 text-xs text-white bg-slate-900 border border-slate-700 rounded-lg shadow-xl -right-2 top-6 group-hover/icon:block"
      >
        {tips.npv}
      </div>
    </div>
    <div class="relative z-10">
      <span
        class="text-sm font-medium text-gray-400 uppercase tracking-wider flex items-center gap-2"
      >
        NPV @ 8%
        <span class={`text-lg ${npvIndicator.color}`}>{npvIndicator.icon}</span>
      </span>
      <div
        class={`text-4xl font-display font-bold mt-2 ${advanced.npv >= 0 ? "text-accent-glow" : "text-danger"}`}
      >
        ${fmt(advanced.npv)}
      </div>
      <div class="text-xs text-gray-500 mt-1">Net Present Value</div>
    </div>
  </div>

  <!-- Payback Period -->
  <div
    class="glass-panel p-6 relative overflow-hidden group shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border-l-4 border-l-purple-500"
  >
    <div
      class="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-30 transition-opacity"
    >
      <svg
        class="w-20 h-20 text-purple-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        ><path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path></svg
      >
    </div>
    <div class="absolute top-3 right-3 group/icon z-20">
      <svg
        class="w-5 h-5 text-gray-500 cursor-help"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        ><path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path></svg
      >
      <div
        class="absolute z-20 hidden w-64 p-3 text-xs text-white bg-slate-900 border border-slate-700 rounded-lg shadow-xl -right-2 top-6 group-hover/icon:block"
      >
        {tips.payback}
      </div>
    </div>
    <div class="relative z-10">
      <span
        class="text-sm font-medium text-gray-400 uppercase tracking-wider flex items-center gap-2"
      >
        Payback
        <span class={`text-lg ${paybackIndicator.color}`}
          >{paybackIndicator.icon}</span
        >
      </span>
      <div class="text-4xl font-display font-bold text-white mt-2">
        {fmtYears(advanced.paybackYears)}
        <span class="text-lg font-normal text-gray-500">yrs</span>
      </div>
      <div class="text-xs text-gray-500 mt-1">Time to Recoup Cash</div>
    </div>
  </div>
</div>
