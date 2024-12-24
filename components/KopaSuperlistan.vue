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
    <Icon name="material-symbols:shopping-cart-rounded" />
    <h1>
      Finns att köpa på:
      <a
        :href="`https://superlistan.lindersplantskola.se/lista?s=${superlistan.Namn.replace(
          /\s+/g,
          '+'
        )}`"
        target="_blank"
        ><span>Linders Superlista</span> <Icon name="material-symbols:open-in-new-rounded"
      /></a>
    </h1>
    <!-- <a
      :href="`https://superlistan.lindersplantskola.se/lista?s=${superlistan.Namn.replace(
        /\s+/g,
        '+'
      )}`"
      target="_blank"
      >Till superlistan <Icon name="material-symbols:open-in-new-rounded"
    /></a> -->
  </div>
</template>

<style>
.content .finns-att-kopa .superlistan {
  border: 1px solid var(--border-color-light);
  padding: 1rem;
  border-radius: 1rem;
  display: grid;
  grid-template-columns: min-content 1fr;
  gap: 0.75rem;
  place-items: center start;
}

.content .finns-att-kopa .superlistan > .icon {
  font-size: 2.5rem;
}

.content .finns-att-kopa .superlistan h1 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 700;
}
.content .finns-att-kopa .superlistan h1 a {
  margin-top: 0.25rem;
  font-weight: 800;
  font-size: 1.5rem;
  display: block;
  color: #fff;
  text-decoration: underline;
}
</style>
