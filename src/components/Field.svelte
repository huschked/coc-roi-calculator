<script lang="ts">
    /** 
     * Generic wrapper that shows a label plus an input with
     * optional prefix “$” or suffix “%”.
     */
    export let label:  string;
    export let prefix: string = '';
    export let suffix: string = '';
  </script>
  
  <div>
    <label class="block mb-1 text-sm font-medium text-gray-700">
      {label}
    </label>
  
    <div class="relative">
      {#if prefix}
        <span class="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-500">
          {prefix}
        </span>
      {/if}
  
      <!-- Slot receives the actual <input> from parent -->
      <slot />
  
      {#if suffix}
        <span class="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-500">
          {suffix}
        </span>
      {/if}
    </div>
  </div>
  
  <style>
    /* Shift input padding when prefix is present via utility class */
    :global(.with-prefix)  { padding-left: 2.75rem; }  /* 44 px */
    :global(.with-suffix)  { padding-right: 2.75rem; } /* 44 px */
  </style>
  