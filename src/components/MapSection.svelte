<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import L from "leaflet";
  import "leaflet/dist/leaflet.css";

  /** Center of the map [lat, lon] */
  export let center: [number, number];
  /** Zoom level */
  export let zoom = 13;
  /** (Optional) popup text */
  export let label: string = "";

  let map: L.Map;
  let container: HTMLDivElement;
  let marker: L.Marker;

  onMount(() => {
    map = L.map(container, {
      center,
      zoom,
      layers: [
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap contributors"
        })
      ]
    });

    // create a marker at the initial center
    marker = L.marker(center)
      .addTo(map)
      .bindPopup(label || "Property")
      .openPopup();

    // ensure map correctly sizes itself
    map.invalidateSize();
  });

  // whenever `center` or `label` changes, move the pin + update popup
  $: if (map && marker) {
    map.setView(center, zoom);
    marker.setLatLng(center);
    marker.bindPopup(label || "Property").openPopup();
  }

  onDestroy(() => {
    map.remove();
  });
</script>

<div bind:this={container} class="w-full h-64 rounded-2xl shadow-lg"></div>

<style>
  .leaflet-container {
    width: 100%;
    height: 100%;
  }
  /* if your map container isn’t using the `.leaflet-container` class, ensure your wrapper has a fixed height */
</style>
