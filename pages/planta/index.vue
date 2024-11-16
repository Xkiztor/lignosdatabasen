<script setup>
const runtimeConfig = useRuntimeConfig();
const enteredPassword = useCookie('enteredPassword', { maxAge: 60604800 });
const client = useSupabaseClient()

const route = useRoute()
const router = useRouter()

console.log(route.query.test);

const searchQuery = ref(route.query.sök || '')

// Watch for changes in the searchQuery
watch(searchQuery, (newQuery) => {
  // Update the URL when the searchQuery changes
  router.replace({
    query: { ...route.query, sök: newQuery || undefined }
  }, { replace: true })
})

// Watch for changes in the route query
watch(() => route.query.sök, (newSearch) => {
  // Update the searchQuery when the URL changes
  if (newSearch !== searchQuery.value) {
    searchQuery.value = newSearch || ''
  }
})


const { data: allaVäxter } = await useAsyncData('all-plants-fetch', async () => {
  const { data, error } = await client
    .from('växt-databas')
    .select()
    .neq('art', 'slakte')
  if (error) {
    console.error(error);
  }
  if (runtimeConfig.public.ADMIN_PASSWORD === enteredPassword.value) {
    return data
  } else {
    return data.filter(e => e.hidden !== true)
  }
})
console.log(allaVäxter);

const computedList = computed(() => {
  let newList = allaVäxter.value

  let queryArray = searchQuery.value.toLowerCase().split(" ")
  if (searchQuery.value) {
    // newList = newList.filter(e => e.text.toLowerCase().contains(searchQuery.value.toLowerCase()))
    newList = newList.filter(item => queryArray.every(str => `${item.slakte} ${item.art} ${item.sortnamn}`.toLowerCase().includes(str)))
  }



  newList = newList.filter(e => e.text !== 'Ingen info')

  newList = newList.sort((a, b) => a.sortnamn.localeCompare(b.sortnamn))
  newList = newList.sort((a, b) => a.art.localeCompare(b.art))
  newList = newList.sort((a, b) => a.slakte.localeCompare(b.slakte))

  return newList
})

</script>


<template>
  <div class="page alla-växter-page">
    <div class="top-part">
      <h1>Alla växter</h1>
      <div>
        <input type="text" placeholder="Sök" v-model="searchQuery">
      </div>
    </div>
    <div class="grid-layout">
      <Card v-for="växt in computedList" :key="växt.id" :växt="växt" />
    </div>
  </div>
</template>


<style>
.page.alla-växter-page {
  padding: 0 1rem;
}

.alla-växter-page .grid-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  /* padding: 0 1rem; */
  position: relative;
}

.alla-växter-page .grid-layout,
.alla-växter-page .top-part {
  max-width: 80rem;
  margin: 1rem auto 0;
}

@media screen and (min-width: 500px) {
  .alla-växter-page .grid-layout {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
}

@media screen and (min-width: 1000px) {
  .alla-växter-page .grid-layout {
    grid-template-columns: 1fr 1fr 1fr;
    gap: 2rem;
  }
}

.alla-växter-page .top-part {
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 1rem;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
}

@media screen and (max-width: 700px) {
  .alla-växter-page .top-part {
    margin-left: 1rem;
    margin-right: 1rem;
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }

  .dark .alla-växter-page .top-part {
    margin-left: 0;
    margin-right: 0;
  }
}

.alla-växter-page .top-part h1 {
  font-size: 2rem;
  line-height: 1;
}
</style>