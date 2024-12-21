<script setup>
const client = useSupabaseClient();

const route = useRoute();
// const router = useRouter();

const superlistYear = 2024;

const isOnSuperlistan = ref(false);
const superlistan = ref();

// const { data: superlistan } = await useAsyncData('is-on-superlistan', async () => {
const { data, error } = await client
  .from(`superlista-${superlistYear}`)
  .select()
  .eq(
    'Namn',
    `${route.params.slakte} ${route.params.art === '-' ? '' : route.params.art} ${
      route.params.sortnamn ? "'" : ''
    }${route.params.sortnamn}${route.params.sortnamn ? "'" : ''}`
  );

if (error) {
  console.error(error);
}
if (data && data.length > 0) {
  superlistan.value = data[0];
  isOnSuperlistan.value = true;
}

// console.log(data);
// return data;
// });
</script>

<template>
  <div class="superlistan" v-if="isOnSuperlistan">
    <h1>Finns att köpa på Linders Superlista</h1>
    <a
      :href="`https://superlistan.lindersplantskola.se/lista?s=${superlistan.Namn.replace(
        /\s+/g,
        '+'
      )}`"
      target="_blank"
      >Till superlistan <Icon name="material-symbols:open-in-new-rounded"
    /></a>
  </div>
</template>

<style>
.content .finns-att-kopa .superlistan {
  border: 1px solid var(--border-color-light);
  padding: 1rem;
  border-radius: 1rem;
  display: grid;
  gap: 0.75rem;
}

.content .finns-att-kopa .superlistan h1 {
  font-size: 1.5rem;
  margin: 0;
}

.content .finns-att-kopa .superlistan a {
  color: var(--text-color-dark);
  text-decoration: underline;
}
</style>
