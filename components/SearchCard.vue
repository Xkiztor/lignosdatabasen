<script setup>
const props = defineProps(['plant']);

console.log(props.plant);

const image = computed(() => {
  const images = props.plant.text
    .split(/!\[[^\]]*\]\(([^)]+)\)/g)
    .filter((str) => str !== '' && str.includes('http') && !str.includes('['));
  if (images.length) {
    return images[0].replace('/upload/', '/upload/t_300bred/');
  } else {
    return '';
  }
  return images;
  // return specificPlant.value.text.split(/[\[\]]/).filter(str => str !== '' && str.includes('http'))
});

const ingress = computed(() => {
  if (props.plant.ingress) {
    return props.plant.ingress;
  } else {
    let text = props.plant.text;
    let textWithoutMarkdown = text
      .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // Remove images
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // Remove links but keep the text
      .replace(/`([^`]+)`/g, '$1') // Remove inline code
      .replace(/#+\s/g, '') // Remove headers
      .replace(/>\s/g, '') // Remove blockquotes
      .replace(/[*_~]/g, '') // Remove emphasis
      .replace(/::\s*\w+/g, '') // Remove :: followed by a word
      .replace(/::/g, ''); // Remove ::

    return textWithoutMarkdown.substring(0, 125) + '...'; // Return first 200 characters
  }
});
</script>

<template>
  <li class="search-card">
    <img v-if="image" :src="image" alt="" />
    <div v-else class="skeleton"></div>
    <div class="text">
      <NuxtLink
        :to="
          plant.synonymtill
            ? plant.synonymtill
            : `/planta/${plant.slakte}/${plant.art.replace(/ /g, '+')}/${plant.sortnamn.replace(
                / /g,
                '+'
              )}`
        "
        @click="$emit('close')"
      >
        <span>
          {{ plant.slakte }}{{ plant.art ? ' ' : '' }}{{ plant.art }}{{ plant.sortnamn ? " '" : ''
          }}{{ plant.sortnamn }}{{ plant.sortnamn ? "'" : '' }}
          <!-- {{ plant.slakte }}{{ plant.art ? ' ' : ''
          }}{{ plant.art.replace(/\([^()]*\)/g, '') }}{{ plant.sortnamn ? " '" : '' }}{{
            plant.sortnamn
          }}{{ plant.sortnamn ? "'" : '' }} -->
        </span>
        <!-- <span>
          {{ plant.svensktnamn ? "-" : '' }}
        </span> -->
        <span>
          {{ plant.svensktnamn }}
        </span>
        <span v-if="plant.synonymtill">
          Syn. till:
          {{
            plant.synonymtill
              .replace(/planta\//g, '')
              .replace(/\+/g, ' ')
              .replace(/\//g, ' ')
          }}
        </span>
      </NuxtLink>
      <p>{{ ingress }}</p>
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
  margin-bottom: 1rem;
}

.expanded ul li.search-card *,
.search-card * {
  text-align: left;
}

.search-card a {
  font-size: var(--font-h4);
  font-weight: 600;
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
  font-size: var(--font-3xl);
  font-weight: 700;
}

.search-card .text p {
  margin-top: 0.2rem;
  font-size: var(--font-md);
  max-height: 100%;
  overflow-y: clip;
}

@media screen and (max-width: 700px) {
  .search-card a {
    font-size: var(--font-body);
  }

  .search-card a span:first-child {
    font-size: var(--font-2xl);
  }
  .search-card p {
    font-size: var(--font-base);
  }
}

.search-card a:hover {
  text-decoration: underline;
}

.search-card div {
  height: 100%;
  width: 100%;
}

.search-card img {
}

.search-card div.skeleton {
  border-radius: 0.5rem;
  background: var(--border-color);
}

.search-card img,
.search-card div.skeleton {
  object-fit: cover;
  /* min-height: 6rem; */
  aspect-ratio: 1/1;
  width: 100%;
}

.search-card .text {
}
</style>
