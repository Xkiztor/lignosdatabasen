<script setup>
const state = useGlobalState();

// const items = ref(
//   JSON.parse(state.currentPagePlant.value ? state.currentPagePlant.value.tabell : '{}')
// );

// const items = ref(
//   JSON.parse(state.currentPagePlant.value ? state.currentPagePlant.value.tabell : '[{}]')
// );

// if (state.currentPagePlant.value !== null) {
//   const items = ref(
//     JSON.parse(state.currentPagePlant.value ? state.currentPagePlant.value.tabell : '[{}]')
//   );
// } else {
//   const items = ref([{}]);
// }

// const items = computed(() => {
//   console.log(state.currentPagePlant.value);

//   if (state.currentPagePlant.value !== null) {
//     return JSON.parse(state.currentPagePlant.value ? state.currentPagePlant.value.tabell : '[{}]');
//   } else {
//     return [{}];
//   }
// });

// const items = ref([
//   {
//     Namn: 'Acer platanoides',
//     Höjd: 10,
//     Bredd: 5,
//     Zon: 4,
//     Färg: 'Grön',
//     Blomning: 'Maj',
//     Läge: 'Sol',
//   },
// ]);

// const egenskaper = ref();
// const aktivaEgenskaper = ref();

const items = computed(() => {
  console.log(state.currentPagePlant.value);
  // let e = JSON.parse(state.currentPagePlant.value ? state.currentPagePlant.value.tabell : '[{}]');
  // egenskaper.value = Object.keys(e[0]).filter((item) => item !== 'Namn');
  // aktivaEgenskaper.value = [egenskaper.value[0]];

  // return e;
  // if (state.currentPagePlant.value !== null) {
  //   // e = JSON.parse(state.currentPagePlant.value.tabell);

  //   return JSON.parse(state.currentPagePlant.value.tabell);
  // } else {
  //   return [{}];
  // }

  return [{}];
});

const egenskaper = ref(Object.keys(items.value[0]).filter((item) => item !== 'Namn'));
const aktivaEgenskaper = ref([egenskaper[0]]);

const toggleEgenskap = (item) => {
  const index = aktivaEgenskaper.value.indexOf(item);
  if (index > -1) {
    aktivaEgenskaper.value.splice(index, 1);
  } else {
    if (aktivaEgenskaper.value.length >= 5) {
      aktivaEgenskaper.value.shift();
    }
    aktivaEgenskaper.value.push(item);
  }
};
</script>

<template>
  <div class="tabell">
    <h2>Släktesöversikt</h2>
    <div class="pills">
      <div
        class="pill"
        v-for="egenskap in egenskaper"
        :key="egenskap"
        @click="toggleEgenskap(egenskap)"
        :class="{ active: aktivaEgenskaper.includes(egenskap) }"
      >
        <span>{{ egenskap }}</span>
      </div>
    </div>
    <div>
      <table>
        <thead>
          <tr>
            <th>Namn</th>
            <th v-for="egenskap in aktivaEgenskaper" :key="egenskap">{{ egenskap }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.Namn">
            <td>{{ item.Namn }}</td>
            <td v-for="egenskap in aktivaEgenskaper" :key="egenskap">{{ item[egenskap] }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style>
.center-content .tabell {
}

.center-content .tabell .pills {
  display: flex;
  gap: 0.5rem;
}

.center-content .tabell .pill {
  padding: 0.35rem 1rem;
  border-radius: 100rem;
  cursor: pointer;
}

.center-content .tabell .pill.active {
  background: var(--primary-green);
  color: white;
}
</style>
