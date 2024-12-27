<script setup>
useHead({
  title: 'Lignosdatabasen - Samlad informationskälla om lignoser',
  // or, instead:
  // titleTemplate: (title) => `My App - ${title}`,
  viewport: 'width=device-width, initial-scale=1, maximum-scale=6',
  charset: 'utf-8',
  meta: [
    {
      name: 'description',
      content:
        'Samlad informationskälla om lignoser. Här kan du läsa om vedartade växter, dvs. träd, buskar och klätterväxter.Urvalet siktar på allt som är som är härdigt att odla utomhus i Sverige men även en del som är på gränsen mensom kan klara t.ex. innergårdar i städerna eller kallväxthus.',
    },
    {
      name: 'ogDescription',
      content:
        'Samlad informationskälla om lignoser. Här kan du läsa om vedartade växter, dvs. träd, buskar och klätterväxter.Urvalet siktar på allt som är som är härdigt att odla utomhus i Sverige men även en del som är på gränsen mensom kan klara t.ex. innergårdar i städerna eller kallväxthus.',
    },
    // { name: 'keywords', content: 'Lista, Lindersplantskola, superlista, Växter, ovanliga växter, lista att beställa ifån, 2024' },
    { name: 'author', content: 'Ugo Linder, Peter Linder' },
  ],
  bodyAttrs: {
    // class: 'test'
  },
  htmlAttrs: {
    lang: 'se',
  },
  link: [
    // {
    //   rel: 'preconnect',
    //   href: 'https://fonts.googleapis.com',
    // },
    // {
    //   rel: 'stylesheet',
    //   href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600;700;800;900&display=swap',
    //   crossorigin: '',
    // },
    // {
    //   rel: 'stylesheet',
    //   href: 'https://fonts.googleapis.com/css2?family=Roboto+Slab&display=swap',
    //   crossorigin: '',
    // },
    // {
    //   rel: 'stylesheet',
    //   href: 'https://fonts.googleapis.com/css2?family=Open+Sans&display=swap',
    //   crossorigin: '',
    // },
    {
      rel: 'canonical',
      href: 'https://lignosdatabasen.se',
    },
  ],
});

useSeoMeta({
  ogImage:
    'https://res.cloudinary.com/dxwhmugdr/image/upload/t_1500bred/v1731606845/Li_102332_zk7mww.jpg',
  ogImageAlt: 'Körsbärsbakgrund',
  // Optional
  ogImageWidth: 1500,
  ogImageHeight: 2250,
  ogImageType: 'image/jpeg',
  ogImageUrl:
    'https://res.cloudinary.com/dxwhmugdr/image/upload/t_1500bred/v1731606845/Li_102332_zk7mww.jpg',
  keywords: 'Lista, Lindersplantskola, Växter, ovanliga växter, bilder',
});

const runtimeConfig = useRuntimeConfig();
const enteredPassword = useCookie('enteredPassword', { maxAge: 60604800 });

const state = useGlobalState();

const isDark = useDark();
const toggleDark = useToggle(isDark);

const isSökOpen = ref(false);

// const { width, height } = useWindowSize()
const windowSize = useWidth();

const showMobileMenu = ref(false);

const client = useSupabaseClient();

const { data: plants } = await useAsyncData('plantor', async () => {
  const { data, error } = await client.from('lignosdatabasen').select();

  if (error) {
    console.log(error);
  }
  if (runtimeConfig.public.ADMIN_PASSWORD === enteredPassword.value) {
    // console.log(data);
    return data;
  } else {
    return data.filter((e) => e.hidden !== true);
  }
});

// -------------  Filtera bort null / mellanslag ---------------------
// const { error } = await client.from('lignosdatabasen').update({ art: '' }).eq('art', ' ').select()
// if (error) {
//   console.log(error);
// }
// const { error } = await client.from('lignosdatabasen').update({ sortnamn: '' }).eq('sortnamn', ' ').select()
// if (error) {
//   console.log(error);
// }
// const { error } = await client.from('lignosdatabasen').update({ svensktnamn: '' }).eq('svensktnamn', ' ').select()
// if (error) {
//   console.log(error);
// }

const slakteGen = () => {
  // Funktion för att generara en extra av varje släkte med artnamnet "slakte"

  let array = plants.value;

  let oneOfEverySlakte = [];

  for (let i = 0; i < array.length; i++) {
    if (oneOfEverySlakte.some((plant) => plant === array[i].slakte)) {
      console.log('already contains');
    } else {
      oneOfEverySlakte.push(array[i].slakte);
      console.log('added');
    }
  }

  // console.log(array);
  // console.log(oneOfEverySlakte);

  oneOfEverySlakte.forEach(async (plant) => {
    const { data, error } = await client
      .from('lignosdatabasen')
      .insert([
        {
          slakte: `${plant}`,
          art: `slakte`,
          text: `Ingen info`,
        },
      ])
      .select();
    if (error) {
      console.error(error);
    }
    if (data) {
      console.log(data);
    }
  });
};

const outsideNavRef = ref();

onClickOutside(outsideNavRef, () => {
  console.log('outside');
  showMobileMenu.value = false;
});

const sökInput = useTemplateRef('sökInput');
const openSök = async () => {
  isSökOpen.value = true;
  showMobileMenu.value = false;
  query.value = '';
  await nextTick();
  sökInput.value.focus();
};
const query = ref('');
const fullPlantList = ref([]);
const fetchList = async () => {
  const { data, error } = await client.from('lignosdatabasen').select();

  if (error) {
    console.error(error);
  }
  fullPlantList.value = data;
};
onMounted(async () => {
  await nextTick();
  fetchList();
});
const searchResult = computed(() => {
  let newList = fullPlantList.value;

  let queryArray = query.value.toLowerCase().split(' ');
  if (query.value) {
    // newList = newList.filter(e => e.text.toLowerCase().contains(searchQuery.value.toLowerCase()))
    newList = newList.filter((item) =>
      queryArray.every((str) =>
        `${item.slakte} ${item.art} ${item.sortnamn} ${item.svensktnamn} ${item.synonymer}`
          .toLowerCase()
          .includes(str)
      )
    );
  }

  newList = newList.filter((e) => e.text !== 'Ingen info');
  newList = newList.filter((e) => e.art !== 'slakte');
  newList = newList.filter((e) => e.hidden === false);

  newList = newList.sort((a, b) => a.sortnamn.localeCompare(b.sortnamn));
  newList = newList.sort((a, b) => a.art.localeCompare(b.art));
  newList = newList.sort((a, b) => a.slakte.localeCompare(b.slakte));

  return newList;
});
const sökContainer = ref();
onClickOutside(sökContainer, () => (isSökOpen.value = false));
</script>

<template>
  <Transition name="sök">
    <div class="sök-cover" v-if="isSökOpen">
      <div class="sök-container" ref="sökContainer">
        <div class="input-align">
          <input
            type="text"
            name=""
            id=""
            placeholder="Sök efter vetenskapligt eller svenskt namn"
            v-model="query"
            ref="sökInput"
          />
          <button @click="query ? (query = '') : (isSökOpen = false)">
            <Icon v-if="query" name="material-symbols:close-rounded" class="rensa-ikon" />
            <Icon v-else name="material-symbols:close-rounded" class="stäng-ikon" />
          </button>
        </div>
        <div class="expanded">
          <ul>
            <SearchCard v-for="plant in searchResult" :plant="plant" @close="isSökOpen = false" />
          </ul>
        </div>
      </div>
    </div>
  </Transition>

  <div class="site">
    <nav>
      <NuxtLink to="/" class="title">
        <img class="logo large light" src="/logga-text-ljus.svg" alt="" />
        <img class="logo large dark" src="/logga-text-mörk.svg" alt="" />
        <img class="logo small light" src="/logga-löv-ljus.svg" alt="" />
        <img class="logo small dark" src="/logga-löv-mörk.svg" alt="" />
        <!-- <h1>
          <Icon name="mdi:leaf-circle" />Lignosdatabasen
        </h1> -->
      </NuxtLink>
      <button v-if="windowSize.width < 700" class="hamburger-menu">
        <Icon
          @click="showMobileMenu = false"
          v-if="showMobileMenu"
          name="material-symbols:close-rounded"
        />
        <Icon @click="showMobileMenu = true" v-else name="ci:hamburger-md" />
      </button>

      <div class="nav-container">
        <div class="popup">
          <div
            ref="outsideNavRef"
            :class="{ 'large-nav': windowSize.width > 700, 'mobile-nav': windowSize.width < 700 }"
            v-if="showMobileMenu || windowSize.width > 700"
          >
            <ul class="link-align">
              <ArtBokstav :bokstav="'A'" :plants="plants" />
              <ArtBokstav :bokstav="'B'" :plants="plants" />
              <ArtBokstav :bokstav="'C'" :plants="plants" />
              <ArtBokstav :bokstav="'D'" :plants="plants" />
              <ArtBokstav :bokstav="'E'" :plants="plants" />
              <ArtBokstav :bokstav="'F'" :plants="plants" />
              <ArtBokstav :bokstav="'G'" :plants="plants" />
              <ArtBokstav :bokstav="'H'" :plants="plants" />
              <ArtBokstav :bokstav="'I'" :plants="plants" />
              <ArtBokstav :bokstav="'J'" :plants="plants" />
              <ArtBokstav :bokstav="'K'" :plants="plants" />
              <ArtBokstav :bokstav="'L'" :plants="plants" />
              <ArtBokstav :bokstav="'M'" :plants="plants" />
              <ArtBokstav :bokstav="'N'" :plants="plants" />
              <ArtBokstav :bokstav="'O'" :plants="plants" />
              <ArtBokstav :bokstav="'P'" :plants="plants" />
              <ArtBokstav :bokstav="'Q'" :plants="plants" />
              <ArtBokstav :bokstav="'R'" :plants="plants" />
              <ArtBokstav :bokstav="'S'" :plants="plants" />
              <ArtBokstav :bokstav="'T'" :plants="plants" />
              <ArtBokstav :bokstav="'U'" :plants="plants" />
              <ArtBokstav :bokstav="'V'" :plants="plants" />
              <ArtBokstav :bokstav="'W'" :plants="plants" />
              <!-- <ArtBokstav :bokstav="'X'" :plants="plants" /> -->
              <!-- <ArtBokstav :bokstav="'Y'" :plants="plants" /> -->
              <ArtBokstav :bokstav="'Z'" :plants="plants" />
              <button class="nav-search" @click="openSök()" v-if="windowSize.width < 700">
                <Icon name="material-symbols:search-rounded" />
              </button>

              <NuxtLink
                @click="showMobileMenu = false"
                class="alla-växter"
                to="/planta/"
                v-if="windowSize.width < 700"
              >
                <!-- <Icon name="mingcute:grid-fill" /> -->
                <Icon name="mingcute:grid-2-fill" />
                <!-- <Icon name="mingcute:grid-2-line" /> -->
                <!-- <Icon name="tabler:layout-grid" /> -->
              </NuxtLink>
            </ul>

            <div class="side">
              <ThemeToggle v-if="windowSize.width < 700" />
              <div
                class="account-icon"
                v-if="runtimeConfig.public.ADMIN_PASSWORD === enteredPassword"
              >
                <NuxtLink to="/admin">
                  <Icon name="ic:baseline-person" />
                </NuxtLink>
              </div>

              <div class="add-icon" v-if="runtimeConfig.public.ADMIN_PASSWORD === enteredPassword">
                <NuxtLink to="/ny">
                  <Icon name="material-symbols:add-rounded" />
                </NuxtLink>
              </div>
            </div>
          </div>
          <div id="popup-location"></div>
        </div>
      </div>

      <div class="big-nav-side">
        <button class="nav-search" @click="openSök()" v-if="windowSize.width > 700">
          <Icon name="material-symbols:search-rounded" />
        </button>

        <NuxtLink class="alla-växter" to="/planta/" v-if="windowSize.width > 700">
          <p>
            <Icon name="mingcute:grid-2-fill" />
            Alla växter
          </p>
          <Icon name="mingcute:grid-2-fill" />
        </NuxtLink>

        <ThemeToggle v-if="windowSize.width > 700" />
      </div>

      <!-- <nav v-if="showMobileMenu" class="mobile-menu" @click="showMobileMenu = false">
        <NuxtLink to="/">Startsidan</NuxtLink>
        <NuxtLink to="/data">Databas</NuxtLink>
        <NuxtLink to="/admin" class="account-icon" v-if="runtimeConfig.public.ADMIN_PASSWORD === enteredPassword">
          <Icon name="ic:baseline-person" />
        </NuxtLink>
      </nav> -->
    </nav>
    <NuxtPage />
    <!-- <button @click="slakteGen()">Generara släkte</button> -->
    <Footer />
  </div>
</template>

<style>
* {
  transition: all 200ms;
  box-sizing: border-box;
  /* font-family: 'Playpen Sans'; */
  /* font-family: Salsa; */
  font-family: var(--slab-font);
  /* font-weight: 900; */
  word-spacing: 1px;
  letter-spacing: 0.1px;
  /* font-family: Caveat; */
  /* font-family: Inter; */
  /* font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif, Helvetica, sans-serif; */
}

h1 {
  font-family: var(--title-font);

  font-weight: 900;
}

:root {
  --title-color-light: #000000;
  --title-color-dark: #fef6ec;

  --text-color-light: #4c392f;
  --text-color-dark: #eae0d4;

  --mute-text-light: #b0a99f;
  --mute-text-dark: #9a9087;

  --bg-color-light: #edebe6;
  --bg-color-dark: #181410;

  --element-bg-light: #dddad1;
  --element-bg-dark: #261f18;

  --element-top-bg-light: #dddad1;
  --element-top-bg-dark: #312a22;

  --border-color-dark: #312a22;
  /* --border-color-dark: #27272a; */
  --border-color-light: #ccc9c2;

  --primary-brown: #6b5e0a;
  --primary-green-dark: #8ac957;
  --primary-green-light: #76994e;

  --link-light: #0645ad;
  --link-dark: #75b4f8;
  /* --primary-green-light: #386641; */
  /* --primary-green-light: #447c4f; */
  --primary-red: #bc4749;

  /* --slab-font: 'Roboto', sans-serif; */
  /* --title-font: Kanit, 'Satoshi', 'times new roman', 'Inter', 'Roboto', sans-serif; */
}

html {
  --title-color: var(--title-color-light);

  --text-color: var(--text-color-light);

  --mute-text: var(--mute-text-light);

  --bg-color: var(--bg-color-light);

  --element-bg: var(--element-bg-light);

  --element-top-bg: var(--element-top-bg-light);

  --border-color: var(--border-color-light);

  --primary-green: var(--primary-green-light);

  --link: var(--link-light);
}

.dark {
  --title-color: var(--title-color-dark);

  --text-color: var(--text-color-dark);

  --mute-text: var(--mute-text-dark);

  --bg-color: var(--bg-color-dark);

  --element-bg: var(--element-bg-dark);

  --element-top-bg: var(--element-top-bg-dark);

  --border-color: var(--border-color-dark);

  --primary-green: var(--primary-green-dark);

  --link: var(--link-dark);
}

html {
  background: var(--bg-color);
  color: var(--text-color);
  overflow-x: hidden;
  font-family: 'Switzer', 'Roboto', sans-serif;
}

html.dark {
  background: var(--bg-color);
  color: var(--text-color);
}

html:has(#image-screen-cover) {
  overflow: clip;
}

body {
  margin: 0;
}

.site {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.page {
  min-height: 100vh;
}

@media screen and (min-width: 700px) {
  .page {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

img:not(.logo) {
  border-radius: 0.5rem;
  box-shadow: 0 0 20px 3px rgba(0, 0, 0, 0.025);
}

.dark img:not(.logo) {
  box-shadow: 0 0 20px 3px rgba(0, 0, 0, 0.5);
}

p {
  font-size: 1.1em;
}

a {
  color: var(--text-color);
}

h1 {
  font-weight: 800;
  letter-spacing: 0.02em;
}

h2 {
  font-weight: 600;
}

.muted {
  color: var(--mute-text);
}

.bold {
  font-weight: bold;
}

input,
button,
textarea,
.buttonlike {
  background: var(--element-bg);
  border: 1px solid transparent;
  padding: 0.75rem;
  color: var(--text-color);
  border-radius: 0.5rem;
  transition: all 150ms;
  /* font-size: 105%; */
  font-size: 0.95em;
  cursor: pointer;
}

input,
textarea {
  cursor: text;
}

.buttonlike {
  cursor: inherit;
}

input:hover,
input:focus,
input:active,
textarea:hover,
textarea:focus,
textarea:active {
  border-color: var(--primary-green);
  outline: none;
}

.dark input:hover,
.dark input:focus,
.dark input:active,
.dark textarea:hover,
.dark textarea:focus,
.dark textarea:active {
  border-color: var(--primary-green);
}

button:hover {
  /* border-color: var(--primary-brown); */
  opacity: 0.8;
}

.dark button:not(.theme-toggle):hover {
  border-color: var(--primary-green);
}

button.cta {
  background: var(--primary-green);
  color: var(--text-color-light);
}

::selection,
::-moz-selection {
  background: var(--primary-green);
  color: var(--text-color-light);
}

.dark ::selection,
.dark ::-moz-selection {
  color: var(--text-color-light);
}

:not(html) ::-webkit-scrollbar {
  width: 10px;
}

:not(html)::-webkit-scrollbar-track {
  background: transparent;
}

:not(html)::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 5px;
}

:not(html)::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.dark ::-webkit-scrollbar-thumb {
  background: #555;
  border-radius: 5px;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #888;
}

nav {
  position: sticky;
  top: 0;
  background: var(--bg-color);
  z-index: 4;
  width: 100%;
  /* flex-grow: 1; */
  display: grid;
  grid-template-columns: 20% 60% 20%;
  font-size: 1.4rem;
  padding: 0.5rem;
  border-bottom: 1px solid var(--border-color);
  height: fit-content;
}

nav * {
  transition: all 100ms;
}

@media screen and (max-width: 1200px) {
  nav {
    grid-template-columns: min-content auto min-content;
  }
}

@media screen and (max-width: 700px) {
  nav {
    grid-template-columns: 5fr 1fr;
    grid-template-rows: 1fr min-content;
    padding-left: 0;
    padding-right: 0;
  }

  .title {
    padding-left: 0.5rem;
  }

  nav button.hamburger-menu {
    margin-right: 0.5rem;
  }
}

nav .link-align {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-grow: 1;
  padding-left: 1rem;
  margin: auto;
  gap: 0.75rem 0;
}

@media screen and (min-width: 700px) {
  nav .link-align {
    padding-right: 1rem;
  }

  nav .link-align > li {
    width: 100%;
    text-align: center;
  }
}

nav .link-align > li {
}

@media screen and (min-width: 1000px) {
  nav .link-align {
    padding-left: 5rem;
    /* gap: 5rem; */
  }
}

.dark nav .link-align a:hover,
.dark .link-align .router-link-active {
  color: var(--primary-green);
  /* background: var(--element-bg); */
}

nav p {
  margin: 0;
}

nav h1 {
  margin: 0;
  justify-self: flex-start;
  color: var(--text-color);
  text-decoration: none;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 1em;
}

@media screen and (min-width: 900px) {
  nav h1 {
    font-size: 1.2em;
  }
}

nav h1 svg {
  font-size: 115%;
  color: var(--primary-green);
}

nav .title img.large {
  min-width: 16rem;
  /* width: 100%; */
  /* height: 5rem; */
  max-height: 2.1rem;
}
nav .title img.small {
  min-width: 2.1rem;
  /* width: 100%; */
  /* height: 5rem; */
  max-height: 2.1rem;
}

@media screen and (min-width: 700px) and (max-width: 1000px) {
  nav .title img.large {
    display: none;
  }
}
@media screen and (max-width: 700px) {
  nav .title img.small {
    display: none;
  }
}
@media screen and (min-width: 1001px) {
  nav .title img.small {
    display: none;
  }
}

.dark img.light {
  display: none;
}
html:not(.dark) img.dark {
  display: none;
}

nav .large-nav {
  display: flex;
  flex-grow: 1;
}

nav .account-icon,
nav .add-icon {
  margin: auto;
  color: var(--primary-green);
  line-height: 0;
  font-size: 1.4em;
}

nav .account-icon svg,
nav .add-icon svg {
  margin: auto;
  color: var(--primary-green);
}

@media screen and (min-width: 700px) {
  nav .add-icon {
    border-left: 2px solid var(--border-color);
    margin-left: 5px;
    padding-left: 5px;
  }
}

nav .hamburger-menu {
  color: var(--primary-brown);
  margin: auto 0 auto auto;
  padding: 0;
  background: none;
  border: none;
  display: grid;
  place-items: center;
  font-size: 1.25em;
}

.dark .hamburger-menu {
  color: var(--primary-green);
}

@media screen and (min-width: 700px) {
  nav .hamburger-menu {
    grid-column: 3/4;
  }
}

nav .theme-toggle {
  background: none;
  padding: 0;
  margin: auto 0.5rem auto auto;
}

@media screen and (min-width: 700px) {
  .nav-container {
    display: grid;
    place-items: center;
  }

  .nav-container .popup {
    width: 100%;
  }
}

nav .popup:has(.mobile-nav) {
  position: absolute;
  width: 100%;
  background: var(--bg-color);
}

nav .mobile-nav {
  border-top: 1px solid var(--border-color);
  margin-top: 0.5rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
  display: grid;
  grid-column: 1/3;
  grid-template-columns: auto min-content;
  width: 100%;
}

@media screen and (max-width: 700px) {
  nav .mobile-nav {
    /* grid-template-rows: 1fr 1fr; */
  }

  nav .mobile-nav .link-align {
    /* grid-row: 1/3; */
    flex-wrap: wrap;
    display: grid;
    grid-template-columns: repeat(13, 1fr);
    place-items: center start;
  }

  nav .mobile-nav .link-align li {
    width: fit-content;
    height: fit-content;
    opacity: 1;
  }

  nav .mobile-nav .link-align li p {
    width: fit-content;
    height: fit-content;
  }
}

@media screen and (max-width: 400px) {
  nav .mobile-nav .link-align {
    grid-template-columns: repeat(7, 1fr);
  }
}

nav .mobile-nav * {
  /* color: var(--text-color); */
  /* text-align: start; */
  text-decoration: none;
  margin: 0;
}

nav .side {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

@media screen and (max-width: 700px) {
  nav .side .theme-toggle {
    margin: 0;
  }

  nav .side {
    margin: 0 0.75rem;
    gap: 0.5rem;
  }
}

@media screen and (min-width: 700px) {
  nav .side {
    flex-direction: row;
  }
}

nav .theme-toggle svg.icon {
  display: block;
}

#popup-location {
  width: 100%;
  border-color: transparent;
  grid-column: 1/3;
}

#popup-location .dropdown {
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 0 1rem;
  gap: 0.2rem 0.5rem;
}

#popup-location:has(.dropdown) {
  /* margin-top: 0.5rem; */
  padding-top: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.big-nav-side {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: flex-end;
  gap: 0.5rem;
}

@media screen and (min-width: 1000px) {
  .big-nav-side {
    gap: 1.5rem;
  }
}

.big-nav-side .router-link-exact-active {
  color: var(--primary-green);
}

.big-nav-side .icon {
  font-size: 1.2em;
}

@media screen and (min-width: 1250px) {
  .alla-växter > .icon {
    display: none;
  }

  .alla-växter p {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    flex-direction: row;
    font-size: 1.3rem;
  }

  .alla-växter p .icon {
    font-size: 1.3em;
  }

  .alla-växter {
    transition: color 150ms ease-in-out;
  }

  .alla-växter:hover {
    /* background: var(--element-bg); */
    color: var(--primary-green);
  }
}

@media screen and (max-width: 1249px) {
  .alla-växter p {
    display: none;
  }
}

.alla-växter:has(.icon) {
  display: grid;
  place-items: center;
}

a.alla-växter.router-link-exact-active {
  color: var(--primary-green);
}

ul .alla-växter {
  width: fit-content;
  height: fit-content;
  font-size: 1.15em;
}

nav .icon:hover {
  /* background: var(--element-bg); */
  color: var(--primary-green);
}

.nav-search {
  padding: 0;
  background: none;
  border: none;
  height: 100%;
  /* display: grid; */
  place-items: center;
  /* margin-left: 1rem */
}

.nav-search .icon {
  height: 100%;
  font-size: 1.6rem;
}

.sök-cover {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  height: 100%;
  width: 100%;
  background: rgba(70, 70, 70, 0.4);
  z-index: 5;
  display: grid;
  place-items: center;
  padding: 0 1rem;
}

.dark .sök-cover {
  background: rgba(24, 20, 16, 0.4);
}

html:has(.sök-cover) {
  overflow: hidden;
}

.sök-enter-active,
.sök-leave-active {
  transition: all 0.3s ease;
}

.sök-enter-from {
  opacity: 0;
}

.sök-leave-to {
  opacity: 0;
}

.sök-container {
  margin-top: 1rem;
  background: var(--bg-color);
  border-radius: 1rem;
  box-shadow: 0 1px 40px 0px rgba(0, 0, 0, 0.4);
  /* width: 90vw; */
  width: 100%;
  max-width: 50rem;
  margin: 0;
}

.dark .sök-container {
  background: var(--element-bg);
}

.sök-container .input-align {
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: row;
  transition: max-width 300ms ease-in-out;
}

.sök-container:has(.expanded) {
  z-index: 3;
}

.sök-container * {
  background: none;
}

.sök-container input {
  margin-left: 0.25rem;
  text-align: left;
  background: none;
  flex-grow: 1;
  border: none;
  border-color: transparent;
  border-width: 0;
  border-radius: 0;
  font-size: 1.15em;
}

.sök-container input::placeholder {
  opacity: 0.6;
}

.sök-container input:hover,
.sök-container input:active,
.sök-container input:focus {
  border: none;
  border-width: 0;
  border-color: transparent;
}

.sök-container button:hover,
.sök-container button:active,
.sök-container button:focus {
  /* border: none; */
  /* border-width: 0; */
  border-color: transparent;
}

.sök-container button {
  display: grid;
  place-items: center;
  margin-right: 0.3rem;
}

.sök-container button:has(.icon) {
  padding: 0.5rem;
  font-size: 1.4rem;
}

.sök-container .expanded {
  width: 100%;
  height: 40rem;
  color: var(--text-color);
}

.sök-container .expanded ul {
  width: 100%;
  height: 100%;
  padding: 1rem 1rem 0;
  border-top: 1px solid var(--border-color);
  overflow: clip scroll;
}
</style>
