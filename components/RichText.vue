<script setup lang='tsx'>

const props = defineProps(['plant'])

const testText = 'Hej här kommer en bild: [http://fotodendron.se/wp/wp-content/uploads/2015/01/Acer_cappadocicum_Aureum_Li_31141_resize_sharp-550x366.jpg] Ser det bra ut?'

const text = ref('Hej [http://fotodendron.se/wp/wp-content/uploads/2015/01/Acer_cappadocicum_Aureum_Li_31141_resize_sharp-550x366.jpg]')

// text.value = props.plant.text

// regex
const separatedString = computed(() => {
  return props.plant.text.split(/[\[\]]/).filter(str => str !== '')
})

console.log(separatedString);

const checkIfLink = (string: string) => {
  const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
  return urlRegex.test(string);
}

const checkIfSpacer = (string: string) => {
  return string === 'n'
}

const image = ref()

onMounted(() => {
  console.log(image.value);
})

const imageOreientation = computed(() => {
  if (!image.value) {
    return 'temp'
  } else {
    console.log(image.value[0].width);
    console.log(image.value[0].height);

    if (image.value[0].width === image.value[0].height) {
      return 'square'
    } else if (image.value[0].width > image.value[0].height) {
      return 'landscape'
    } else {
      return 'portrait'
    }
  }

  // return 'temp'
})

</script>


<template>
  <div>
    <div v-for="string in separatedString">
      <!-- <img :src="string" :alt="string" ref="image" v-if="checkIfLink(string)" @click="logFunc($refs.image[0].height)"> -->
      <!-- <img :src="string" :alt="string" ref="image"
        :class="{ 'square': image[0]?.width === image[0]?.height, 'landscape': image[0]?.width > image[0]?.height, 'portrait': image[0]?.width < image[0]?.height }"
        v-if="checkIfLink(string)"> -->
      <img :src="string" :alt="string" ref="image" :class="imageOreientation" v-if="checkIfLink(string)">
      <p v-else-if="checkIfSpacer(string)" class="spacer"></p>
      <p v-else>{{ string }}</p>
    </div>
  </div>
</template>


<style>
.spacer {
  height: 1em;
}

.main-content article img.square {
  max-width: calc(30ch - 1rem);
  width: 100%;
}

.main-content article img.portrait {
  max-width: calc(30ch - 1rem);
  width: 100%;
}

.main-content article img.landscape {
  /* max-width: calc(30ch - 1rem); */
  max-width: 60ch;
  width: 100%;
}
</style>