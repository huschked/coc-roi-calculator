<script lang="ts">
    /* Re‑usable number card */
    export let label:  string;
    export let value:  number;
    export let prefix: string = '';
    export let suffix: string = '';
  </script>
  
  <div class="rounded-lg bg-gray-50 p-4 shadow-sm">
    <p class="text-sm text-gray-600">{label}</p>
    <p class="mt-1 text-xl font-semibold text-gray-800">
      {prefix}
      {value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
      {suffix}
    </p>
  </div>
  