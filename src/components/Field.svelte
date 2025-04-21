<script lang="ts">
  /** 
   * Generic wrapper that shows a label plus an input with
   * optional prefix “$” or suffix “%”.
   * Now requires an `id` for explicit label binding.
   */
  export let label:  string;
  export let prefix: string = '';
  export let suffix: string = '';
  export let id:     string;   // ← make this required
</script>

<div>
  <!-- always emit for={id} -->
  <label for={id} class="block mb-1 text-base font-semibold text-gray-200 dark:text-gray-200">
    {label}
  </label>

  <div class="relative">
    {#if prefix}
      <span class="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-500">
        {prefix}
      </span>
    {/if}

    <!-- parent must pass an <input id={id} .../> here -->
    <slot />

    {#if suffix}
      <span class="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-500">
        {suffix}
      </span>
    {/if}
  </div>
</div>

<style>
  :global(.with-prefix)  { padding-left: 2.75rem; }
  :global(.with-suffix)  { padding-right: 2.75rem; }
</style>
