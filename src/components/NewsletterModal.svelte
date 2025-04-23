<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, scale } from 'svelte/transition';

  /** URL of the Brevo popup embed script */
  export let embedScriptUrl: string;

  /** Auto-open after N ms (0 = disabled) */
  export let autoOpenAfter = 0;

  /** Control modal visibility via two-way binding */
  export let open = false;

  // Inject the Brevo form once when `open` goes true
  $: if (open) {
    const container = document.getElementById('brevo-modal-container');
    if (container && !container.dataset.loaded) {
      const script = document.createElement('script');
      script.src = embedScriptUrl;
      script.async = true;
      container.appendChild(script);
      container.dataset.loaded = 'true';
    }
  }

  // Auto-open on mount if requested
  onMount(() => {
    if (autoOpenAfter > 0) {
      setTimeout(() => (open = true), autoOpenAfter);
    }
  });

  function closeModal() {
    open = false;
  }
</script>

{#if open}
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    transition:fade
    on:click={closeModal}
  >
    <div
      class="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-11/12 max-w-md p-6 relative"
      transition:scale="{{ duration: 200 }}"
      on:click|stopPropagation
    >
      <button
        class="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        aria-label="Close"
        on:click={closeModal}
      >
        ✕
      </button>
      <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Subscribe for updates
      </h2>
      <div id="brevo-modal-container" class="w-full"></div>
    </div>
  </div>
{/if}
