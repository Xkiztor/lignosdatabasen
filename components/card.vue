<script setup>
const props = defineProps(['växt'])

console.log(props.växt);


const descriptionLenght = 70
const formattedDescription = computed(() => {
  let desc = props.växt.text

  // let desclenght = desc.lenght

  desc = desc.replace(/!\[.*?\]\(.*?\)|\[.*?\]\(.*?\)/g, '');
  desc = desc.replace(/[*\-_#{}\[\]]/g, "");;

  desc = desc.slice(0, descriptionLenght)

  // if (desclenght > descriptionLenght) {
  // }
  desc = desc + '...'

  return desc
})

const images = computed(() => {
  return props.växt.text.split(/!\[[^\]]*\]\(([^)]+)\)/g).filter(str => str !== '' && str.includes('http') && !str.includes('['))
  // return specificPlant.value.text.split(/[\[\]]/).filter(str => str !== '' && str.includes('http'))
})
</script>


<template>
  <div class="card">
    <NuxtLink class="image" :to="`/planta/${växt.slakte}/${växt.art}/${växt.sortnamn}`">
      <NuxtImg v-if="images[0]" loading="lazy" :src="images[0]" alt="" />
    </NuxtLink>
    <NuxtLink :to="`/planta/${växt.slakte}/${växt.art}/${växt.sortnamn}`">
      <h2>{{ växt.slakte }} {{ växt.art }} {{ växt.sortnamn ? `'` : '' }}{{ växt.sortnamn }}{{ växt.sortnamn ? `'` :
      '' }}</h2>
    </NuxtLink>
    <!-- <NuxtLink :to="'/planta/' + växt.slakte + '/' + växt.art + '/' + växt.sortnamn ? växt.sortnamn + '/' : ''">
      <h2>{{ växt.slakte }}</h2>
    </NuxtLink> -->
    <p>{{ formattedDescription }}</p>
    <!-- {{ växt.slakte }} -->
  </div>
</template>


<style>
.card img,
.card .image {
  width: 100%;
  height: 17rem;
  border-radius: 0.5rem;
}

.card img {
  object-fit: cover;
}

.card .image {
  display: block;
  background: var(--element-bg);
}

.card h2 {
  font-size: 1.5rem;
  font-family: var(--title-font);
  margin-top: 0.5rem;
}

.card h2:hover {
  text-decoration: underline;
}

.card {
  border-radius: 1rem;
  padding: 1rem;
  /* border: 1px solid var(--border-color); */
}

.dark .card {
  background: var(--element-bg);
  box-shadow: 0 0 20px 5px rgba(0, 0, 0, 0.5);
}
</style>