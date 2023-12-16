<script setup lang='tsx'>

const props = defineProps(['plant'])

const testText = 'Hej här kommer en bild: [http://fotodendron.se/wp/wp-content/uploads/2015/01/Acer_cappadocicum_Aureum_Li_31141_resize_sharp-550x366.jpg] Ser det bra ut?'

const text = ref('Hej [http://fotodendron.se/wp/wp-content/uploads/2015/01/Acer_cappadocicum_Aureum_Li_31141_resize_sharp-550x366.jpg]')

// text.value = props.plant.text

// regex
const separatedString = await props.plant.text.split(/[\[\]]/).filter(str => str !== '')

console.log(separatedString);

const checkIfLink = (string: string) => {
  const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
  return urlRegex.test(string);
}

const checkIfSpacer = (string: string) => {
  return string === 'n'
}
</script>


<template>
  <div>
    <div v-for="string in separatedString">
      <img :src="string" :alt="string" v-if="checkIfLink(string)">
      <p v-else-if="checkIfSpacer(string)" class="spacer"></p>
      <p v-else>{{ string }}</p>
    </div>
  </div>
</template>


<style>
.spacer {
  height: 1em;
}
</style>