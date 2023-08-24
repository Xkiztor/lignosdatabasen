<script setup>
const props = defineProps(['plant'])


const formattedDescription = computed(() => {
  const descriptionLenght = 50

  let desc
  desc = props.plant.beskrivning.slice(0, descriptionLenght)

  if (props.plant.beskrivning.length > descriptionLenght) {
    desc = desc + '...'
  }

  return desc
})
</script>


<template>
  <div class="card">
    <NuxtLink :to="`/planta/${plant.id}`">
      <nuxt-img v-if="plant.bilder[0]" quality="10" loading="lazy" fit="cover" :src="plant.bilder[0]" alt="" />
    </NuxtLink>
    <NuxtLink :to="`/planta/${plant.id}`">
      <h2>{{ plant.namn }}</h2>
    </NuxtLink>
    <p>{{ formattedDescription }}</p>
  </div>
</template>


<style></style>