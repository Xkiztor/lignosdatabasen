<script setup>
const props = defineProps(['plant'])

console.log(props.plant);

const image = computed(() => {
  const images = props.plant.text.split(/!\[[^\]]*\]\(([^)]+)\)/g).filter(str => str !== '' && str.includes('http') && !str.includes('['))
  if (images.length) {
    return images[0].replace('/upload/', '/upload/t_300bred/')
  } else {
    return ''
  }
  return images
  // return specificPlant.value.text.split(/[\[\]]/).filter(str => str !== '' && str.includes('http'))
})
</script>


<template>
  <li class="search-card">
    <img v-if="image" :src="image" alt="">
    <div v-else class="skeleton"></div>
    <div class="text">
      <NuxtLink :to="`/planta/${plant.slakte}/${plant.art}/${plant.sortnamn}`">
        <span>
          {{ plant.slakte }}{{ plant.art ? ' ' : ''
          }}{{ plant.art.replace(/\([^()]*\)/g, '') }}{{ plant.sortnamn ? " '" : '' }}{{
            plant.sortnamn
          }}{{ plant.sortnamn ? "'" : '' }}
        </span>
        <!-- <span>
          {{ plant.svensktnamn ? "-" : '' }}
        </span> -->
        <span>
          {{ plant.svensktnamn }}
        </span>
      </NuxtLink>
      <p>{{ plant.ingress }}</p>
    </div>
  </li>
</template>


<style>
.search-card {
  display: grid;
  grid-template-columns: 1fr 3fr;
  gap: 1rem;
  place-items: center;
  height: fit-content;
  margin-bottom: 1rem
}

.expanded ul li.search-card *,
.search-card * {
  text-align: left;
}

.search-card a {
  font-size: 1.25rem;
  font-weight: 700;
  /* display: flex; */
  /* flex-direction: row; */
  /* flex-direction: row; */
  align-items: center;
  justify-content: space-between;
}


.search-card a span {
  display: block;
}

.search-card a span:first-child {
  font-size: 1.75rem;
  font-family: var(--title-font);
}

@media screen and (max-width: 700px) {
  .search-card a {
    font-size: 1.1rem;
  }

  .search-card a span:first-child {
    font-size: 1.5rem;
  }
}

.search-card div {
  height: 100%;
  width: 100%;
}

.search-card img {}

.search-card div.skeleton {
  border-radius: 0.5rem;
  background: var(--border-color);
}

.search-card img,
.search-card div.skeleton {
  object-fit: cover;
  min-height: 6rem;
  aspect-ratio: 1/1;
  width: 100%;
}

.search-card .text {}

.search-card .text p {
  font-size: 1rem;
  max-height: 100%;
  overflow-y: clip;
}
</style>