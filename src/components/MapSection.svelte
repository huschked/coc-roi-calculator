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

  // point Leaflet at the images in /public/leaflet
  L.Icon.Default.mergeOptions({
    iconUrl: "/leaflet/marker-icon.png",
    iconRetinaUrl: "/leaflet/marker-icon-2x.png",
    shadowUrl: "/leaflet/marker-shadow.png",
  });

  let map: L.Map;
  let container: HTMLDivElement;
  let marker: L.Marker;

  onMount(() => {
    map = L.map(container, {
      center,
      zoom,
      layers: [
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap contributors",
        }),
      ],
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

<div
  class="glass-panel p-2 h-64 rounded-2xl shadow-lg overflow-hidden relative z-0"
>
  <div bind:this={container} class="w-full h-full rounded-xl z-0"></div>
</div>

<style>
  :global(.leaflet-container) {
    width: 100%;
    height: 100%;
    z-index: 0;
  }
</style>
