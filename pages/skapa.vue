<script setup>
const plantName = ref('')
const description = ref('')
const imageStrings = ref('')

const showImage = ref(false)

const imageArray = computed(() => {
  let newArray = imageStrings.value.split("\n")

  if (imageStrings.value) {
    showImage.value = true
  } else {
    showImage.value = false
  }

  return newArray
})

const formCheck = () => {
  if (plantName) {
    addPlant()
  }
}

const client = useSupabaseClient()

const addPlant = async () => {
  console.log('adding')

  const { data, error } = await client.from('växt-databas').insert({ namn: plantName.value, beskrivning: description.value, bilder: imageArray.value }).select()
  if (error) {
    console.log(error);
  }
  if (data) {
    console.log(data);
    navigateTo('/data')
  }
}

</script>


<template>
  <div class="page">
    <div class="create">
      <h1>Lägg till växt</h1>
      <div class="image-grid" v-if="showImage">
        <nuxt-img v-for="image in imageArray" fit="cover" :src="image" />
      </div>
      <input v-model="plantName" type="text" placeholder="Växtnamn" />
      <textarea v-model="description" type="text" placeholder="Beskrivning" />
      <textarea v-model="imageStrings" type="text" placeholder="Bilder (separeras med enter)" />
      <button @click="formCheck">Lägg till</button>
    </div>
  </div>
</template>


<style>
.page {
  /* flex-grow: 1; */
  display: grid;
  place-items: center;
}

.page .create {
  max-width: 40rem;
  height: fit-content;
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.page textarea {
  transition: none;
  min-height: 6rem;
  min-width: 20rem;
}

.create .image-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  /* grid-auto-columns: auto; */
  /* grid-template-columns: minmax(0, 3fr); */
  /* max-height: 10rem; */
  gap: 1rem;
}

.create .image-grid img {
  width: 100%;
  height: 10rem;
  object-fit: cover;
  aspect-ratio: 1 / 1;
  border-radius: 0.5rem;
  /* max-width: 5rem; */
  /* max-height: 5rem; */
}
</style>