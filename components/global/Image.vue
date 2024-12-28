<script setup>
const props = defineProps(['string', 'src', 'alt', 'text']);

const route = useRoute();

var source = props.src;
const bildtext = ref(props.text);
var index = 0;

const imageOpened = ref(false);

const openImage = () => {
  imageOpened.value = !imageOpened.value;
  index = state.currentPageImages.value.indexOf(props.src);
  getImage(index);
};

const state = useGlobalState();

const target = ref();

onClickOutside(target, () => {
  imageOpened.value = false;
});

const compressedUrl = computed(() => {
  if (props.alt.includes('hel')) {
    return source.replace('/upload/', '/upload/t_1000bred,f_auto,q_auto/');
  } else {
    return source.replace('/upload/', '/upload/t_500bred,f_auto,q_auto/');
  }
});
const bigImageUrl = computed(() => {
  return source.replace('/upload/', '/upload/t_2000bred,f_auto,q_auto/');
});

const getImage = (i) => {
  source = state.currentPageImages.value[i];
  bildtext.value = state.currentPageBildtexter.value[i].replace(/&quot;/g, '"');
};

const next = () => {
  if (state.currentPageImages.value.length !== index + 1) {
    imageOpened.value = true;
    getImage(index + 1);
    index = index + 1;
  } else {
    imageOpened.value = true;
    getImage(0);
    index = 0;
  }
};
const previous = () => {
  if (index !== 0) {
    imageOpened.value = true;
    getImage(index - 1);
    index = index - 1;
  } else {
    imageOpened.value = true;
    getImage(state.currentPageImages.value.length - 1);
    index = state.currentPageImages.value.length - 1;
  }
};
</script>

<template>
  <div class="screen-cover" id="image-screen-cover" v-if="imageOpened">
    <NuxtImg
      :src="bigImageUrl"
      :alt="`${route.params.slakte} ${route.params.art}${route.params.sortnamn ? ` '` : ''}${
        route.params.sortnamn
      }${route.params.sortnamn ? `'` : ''}${state.currentPagePlant.value.svensktnamn ? ' - ' : ''}${
        state.currentPagePlant.value.svensktnamn ? state.currentPagePlant.value.svensktnamn : ''
      }`"
      ref="target"
    />
    <button class="switch previous" @click="previous()">
      <Icon name="material-symbols:arrow-left-rounded" />
    </button>
    <button class="switch next" @click="next()">
      <Icon name="material-symbols:arrow-right-rounded" />
    </button>
    <p v-if="bildtext" class="bildtext-big-image">{{ bildtext }}</p>
    <NuxtLink :to="source" target="_blank">
      <Icon name="material-symbols:open-in-new-rounded" />Öppna full bild
    </NuxtLink>
  </div>
  <div class="img-div">
    <NuxtImg
      class="article-image"
      @click="openImage()"
      :src="compressedUrl"
      :alt="`${route.params.slakte} ${route.params.art}${route.params.sortnamn ? ` '` : ''}${
        route.params.sortnamn
      }${route.params.sortnamn ? `'` : ''}${state.currentPagePlant.value.svensktnamn ? ' - ' : ''}${
        state.currentPagePlant.value.svensktnamn ? state.currentPagePlant.value.svensktnamn : ''
      }`"
      :class="alt"
      loading="lazy"
      :title="`${route.params.slakte} ${route.params.art}${route.params.sortnamn ? ` '` : ''}${
        route.params.sortnamn
      }${route.params.sortnamn ? `'` : ''}${state.currentPagePlant.value.svensktnamn ? ' - ' : ''}${
        state.currentPagePlant.value.svensktnamn ? state.currentPagePlant.value.svensktnamn : ''
      }`"
    />
    <p v-if="text" class="bildtext">{{ text }}</p>
  </div>
</template>

<style>
.screen-cover .switch {
  position: absolute;
  background: none;
  opacity: 0.3;
  border: none;
  padding: 0;
  color: var(--text-color-dark);
}

.screen-cover .switch:hover {
  border: none;
  opacity: 0.8;
}
.screen-cover .switch * {
  font-size: 5rem;
}

.switch.previous {
  left: -1.5rem;
  top: 50%;
  transform: translate(0, -50%);
}
.switch.next {
  right: -1.5rem;
  top: 50%;
  transform: translate(0, -50%);
}

@media screen and (min-width: 1200px) {
  .switch.previous {
    left: 0.5rem;
  }
  .switch.next {
    right: 0.5rem;
  }
}

div.img-div {
  display: inline-block;
  /* width: min-content; */
  height: fit-content;
  margin-right: 1rem;
}

article.main-content div.img-div:has(.bildtext) img.article-image {
  margin-bottom: 0.1rem;
}

.img-div .bildtext {
  margin-bottom: 0.5rem;
  /* font-size: 0.85em; */
  width: fit-content;
  max-width: 99%;
  opacity: 0.7;
}

.screen-cover .bildtext-big-image {
  position: absolute;
  bottom: 0.75rem;
  left: 0;
  right: 0;
  width: 100%;
  /* transform: translateX(-50%); */
  color: var(--text-color-dark);
  opacity: 0.7;
  text-shadow: 0 0 3px rgba(0, 0, 0, 0.8);
  /* width: 90vw; */
  text-align: center;
  max-width: none;
  padding: 0 10%;
}
</style>
