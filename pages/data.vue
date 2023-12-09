<script setup>
const runtimeConfig = useRuntimeConfig();
const enteredPassword = useCookie('enteredPassword', { maxAge: 60604800 });

const query = ref('')

const client = useSupabaseClient()

// const { data: plants } = await useAsyncData('plantor', async () => {
//   const { data } = await client.from('växt-databas').select().eq('hidden', 'FALSE')

//   return data
// })

const plants = ref()

const filteredList = computed(() => {
  if (plants.value) {
    let queryArray = query.value.toLowerCase().split(" ")

    let newList = plants.value
    newList = newList.filter(item => queryArray.every(str => item.namn.toLowerCase().includes(str)))

    newList.sort((a, b) => {
      if (a.namn < b.namn) return -1
      if (a.namn > b.namn) return 1
      return 0
    })


    return newList
  }
  else {
    return undefined
  }
})
// console.log(plants.value);
</script>


<template>
  <div class="page">
    <div class="filter">
      <h1>Databas</h1>
      <div class="action-grid">
        <input class="search" v-model="query" type="text" placeholder="Sök">
        <!-- <NuxtLink v-if="runtimeConfig.public.ADMIN_PASSWORD === enteredPassword" to="/skapa"><button>Lägg till
            växt</button></NuxtLink> -->
        <button v-if="runtimeConfig.public.ADMIN_PASSWORD === enteredPassword" @click="navigateTo('/skapa')">
          Lägg till växt
        </button>
      </div>
    </div>
    <div class="data">
      <Card v-for="plant in filteredList" :plant="plant" />
    </div>
  </div>
</template>


<style>
.page {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  max-width: 90rem;
  margin: 0 auto;
  width: 100%;
}

.page>div {
  flex-grow: 1;
}

.page .filter {
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 1rem;
  width: 100%;
}

.filter .search {
  grid-column: 1 / 3;
}

.filter .action-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(2, 1fr);
}

.page .data {
  padding-top: 1rem;

  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

@media screen and (min-width: 550px) {

  .page .data,
  .filter .action-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media screen and (min-width: 850px) {

  .page .data,
  .filter .action-gri {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media screen and (min-width: 1200px) {

  .page .data,
  .filter .action-gri {
    grid-template-columns: repeat(5, 1fr);
  }
}

@media screen and (min-width: 1600px) {

  .page .data,
  .filter .action-gri {
    grid-template-columns: repeat(6, 1fr);
  }
}

.card {
  border: 1px solid var(--border-color);
  padding: 1rem;
  border-radius: 0.5rem;
}

.card img {
  width: 100%;
  aspect-ratio: 1/1;
  object-fit: cover;
  border-radius: 0.5rem;
}

.card h2 {
  margin: 0.25rem 0;
}

.card p {
  margin: 0;
  color: var(--mute-white);
}

.card a {
  text-decoration: none;
  color: var(--text-color);
}
</style>