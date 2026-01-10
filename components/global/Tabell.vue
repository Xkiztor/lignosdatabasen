<script setup>
const maxEgenskaperLarge = 3;
const maxEgenskaperMobile = 2;

const state = useGlobalState();

// Use computed to safely access tabell data with fallbacks for SSR
const items = computed(() => {
  try {
    const tabell = state.currentPagePlant.value?.tabell;
    return tabell ? JSON.parse(tabell) : [];
  } catch {
    return [];
  }
});

const egenskaper = computed(() => {
  if (!items.value?.length) return [];
  return Object.keys(items.value[0])
    .filter((item) => item !== 'Namn')
    .sort();
});

const aktivaEgenskaper = ref([]);

// Initialize aktivaEgenskaper when egenskaper changes
watch(
  egenskaper,
  (newVal) => {
    if (newVal.length && !aktivaEgenskaper.value.length) {
      aktivaEgenskaper.value = newVal.slice(0, 3);
    }
  },
  { immediate: true }
);

// Column resizing functionality
const isResizing = ref(false);
const currentColumn = ref(null);
const startX = ref(0);
const startWidth = ref(0);
const tableRef = ref(null);

const startResize = (event, columnIndex) => {
  isResizing.value = true;
  currentColumn.value = columnIndex;
  startX.value = event.clientX;

  const table = tableRef.value;
  const th = table.querySelector(`thead tr th:nth-child(${columnIndex + 1})`);
  startWidth.value = th.offsetWidth;

  document.addEventListener('mousemove', handleResize);
  document.addEventListener('mouseup', stopResize);
  event.preventDefault();
};

const handleResize = (event) => {
  if (!isResizing.value) return;

  const diff = event.clientX - startX.value;
  const newWidth = Math.max(80, startWidth.value + diff); // Minimum width of 80px

  const table = tableRef.value;
  const th = table.querySelector(`thead tr th:nth-child(${currentColumn.value + 1})`);
  th.style.width = newWidth + 'px';
};

const stopResize = () => {
  isResizing.value = false;
  currentColumn.value = null;
  document.removeEventListener('mousemove', handleResize);
  document.removeEventListener('mouseup', stopResize);
};

onUnmounted(() => {
  document.removeEventListener('mousemove', handleResize);
  document.removeEventListener('mouseup', stopResize);
});

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
  // Removes leading numbers and spaces from the property name
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
      <table ref="tableRef">
        <thead>
          <tr>
            <th class="resizable-column">
              <span>Namn</span>
              <div class="resize-handle" @mousedown="startResize($event, 0)"></div>
            </th>
            <th
              v-for="(egenskap, index) in sortedAktiva()"
              :key="egenskap"
              class="resizable-column"
            >
              <span>{{ removeNumber(egenskap) }}</span>
              <div class="resize-handle" @mousedown="startResize($event, index + 1)"></div>
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

.center-content .tabell * {
  transition: none;
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
  user-select: none;
}

.center-content .tabell th,
.center-content .tabell td {
  min-width: 120px;
  padding: 0.5rem 1rem 0.5rem 0;
  position: relative;
  /* word-break: break-word; */
}

.center-content .tabell .resizable-column {
  position: relative;
}

.center-content .tabell .resize-handle {
  position: absolute;
  top: 0;
  right: 0;
  width: 6px;
  height: 100%;
  background: transparent;
  cursor: col-resize;
  z-index: 1;
  margin-right: 0.5rem;
}

.center-content .tabell .resize-handle:hover {
  background: var(--primary-green);
}

.center-content .tabell .resize-handle:active {
  background: var(--primary-green);
}

.center-content .tabell thead {
  border-bottom: 1px solid var(--border-color);
}

.center-content .tabell tbody tr:first-child td {
  padding-top: 0.25rem;
}

.center-content .tabell tbody tr td {
  border-bottom: 1px solid var(--border-color);
}

.center-content .tabell thead {
  text-align: left;
}
</style>
