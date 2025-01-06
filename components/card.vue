<script setup>
const props = defineProps(['växt']);

// console.log(props.växt);

const descriptionLenght = 70;
const ingressLenght = 120;
const formattedDescription = computed(() => {
  if (props.växt.ingress) {
    let ingress = props.växt.ingress;
    ingress = ingress.slice(0, ingressLenght);
    if (ingress !== props.växt.ingress) {
      ingress = ingress + '...';
    }
    return ingress;
  } else {
    let desc = props.växt.text;

    // let desclenght = desc.lenght

    desc = desc.replace(/!\[.*?\]\(.*?\)|\[.*?\]\(.*?\)/g, ''); // Remove markdown image and link syntax
    desc = desc.replace(/[*\-_#{}\[\]]/g, ''); // Remove markdown formatting characters
    desc = desc.replace(/::\w+/g, ''); // Remove ::Fify
    desc = desc.replace(/::/g, ''); // Remove ::

    desc = desc.slice(0, descriptionLenght);

    // if (desclenght > descriptionLenght) {
    // }
    // console.log(desc);

    if (desc) {
      desc = desc + '...';
    }

    return desc;
  }
});

const image = computed(() => {
  let images = props.växt.text
    .split(/!\[[^\]]*\]\(([^)]+)\)/g)
    .filter((str) => str !== '' && str.includes('http') && !str.includes('['));

  if (images.length && images[0].includes('cloudinary')) {
    return images[0].replace('/upload/', '/upload/t_500bred,f_auto,q_auto/');
  } else if (images.length) {
    return images[0];
  } else {
    return '';
  }
  // return specificPlant.value.text.split(/[\[\]]/).filter(str => str !== '' && str.includes('http'))
});
</script>

<template>
  <div class="card">
    <NuxtLink
      class="image"
      :to="`/planta/${växt.slakte}/${växt.art.replace(/ /g, '+')}/${växt.sortnamn.replace(
        / /g,
        '+'
      )}`"
    >
      <NuxtImg v-if="image" loading="lazy" :src="image" alt="Laddar..." />
    </NuxtLink>
    <div class="faktarutan">
      <div v-if="växt.höjd">
        H: <span>{{ växt.höjd }}</span> m
      </div>
      <div v-if="växt.bredd">
        B: <span>{{ växt.bredd }}</span> m
      </div>
      <div v-if="växt.zon">
        Z: <span class="slab-font">{{ växt.zon }}</span>
      </div>
    </div>
    <NuxtLink :to="`/planta/${växt.slakte}/${växt.art}/${växt.sortnamn}`">
      <h2>
        {{ växt.slakte }} {{ växt.art }} {{ växt.sortnamn ? `'` : '' }}{{ växt.sortnamn
        }}{{ växt.sortnamn ? `'` : '' }}
      </h2>
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
  font-size: var(--font-3xl);
  font-family: var(--title-font);
  margin-top: 0.2rem;
}

.card h2:hover {
  text-decoration: underline;
}

.card {
  border-radius: 1rem;
  padding: 1rem;
  border: 2px solid var(--border-color);
  box-shadow: var(--shadow-lg);
}

.dark .card {
  background: var(--element-bg);
  /* box-shadow: 0 0 20px 5px rgba(0, 0, 0, 0.5); */
}

.card .faktarutan {
  /* display: grid; */
  /* grid-template-columns: 1fr 1fr 1fr; */
  /* place-items: center; */
  border-radius: 0.5rem;
  margin-top: 0.5rem;
  opacity: 0.6;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

.dark .card .faktarutan {
  background: var(--element-top-bg);
  opacity: 0.9;
}

.card .faktarutan:has(div) {
  border: 2px solid var(--border-color);
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
}

.card .faktarutan div {
}

.card .faktarutan span {
  opacity: 1;
  font-size: var(--font-2xl);
  font-weight: 800;
}
</style>
