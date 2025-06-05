<script lang="ts">
  export let savedScenarios: { name: string }[];
  export let loadScenario: (i: number) => void;
  export let deleteScenario: (i: number) => void;
</script>

{#if savedScenarios.length}
  <section class="mt-12 bg-gray-800 p-6 rounded-xl">
    <h2 class="text-2xl font-semibold text-gray-100 mb-2">
      Saved Scenarios
    </h2>
    <ul class="space-y-3">
      {#each savedScenarios as { name }, i}
        <li class="flex items-center justify-between">
          <span class="text-gray-100">{name}</span>
          <div class="flex space-x-2">
            <button 
              on:click={() => loadScenario(i)}
              class="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 rounded"
            >
              Load
            </button>
            <button 
              on:click={() => deleteScenario(i)}
              class="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 rounded"
            >
              Delete
            </button>
          </div>
        </li>
      {/each}
    </ul>
  </section>
{/if}
