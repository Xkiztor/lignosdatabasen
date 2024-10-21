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
</script>


<template>
  <div class="screen-cover" v-if="imageOpened">
    <NuxtImg :src="src" :alt="src" ref="target" :placeholder="[50, 25, 75, 5]" />
  </div>
  <NuxtImg class="article-image" @click="openImage()" :src="src" :alt="src" :class="alt" loading="lazy" />
</template>