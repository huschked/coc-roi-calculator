<script lang="ts">
    /* Re‑usable number card */
    export let label: string;
    export let value: number | string;
    export let prefix: string = "";
    export let suffix: string = "";

    /* Format only if it's a number */
    $: formatted =
        typeof value === "number"
            ? value.toLocaleString(undefined, { maximumFractionDigits: 2 })
            : value;
</script>

<div class="rounded-lg bg-gray-50 p-4 shadow-sm">
    <p class="text-sm text-gray-600">{label}</p>
    <p class="mt-1 text-xl font-semibold text-gray-800">
      {prefix}{formatted}{suffix}
    </p>
  </div>
