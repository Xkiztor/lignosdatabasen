<script setup>
import Slider from '@vueform/slider';
import '@vueform/slider/themes/default.css';
// https://github.com/vueform/slider

const runtimeConfig = useRuntimeConfig();
const enteredPassword = useCookie('enteredPassword', { maxAge: 60604800 });
const client = useSupabaseClient();

const route = useRoute();
const router = useRouter();

console.log(route.query.test);

const searchQuery = ref(route.query.sök || '');

// Watch for changes in the searchQuery
watch(searchQuery, (newQuery) => {
  // Update the URL when the searchQuery changes
  router.replace(
    {
      query: { ...route.query, sök: newQuery || undefined },
    },
    { replace: true }
  );
});

// Watch for changes in the route query
watch(
  () => route.query.sök,
  (newSearch) => {
    // Update the searchQuery when the URL changes
    if (newSearch !== searchQuery.value) {
      searchQuery.value = newSearch || '';
    }
  }
);

const defaultSlider = {
  höjd: {
    min: 0,
    max: 50,
    step: 2,
  },
  bredd: {
    min: 0,
    max: 20,
    step: 1,
  },
  zon: {
    min: 0,
    max: 8,
    step: 1,
  },
};

const höjd = ref([defaultSlider.höjd.min, defaultSlider.höjd.max]);
const bredd = ref([defaultSlider.bredd.min, defaultSlider.bredd.max]);
const zon = ref(defaultSlider.zon.min);
// const zon = ref([defaultSlider.zon.min, defaultSlider.zon.max]);

const zonFormat = (zon) => {
  return zon === 8
    ? 'VIII'
    : zon === 7
    ? 'VII'
    : zon === 6
    ? 'VI'
    : zon === 5
    ? 'V'
    : zon === 4
    ? 'IV'
    : zon === 3
    ? 'III'
    : zon === 2
    ? 'II'
    : zon === 1
    ? 'I'
    : '0';
};
const numberFormat = (zon) => {
  return zon === 'VIII'
    ? 8
    : zon === 'VII'
    ? 7
    : zon === 'VI'
    ? 6
    : zon === 'V'
    ? 5
    : zon === 'IV'
    ? 4
    : zon === 'III'
    ? 3
    : zon === 'II'
    ? 2
    : zon === 'I'
    ? 1
    : 0;
};

const { data: allaVäxter } = await useAsyncData('all-plants-fetch', async () => {
  const { data, error } = await client.from('lignosdatabasen').select().neq('art', 'slakte');
  if (error) {
    console.error(error);
  }
  if (runtimeConfig.public.ADMIN_PASSWORD === enteredPassword.value) {
    return data;
  } else {
    return data.filter((e) => e.hidden !== true);
  }
});
console.log(allaVäxter);

const computedList = computed(() => {
  let newList = allaVäxter.value;

  let queryArray = searchQuery.value.toLowerCase().split(' ');
  if (searchQuery.value) {
    // newList = newList.filter(e => e.text.toLowerCase().contains(searchQuery.value.toLowerCase()))
    newList = newList.filter((item) =>
      queryArray.every((str) =>
        `${item.slakte} ${item.art} ${item.sortnamn}`.toLowerCase().includes(str)
      )
    );
  }

  // --------- Höjd ---------
  if (höjd.value[0] !== defaultSlider.höjd.min || höjd.value[1] !== defaultSlider.höjd.max) {
    newList = newList.filter((obj) => {
      if (!obj.höjd) return false;
      const [lower, upper] = obj.höjd.split('-').map(Number);
      const [filterLower, filterUpper] = höjd.value;
      return (
        (lower >= filterLower && lower <= filterUpper) || // Lower bound of object is within filter range
        (upper >= filterLower && upper <= filterUpper) || // Upper bound of object is within filter range
        (filterLower >= lower && filterLower <= upper) // Filter range overlaps object range
      );
    });
  }
  // --------- Bredd ---------
  if (bredd.value[0] !== defaultSlider.bredd.min || bredd.value[1] !== defaultSlider.bredd.max) {
    newList = newList.filter((obj) => {
      if (!obj.bredd) return false;
      const [lower, upper] = obj.bredd.split('-').map(Number);
      const [filterLower, filterUpper] = bredd.value;
      return (
        (lower >= filterLower && lower <= filterUpper) || // Lower bound of object is within filter range
        (upper >= filterLower && upper <= filterUpper) || // Upper bound of object is within filter range
        (filterLower >= lower && filterLower <= upper) // Filter range overlaps object range
      );
    });
  }
  // --------- zon --------------
  if (zon.value !== defaultSlider.zon.min) {
    newList = newList.filter((obj) => {
      if (!obj.zon) return false;
      numberFormat(obj.zon);
      return (
        numberFormat(obj.zon) >= zon.value
        // (lower >= zon.value && lower <= zon.value) || // Lower bound of object is within filter range
        // (upper >= zon.value && upper <= zon.value) || // Upper bound of object is within filter range
        // (zon.value >= lower && zon.value <= upper) // Filter range overlaps object range
      );
    });
  }

  newList = newList.filter((e) => e.text !== 'Ingen info');
  newList = newList.filter((e) => e.text !== '');

  newList = newList.filter((e) => !e.art.includes('synonym'));

  // --------- Sortering ---------
  newList = newList.sort((a, b) => a.sortnamn.localeCompare(b.sortnamn));
  newList = newList.sort((a, b) => a.art.localeCompare(b.art));
  newList = newList.sort((a, b) => a.slakte.localeCompare(b.slakte));

  if (selectedSortOption.value === 'namn-z-a') {
    newList = newList.reverse();
  } else if (selectedSortOption.value === 'höjd-a-z') {
    newList = newList.filter((e) => e.höjd);
    newList = newList.sort((a, b) => a.höjd.split('-')[0] - b.höjd.split('-')[0]);
  } else if (selectedSortOption.value === 'höjd-z-a') {
    newList = newList.filter((e) => e.höjd);
    newList = newList.sort((a, b) => b.höjd.split('-')[0] - a.höjd.split('-')[0]);
  } else if (selectedSortOption.value === 'bredd-a-z') {
    newList = newList.filter((e) => e.bredd);
    newList = newList.sort((a, b) => a.bredd.split('-')[0] - b.bredd.split('-')[0]);
  } else if (selectedSortOption.value === 'bredd-z-a') {
    newList = newList.filter((e) => e.bredd);
    newList = newList.sort((a, b) => b.bredd.split('-')[0] - a.bredd.split('-')[0]);
  } else if (selectedSortOption.value === 'zon-a-z') {
    newList = newList.filter((e) => e.zon);
    newList = newList.sort((a, b) => numberFormat(a.zon) - numberFormat(b.zon));
  } else if (selectedSortOption.value === 'zon-z-a') {
    newList = newList.filter((e) => e.zon);
    newList = newList.sort((a, b) => numberFormat(b.zon) - numberFormat(a.zon));
  }

  return newList;
});

useSeoMeta({
  title: 'Översikt av alla växter - Lignosdatabasen',
  description:
    'Översikt av alla växter som finns på Lignosdatabasen. Här kan du läsa om vedartade växter, dvs. träd, buskar och klätterväxter.Urvalet siktar på allt som är som är härdigt att odla utomhus i Sverige.',
});

const sortOptions = ref([
  { value: 'namn-a-z', text: 'Namn A-Z' },
  { value: 'namn-z-a', text: 'Namn Z-A' },
  { value: 'höjd-a-z', text: 'Höjd 1-9' },
  { value: 'höjd-z-a', text: 'Höjd 9-1' },
  { value: 'bredd-a-z', text: 'Bredd 1-9' },
  { value: 'bredd-z-a', text: 'Bredd 9-1' },
  { value: 'zon-a-z', text: 'Zon I-IV' },
  { value: 'zon-z-a', text: 'Zon IV-I' },
]);

const defaultSortOption = 'namn-a-z';

const selectedSortOption = ref(sortOptions.value[0].value);

const toggleDropdown = ref(false);

const selectOption = (option) => {
  selectedSortOption.value = option.value;
  // toggleDropdown.value = false;
};

const dropdown = ref(null);
onClickOutside(dropdown, () => {
  console.log('outside');
  toggleDropdown.value = false;
});

const isFiltered = computed(() => {
  return (
    höjd.value[0] !== defaultSlider.höjd.min ||
    höjd.value[1] !== defaultSlider.höjd.max ||
    bredd.value[0] !== defaultSlider.bredd.min ||
    bredd.value[1] !== defaultSlider.bredd.max ||
    zon.value !== defaultSlider.zon.min ||
    searchQuery.value ||
    selectedSortOption.value !== defaultSortOption
  );
});

const resetFilters = () => {
  höjd.value = [defaultSlider.höjd.min, defaultSlider.höjd.max];
  bredd.value = [defaultSlider.bredd.min, defaultSlider.bredd.max];
  zon.value = defaultSlider.zon.min;
  searchQuery.value = '';
  selectedSortOption.value = defaultSortOption;
};
</script>

<template>
  <div class="page alla-växter-page">
    <div class="top-part">
      <div>
        <h1>Alla växter</h1>
        <div class="side">
          <button @click="resetFilters()" :class="{ disabled: !isFiltered }" class="rensa">
            <Icon name="material-symbols:close-rounded" />Rensa filter
          </button>
          <div class="search">
            <button @click="searchQuery = ''">
              <Icon v-if="searchQuery" name="material-symbols:close-rounded" class="stäng-ikon" />
              <Icon v-else name="material-symbols:search-rounded" class="sök-ikon" />
            </button>
            <input type="text" placeholder="Sök" v-model="searchQuery" />
          </div>
          <div class="dropdown-wrapper" ref="dropdown" @click="toggleDropdown = !toggleDropdown">
            <button class="dropdown-toggle">
              <Icon name="tabler:sort-descending" />
              <span>{{
                sortOptions.find((option) => option.value === selectedSortOption).text
              }}</span>
              <Icon name="material-symbols:keyboard-arrow-down-rounded" />
            </button>
            <ul v-if="toggleDropdown" class="dropdown-menu">
              <li v-for="option in sortOptions" :key="option.value" @click="selectOption(option)">
                {{ option.text }}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="filters">
        <div class="sliders">
          <div class="filter">
            <h2>
              <span>Höjd</span><span>{{ höjd[0] }} - {{ höjd[1] }} meter</span>
            </h2>
            <div>
              <Slider
                v-model="höjd"
                :min="defaultSlider.höjd.min"
                :max="defaultSlider.höjd.max"
                :step="defaultSlider.höjd.step"
                tooltipPosition="bottom"
                showTooltip="drag"
              />
            </div>
          </div>
          <div class="filter">
            <h2>
              <span>Bredd</span><span>{{ bredd[0] }} - {{ bredd[1] }} meter</span>
            </h2>
            <div>
              <Slider
                v-model="bredd"
                :min="defaultSlider.bredd.min"
                :max="defaultSlider.bredd.max"
                :step="defaultSlider.bredd.step"
                tooltipPosition="bottom"
                showTooltip="drag"
              />
            </div>
          </div>
          <div class="filter">
            <h2>
              <span>Zon</span><span class="zon slab-font">{{ zonFormat(zon) }}</span>
            </h2>
            <!-- <h2>Zon: {{ zon[0] }} - {{ zon[1] }}</h2> -->
            <div>
              <Slider
                class="slab-font"
                v-model="zon"
                :min="defaultSlider.zon.min"
                :max="defaultSlider.zon.max"
                :step="defaultSlider.zon.step"
                tooltipPosition="bottom"
                showTooltip="drag"
                :format="zonFormat"
              />
            </div>
          </div>
        </div>
        <div class="utility"></div>
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

  .alla-växter-page .top-part h1 {
    font-size: 2.5rem;
  }
}

.alla-växter-page .top-part {
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 1rem;
  margin-bottom: 2rem;
  /* display: flex; */
  /* flex-direction: column; */
  /* justify-content: space-between; */
  /* align-items: flex-end; */
}

@media screen and (min-width: 1000px) {
  .alla-växter-page .top-part {
    gap: 5rem;
  }

  .alla-växter-page .top-part h1 {
    font-size: 2.5rem;
  }
}

@media screen and (max-width: 1000px) {
  .alla-växter-page .top-part {
    gap: 1rem;
  }
}

@media screen and (max-width: 1000px) {
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
  min-width: 9ch;
}

.alla-växter-page .top-part > :first-child {
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

@media screen and (max-width: 700px) {
  .alla-växter-page .top-part > :first-child {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  .alla-växter-page .top-part > :first-child input {
    width: 100%;
  }
}

.top-part .search {
  background: var(--element-bg);
  border-radius: 100rem;
  display: flex;
  align-items: center;
  padding: 0.1rem 0.5rem;
  border: 1px solid transparent;
}

.top-part .search * {
  background: none;
  border: none;
  /* padding: 0.5rem; */
  /* cursor: pointer; */
}

.top-part .search .icon {
  font-size: 1.1em;
}

.top-part .search:has(input:focus) {
  border: 1px solid var(--primary-green);
}

.top-part .filters {
  /* display: grid; */
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 2rem;
  /* grid-template-columns: 1fr 1fr 1fr 1fr; */
  /* gap: 3rem; */
  /* place-items: end center; */
  /* width: 100%; */
  /* flex-grow: 1; */
}

@media screen and (max-width: 1000px) {
  .top-part .filters {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-end;
  }
  /* .top-part .filters {
    grid-template-columns: 1fr 1fr;
    place-items: center;
    width: 100%;
    gap: 1rem 3rem;
    margin-top: 1rem;
  } */

  /* .top-part .filters .search {
    border-radius: 100rem;
    padding-left: 1rem;
    width: 100%;
  } */
}

@media screen and (max-width: 500px) {
  /* .top-part .filters {
    gap: 1.5rem;
    place-items: center;
    grid-template-columns: 1fr;
  } */
}

.top-part .filters .sliders {
  width: 100%;
  flex-grow: 1;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 5rem;
}

@media screen and (max-width: 700px) {
  .top-part .filters .sliders {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

.filters * {
  transition: none;
}

.top-part .filters .slider-target {
  width: 100%;
  margin-bottom: 0.25rem;
}

.top-part .filters h2 {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.top-part .filter {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 2px;
  /* grid-template-rows: 1fr 1fr;
  place-items: center; */
  height: 100%;
  width: 100%;
  gap: 0.5rem;
}

.top-part .filter > div {
  width: 100%;
  padding: 0 calc(var(--slider-handle-width) / 2);
  /* font-family: var(--title-font); */
}

.filter .slider-connects {
  cursor: pointer;
}

.top-part .rensa {
  min-width: max-content;
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  height: 100%;
  align-items: center;
  border-radius: 100rem;
}

.top-part .rensa.disabled {
  opacity: 0.3;
  pointer-events: none;
}

.top-part .side {
  display: grid;
  grid-template-columns: max-content 1fr max-content;
  /* display: flex; */
  gap: 1rem;
  align-items: center;
}

@media screen and (max-width: 1000px) {
  .top-part .side {
    grid-template-columns: max-content 1fr;
  }

  .top-part .side .search {
    grid-column: 1/3;
    grid-row: 1;
  }
}

@media screen and (max-width: 600px) {
  .top-part .side {
    width: 100%;
  }

  .top-part .side > * {
    width: 100%;
  }
  .top-part .side .dropdown-toggle {
    width: 100%;
  }
}
@media screen and (max-width: 450px) {
  .top-part .side {
    grid-template-columns: 1fr;
  }

  .top-part .side .search {
    grid-column: 1;
    grid-row: 1;
  }

  .top-part .side .dropdown-wrapper {
    grid-row: 2;
  }

  .top-part .side > * {
    width: 100%;
  }
  .top-part .side .dropdown-toggle {
    width: 100%;
  }
}

.dropdown-wrapper {
  position: relative;
  display: inline-block;
  padding: 0;
  height: 100%;
}

.dropdown-toggle {
  padding: 0.5rem 1rem;
  border-radius: 1000rem;
  border: 1px solid transparent;
  background: var(--element-bg);
  color: var(--text-color);
  /* font-size: 1rem; */
  cursor: pointer;
  /* min-width: 8rem; */
  height: 100%;
  transition: none;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: space-between;
}

.dropdown-toggle span {
  min-width: max-content;
  padding-right: 2rem;
}

.dropdown-toggle .icon {
  font-size: var(--font-2xl);
}

.dropdown-wrapper:has(.dropdown-menu) .dropdown-toggle {
  /* border-radius: 1rem 1rem 0 0; */
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: var(--element-bg);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  /* box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); */
  box-shadow: var(--shadow-xl), var(--shadow-md);
  z-index: 1000;
  width: 100%;
  padding: 0.5rem;
}

.dropdown-menu li {
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 0.25rem;
}

.dropdown-menu li:hover {
  background: var(--primary-green);
  color: var(--text-color-dark);
}

.top-part .utility .sort select {
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid transparent;
  background: var(--element-bg);
  color: var(--text-color);
  font-size: 1rem;
  cursor: pointer;
}

.top-part .utility .sort select:focus {
  outline: none;
  border-color: var(--primary-green);
}

html {
  --slider-connect-bg: var(--text-color);
  --slider-tooltip-bg: var(--text-color);
  --slider-handle-ring-color: #76994e30;
  --slider-bg: var(--element-bg);
  --slider-handle-bg: var(--text-color);
  /* --slider-handle-bg: var(--title-color-dark); */
  --slider-tooltip-color: var(--title-color-dark);

  --slider-connect-bg-disabled: #9ca3af;
  --slider-height: 6px;
  --slider-vertical-height: 300px;
  --slider-radius: 9999px;

  --slider-handle-border: 0;
  --slider-handle-width: 16px;
  --slider-handle-height: 16px;
  --slider-handle-radius: 9999px;
  --slider-handle-shadow: none;
  /* --slider-handle-shadow: 0.5px 0.5px 2px 1px rgba(0, 0, 0, 0.22); */
  --slider-handle-shadow-active: none;
  /* --slider-handle-shadow-active: 0.5px 0.5px 2px 1px rgba(0, 0, 0, 0.42); */
  --slider-handle-ring-width: 3px;

  --slider-tooltip-font-size: 0.875rem;
  --slider-tooltip-line-height: 1.25rem;
  --slider-tooltip-font-weight: 600;
  --slider-tooltip-min-width: 20px;
  --slider-tooltip-bg-disabled: #9ca3af;
  --slider-tooltip-radius: 8px;
  --slider-tooltip-py: 2px;
  --slider-tooltip-px: 6px;
  --slider-tooltip-arrow-size: 8px;
  --slider-tooltip-distance: 3px;
}

html.dark {
  --slider-handle-bg: var(--text-color-dark);
  --slider-tooltip-bg: var(--element-bg);
  --slider-tooltip-color: var(--text-color-dark);
}
</style>
