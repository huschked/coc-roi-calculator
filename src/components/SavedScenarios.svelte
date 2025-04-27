<script lang="ts">
    export let savedScenarios: { name: string; inputs: any }[] = [];
    export let saveScenario: () => void;
    export let loadScenario: (index: number) => void;
    export let deleteScenario: (index: number) => void;
  </script>
  
  <div class="mt-6">
    <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
      Saved Scenarios
    </h2>
  
    {#if savedScenarios.length > 0}
      <ul class="space-y-4">
        {#each savedScenarios as scenario, index}
          <li class="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800 shadow transition transform hover:shadow-lg hover:-translate-y-1">
            <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {scenario.name}
            </span>
            <div class="flex gap-4">
              <button
                on:click={() => loadScenario(index)}
                class="text-primary hover:underline text-sm"
              >
                Load
              </button>
              <button
                on:click={() => deleteScenario(index)}
                class="text-red-500 hover:underline text-sm"
              >
                Delete
              </button>
            </div>
          </li>
        {/each}
      </ul>
    {:else}
      <div class="text-sm text-gray-500 dark:text-gray-400 italic mt-2">
        No saved scenarios yet. Save a deal to reuse later!
      </div>
    {/if}
  </div>
  