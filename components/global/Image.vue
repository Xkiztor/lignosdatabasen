<script setup lang='ts'>
const props = defineProps(['string', 'src', 'alt'])

const imageOpened = ref(false)

const openImage = () => {
  imageOpened.value = !imageOpened.value
}


const target = ref()

onClickOutside(target, () => {
  imageOpened.value = false
})

const compressedUrl = computed(() => {
  return props.src.replace('/upload/', '/upload/t_700bred/')
})
const bigImageUrl = computed(() => {
  return props.src.replace('/upload/', '/upload/t_2000bred/')
})
</script>


<template>
  <div class="screen-cover" v-if="imageOpened">
    <NuxtImg :src="bigImageUrl" :alt="src" ref="target" />
  </div>
  <NuxtImg class="article-image" @click="openImage()" :src="compressedUrl" :alt="compressedUrl" :class="alt"
    loading="lazy" />
</template>