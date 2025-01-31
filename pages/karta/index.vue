<script setup>
import { ref } from 'vue';

const isLoaded = ref(false);
const center = ref();
const maps = ref();

const query = ref({
  lat: -37.7995487,
  lng: 144.9867841,
});

const addMarkerMode = ref(false);
const markers = ref([]);

function addMarker(lat, lng) {
  markers.value.push({
    position: { lat, lng },
    title: 'Hejsan!',
    id: markers.value.length,
    gmpClickable: true,
  });
}

function removeMarkers() {
  markers.value = [];
}

function handleReady({ map }) {
  center.value = map.value.getCenter();
  map.value.addListener('center_changed', () => {
    center.value = map.value.getCenter();
  });

  map.value.addListener('click', (event) => {
    if (addMarkerMode.value) {
      addMarker(event.latLng.lat(), event.latLng.lng());
    }
  });
  isLoaded.value = true;
}

function handleMarkerClick(marker) {
  alert(`Marker clicked: ${marker.id}`);
}
</script>

<template>
  <div class="map-page">
    <div class="">
      <ScriptGoogleMaps
        ref="maps"
        :center="query"
        :markers="markers"
        api-key="AIzaSyDCXzTT72V9WC44HefCRffYeK7o-sFwE0Y"
        class="map"
        @ready="handleReady"
        trigger="immediate"
        :zoom="5"
        @marker-click="handleMarkerClick"
      />
    </div>
    <div class="text-center">
      <button @click="addMarker" class="">Add Marker</button>
      <button v-if="markers.length" @click="removeMarkers" class="">Remove Markers</button>
      <button @click="addMarkerMode = !addMarkerMode">Add marker mode: {{ addMarkerMode }}</button>
    </div>
  </div>
</template>

<style>
.map-page {
}

.map-page *,
.map-page {
  transition: none;
}

.map-page .map * {
  border-radius: 0;
  box-shadow: none;
}
</style>
