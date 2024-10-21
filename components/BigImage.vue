<script setup lang='js'>
const props = defineProps(['string'])

const imageOpened = ref(false)

const openImage = () => {
  imageOpened.value = !imageOpened.value
}

const image = ref()

onMounted(() => {
  console.log(image.value);
})

const imageOreientation = computed(() => {
  if (!image.value) {
    return 'temp'
  } else {
    console.log(image.value.width);
    console.log(image.value.height);

    if (image.value.width === image.value.height) {
      return 'square'
    } else if (image.value.width > image.value.height) {
      return 'landscape'
    } else {
      return 'portrait'
    }
  }

  // return 'temp'
})

const target = ref()

onClickOutside(target, () => {
  imageOpened.value = false
})
</script>


<template>
  <div class="screen-cover" v-if="imageOpened">
    <NuxtImg :src="string" :alt="string" ref="target" :placeholder="[50, 25, 75, 5]" />
  </div>
  <NuxtImg @click="openImage()" :src="string" :alt="string" ref="image" :class="imageOreientation" loading="lazy" />
</template>


<style>
.main-content div .screen-cover {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 5;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  /* justify-content: center; */
  /* flex-shrink: 1; */
  backdrop-filter: blur(2px);
  padding: 5rem 1rem;
  object-fit: scale-down;
}

.main-content div .screen-cover img {
  box-shadow: 0 0 100px 5px rgba(0, 0, 0, 0.5);
  max-height: 100%;
  /* height: 100%; */
  max-width: 100%;
  /* object-fit: cover; */
  transition: none;
  /* flex-shrink: 1; */
  /* flex-grow: 1; */
  margin: auto;
}


div.main-content article div img.square {
  width: 100%;
}

div.main-content article div img.portrait {
  width: 100%;
}

div.main-content article div img.landscape {
  width: 100%;
}

.main-content article img {
  transition: none;
}

@media screen and (min-width: 700px) {
  div.main-content article div img.square {
    max-width: calc(30ch - 1rem);
    width: 100%;
  }

  div.main-content article div img.portrait {
    max-width: calc(30ch - 1rem);
    width: 100%;
  }

  div.main-content article div img.landscape {
    max-width: calc(60ch - 1rem);
    width: 100%;
  }
}
</style>