<script setup>
const runtimeConfig = useRuntimeConfig();
const enteredPassword = useCookie('enteredPassword', { maxAge: 60604800 });
const client = useSupabaseClient()

const { data: allaVäxter } = await useAsyncData('all-plants-fetch', async () => {
  const { data, error } = await client
    .from('växt-databas')
    .select()
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
        <input type="text" name="" id="" placeholder="Sök">
      </div>
    </div>
    <div class="grid-layout">
      <Card v-for="växt in computedList" :växt="växt" />
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

.alla-växter-page .top-part h1 {
  font-size: 2rem;
  line-height: 1;
}
</style>