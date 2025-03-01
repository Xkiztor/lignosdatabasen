<script setup>
const maxEgenskaperLarge = 3;
const maxEgenskaperMobile = 2;

const state = useGlobalState();

const items = ref(JSON.parse(state.currentPagePlant.value.tabell));
console.log(items.value);
const egenskaper = ref(
  items.value?.length
    ? Object.keys(items.value[0])
        .filter((item) => item !== 'Namn')
        .sort()
    : []
);
const aktivaEgenskaper = ref(egenskaper.value.slice(0, 3));

console.log(egenskaper.value);

const toggleEgenskap = (item) => {
  const index = aktivaEgenskaper.value.indexOf(item);
  if (index > -1) {
    if (aktivaEgenskaper.value.length > 1) {
      aktivaEgenskaper.value.splice(index, 1);
    }
  } else {
    if (aktivaEgenskaper.value.length >= maxEgenskaperLarge) {
      aktivaEgenskaper.value.shift();
    }
    aktivaEgenskaper.value.push(item);
  }
};

const removeNumber = (item) => {
  return item.replace(/^\d+\s*/, '');
};

const sortedAktiva = () => {
  return [...aktivaEgenskaper.value].sort();
};
</script>

<template>
  <div class="tabell" v-if="items.length > 0">
    <h2>Släktesöversikt</h2>
    <div class="pills">
      <div
        class="pill"
        v-for="egenskap in egenskaper"
        :key="egenskap"
        @click="toggleEgenskap(egenskap)"
        :class="{ active: aktivaEgenskaper.includes(egenskap) }"
      >
        <span>{{ removeNumber(egenskap) }}</span>
      </div>
    </div>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Namn</th>
            <th v-for="egenskap in sortedAktiva()" :key="egenskap">
              {{ removeNumber(egenskap) }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.Namn">
            <td>{{ item.Namn }}</td>
            <td v-for="egenskap in sortedAktiva()" :key="egenskap">{{ item[egenskap] }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style>
.center-content .tabell {
  width: 100%;
  display: block;
}

.center-content .tabell h2 {
  width: fit-content;
}

.center-content .tabell .pills {
  display: flex;
  gap: 0.5rem;
  margin: 0.5rem 0;
  flex-wrap: wrap;
  width: 100%;
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

.center-content .tabell .table-container {
  display: block;
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.center-content .tabell table {
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;
}

.center-content .tabell th,
.center-content .tabell td {
  min-width: 120px;
  padding: 0.5rem 1rem 0.5rem 0;
  /* word-break: break-word; */
}

.center-content .tabell thead {
  border-bottom: 1px solid var(--border-color);
}

.center-content .tabell tbody tr:first-child td {
  padding-top: 0.25rem;
}
</style>
