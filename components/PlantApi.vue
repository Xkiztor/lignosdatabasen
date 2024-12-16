<script setup>
const props = defineProps(['plant']);

const showExtraFakta = ref(false);
const plantData = ref();

const fetchPlant = async () => {
  try {
    const response = await fetch('/api/getPlant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ props }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log(data);

    plantData.value = data;
  } catch (error) {
    console.error('Fetch error:', error);
  }
};

onMounted(() => {
  // fetchPlant();
});

const logg = async () => {
  await fetchPlant();
  // await fetchPlantSerched();
  console.log(plantData.value);
  // console.log(plantSerched.value.data[0]);
};
</script>

<template>
  <button
    class="extra-fakta-titel"
    :class="{ 'extra-fakta-shown': showExtraFakta }"
    @click="(showExtraFakta = !showExtraFakta), fetchPlant()"
  >
    <Icon name="flowbite:circle-plus-outline" v-if="!showExtraFakta" />
    <Icon name="flowbite:circle-minus-outline" v-else />
    <p>
      Extra fakta
      <span v-if="showExtraFakta">
        - För {{ props.plant.slakte }} {{ props.plant.art }} - från trefle.io</span
      >
    </p>
  </button>
  <ul class="extra-fakta" v-if="showExtraFakta && plantData && !plantData?.error">
    <!-- <p @click="logg">Api test</p> -->
    <li v-if="plantData?.data.main_species.common_name">
      Engelskt namn: <span>{{ plantData?.data.main_species.common_name }}</span>
    </li>
    <li v-if="plantData?.data.author">
      Auktor: <span>{{ plantData?.data.author }}</span>
    </li>
    <li v-if="plantData?.data.main_species.edible !== null">
      Ätbar: <span>{{ plantData?.data.main_species.edible ? 'Ja' : 'Nej' }}</span>
    </li>
    <li v-if="plantData?.data.main_species.growth.ph_minimum">
      PH:
      <span
        >{{ plantData?.data.main_species.growth.ph_minimum }} -
        {{ plantData?.data.main_species.growth.ph_maximum }}</span
      >
    </li>
    <li v-if="plantData?.data.main_species.distribution.native">
      Ursprung:
      <span v-for="land in plantData?.data.main_species.distribution.native">{{ land }}, </span>
    </li>
    <!-- <p>{{ plantData?.data.main_species.distribution.native }}</p> -->
    <!-- <p>{{ plantData?.data.main_species.common_names.sv }}</p> -->
  </ul>
  <div v-else-if="showExtraFakta && plantData?.error" class="fakta error">
    Fel vid hämtning av extra fakta. Tillfälligt fel eller så finns inte växten i databasen.
  </div>
  <div v-else-if="showExtraFakta" class="fakta loading">
    <Icon name="line-md:loading-twotone-loop" />
  </div>
</template>

<style>
.extra-fakta-titel {
  background: none;
  padding: 0;
  border-radius: 0;
  width: fit-content;
  color: #fff;
  margin-top: 0.5rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.4rem;
  font-size: 1.3rem;
}

.extra-fakta-titel:hover {
  opacity: 1;
}

.extra-fakta-titel p {
  font-size: 1.2rem;
}

.extra-fakta-titel p span {
  font-size: 1rem;
}

.extra-fakta-titel.extra-fakta-shown {
  /* padding-bottom: 0.25rem; */
  margin-bottom: 0.4rem;
}

.extra-fakta {
  list-style-type: disc;
  list-style-position: outside;
}

.extra-fakta li {
  margin-left: 1.25rem;
  padding-left: 0.25rem;
  margin-top: 0.2rem;
  font-weight: bold;
}

.extra-fakta li span {
  font-weight: normal;
  color: var(--title-color-dark);
}

.fakta.loading {
  font-size: 1.5rem;
}
</style>
