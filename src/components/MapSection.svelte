<script lang="ts">
  export let center: [number, number];
  export let zoom = 13;
  import { onMount, onDestroy } from "svelte";
  import L from "leaflet";
  import "leaflet/dist/leaflet.css";

  let map: L.Map;
  let container: HTMLDivElement;

  onMount(() => {
    map = L.map(container, { center, zoom, layers: [
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors"
      })
    ]});
    map.invalidateSize();
  });

  // react to new center:
  $: if (map && center) {
    map.setView(center, zoom);
  }

  onDestroy(() => {
    map.remove();
  });
</script>

<div bind:this={container} class="map-container"></div>

<style>
  .map-container {
    width: 100%;
    height: 300px;
    border-radius: 0.5rem;
    overflow: hidden;
  }
</style>
