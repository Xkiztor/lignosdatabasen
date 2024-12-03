<script setup>
const props = defineProps(['string', 'src', 'alt'])

const route = useRoute()

var source = props.src
var index = 0

const imageOpened = ref(false)

const openImage = () => {
  imageOpened.value = !imageOpened.value
  index = state.currentPageImages.value.indexOf(props.src)
  getImage(index)
}

const state = useGlobalState()

const target = ref()

onClickOutside(target, () => {
  imageOpened.value = false
})

const compressedUrl = computed(() => {
  return source.replace('/upload/', '/upload/t_700bred/')
})
const bigImageUrl = computed(() => {
  return source.replace('/upload/', '/upload/t_2000bred/')
})


const getImage = (i) => {
  source = state.currentPageImages.value[i]
}

const next = () => {
  if(state.currentPageImages.value.length !== index + 1) {
    imageOpened.value = true
    getImage(index + 1)
    index = index + 1
  } else {
    imageOpened.value = true
    getImage(0)
    index = 0
  }
}
const previous = () => {
  if(index !== 0) {
    imageOpened.value = true
    getImage(index - 1)
    index = index - 1
  } else {
    imageOpened.value = true
    getImage(state.currentPageImages.value.length - 1)
    index = state.currentPageImages.value.length - 1
  }
}
</script>


<template>
  <div class="screen-cover" id="image-screen-cover" v-if="imageOpened">
    <NuxtImg :src="bigImageUrl" :alt="`${route.params.slakte} ${route.params.art}${route.params.sortnamn ? ` '` : ''}${route.params.sortnamn}${route.params.sortnamn ? `'` : ''}`" ref="target" />
    <button class="switch previous" @click="previous()"><Icon name="material-symbols:arrow-left-rounded"/></button>
    <button class="switch next" @click="next()"><Icon name="material-symbols:arrow-right-rounded"/></button>
    <NuxtLink :to="source" target="_blank">
      <Icon name="material-symbols:open-in-new-rounded" />Öppna full bild
    </NuxtLink>
  </div>
  <NuxtImg class="article-image" @click="openImage()" :src="compressedUrl" :alt="`${route.params.slakte} ${route.params.art}${route.params.sortnamn ? ` '` : ''}${route.params.sortnamn}${route.params.sortnamn ? `'` : ''}`" :class="alt"
    loading="lazy" :title="`${route.params.slakte} ${route.params.art}${route.params.sortnamn ? ` '` : ''}${route.params.sortnamn}${route.params.sortnamn ? `'` : ''}`"/>
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
  left: 0.5rem;
  top: 50%;
  transform: translate(0, -50%);
}
.switch.next {
  right: 0.5rem;
  top: 50%;
  transform: translate(0, -50%);
}

</style>