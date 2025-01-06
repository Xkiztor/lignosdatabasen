<script setup>
const runtimeConfig = useRuntimeConfig();
const enteredPassword = useCookie('enteredPassword', { maxAge: 60604800 });
const client = useSupabaseClient();

const windowSize = useWidth();
// const { planta } = useRoute().params

const route = useRoute();
const router = useRouter();
// console.log(route.params);

const state = useGlobalState();

const isSlakte = ref(route.params.art === 'slakte');

// console.log(isSlakte.value);

const source = ref();
const { text, copy, copied, isSupported } = useClipboard({ source });

const { data: plantsInSlakte } = await useAsyncData('plants-fetch', async () => {
  const { data, error } = await client
    .from('lignosdatabasen')
    .select()
    .eq('slakte', `${route.params.slakte}`)
    .neq('art', 'slakte');
  // const { data, error } = await client.from('lignosdatabasen').select().eq('slakte', `${planta}`).single()
  if (error) {
    console.error(error);
  }
  let newList = data;
  newList = newList.sort((a, b) => a.sortnamn.localeCompare(b.sortnamn));
  newList = newList.sort((a, b) => a.art.localeCompare(b.art));

  if (runtimeConfig.public.ADMIN_PASSWORD === enteredPassword.value) {
    return newList;
  } else {
    // return data
    return newList.filter((e) => e.hidden !== true);
  }
});

// const sortedPlantsInSlakte = computed(() => {
//   let newList = plantsInSlakte.value
//   // console.log(plantsInSlakte.value);
//   // newList = newList.sort((a, b) => a.sortnamn.localeCompare(b.sortnamn))
//   newList = newList.sort((a, b) => a.sortnamn.localeCompare(b.sortnamn))
//   newList = newList.sort((a, b) => a.art.localeCompare(b.art))
//   // return newList
//   return plantsInSlakte.value
// })

// console.log(plantsInSlakte.value);
const { data: specificPlant } = await useAsyncData('specific-plant-fetch', async () => {
  // ? Inte släkte
  if (!isSlakte.value) {
    console.log('inte släkte');
    const { data, error } = await client
      .from('lignosdatabasen')
      .select()
      .eq('slakte', `${route.params.slakte}`)
      .eq('art', `${route.params.art === '-' ? '-' : route.params.art.replace(/\+/g, ' ')}`)
      .eq('sortnamn', `${route.params.sortnamn.replace(/\+/g, ' ')}`)
      .single();

    if (error) {
      console.error(error);
    }

    // If no data:
    if (
      error ||
      !data ||
      (data.hidden === true && runtimeConfig.public.ADMIN_PASSWORD !== enteredPassword.value)
    ) {
      return {
        slakte: route.params.slakte,
        art: route.params.art.replace(/\+/g, ' '),
        sortnamn: route.params.sortnamn.replace(/\+/g, ' ') + '- 404 - Existerar inte',
        text: 'Kontrollera adressen',
        hidden: true,
      };
    } else {
      state.currentPagePlant.value = data;
      console.log(state.currentPagePlant.value);

      return data;
    }

    // ? Släkte
  } else {
    console.log('släkte');
    const { data, error } = await client
      .from('lignosdatabasen')
      .select()
      .eq('slakte', `${route.params.slakte}`)
      .eq('art', `${route.params.art.replace(/\+/g, ' ')}`)
      .single();
    if (error) {
      console.error(error);
    }

    // If no data:
    if (data.hidden === true && runtimeConfig.public.ADMIN_PASSWORD !== enteredPassword.value) {
      return {
        slakte: route.params.slakte,
        art: route.params.art.replace(/\+/g, ' '),
        sortnamn: route.params.sortnamn.replace(/\+/g, ' ') + '- 404 - Existerar inte',
        text: 'Kontrollera adressen',
        hidden: true,
      };
      // return{ slakte: route.params.slakte, art: 'slakte', sortnamn: route.params.sortnamn, text: 'Ingen Info', hidden: true }
    } else if (error || !data) {
      return {
        slakte: route.params.slakte,
        art: 'slakte',
        sortnamn: route.params.sortnamn.replace(/\+/g, ' '),
        text: 'Ingen Info',
        hidden: false,
      };
    } else {
      state.currentPagePlant.value = data;
      return data;
    }
  }
});

const isEditing = ref(false);

const editablePlant = reactive(specificPlant.value);

const editPlant = async () => {
  editablePlant.ändrad = new Date().toISOString().replace('T', ' ').replace('Z', '+00');

  const { error } = await client
    .from('lignosdatabasen')
    .update({ ...editablePlant })
    .eq('id', `${editablePlant.id}`);
  if (error) {
    console.error(error);
  } else {
    isEditing.value = false;
  }
};

const showDeleteModel = ref(false);
const outsideClickTarget = ref(null);
onClickOutside(outsideClickTarget, () => {
  showDeleteModel.value = false;
});

const deletePlant = async () => {
  showDeleteModel.value = false;

  const { error } = await client
    .from('lignosdatabasen')
    .delete()
    .eq('id', `${specificPlant.value.id}`);
  if (error) {
    console.error(error);
  }
};

const showHide = ref(!specificPlant.value.hidden);

const hide = async () => {
  const { error } = await client
    .from('lignosdatabasen')
    .update({ hidden: 'TRUE' })
    .eq('id', `${specificPlant.value.id}`);
  if (error) {
    console.error(error);
  }
  showHide.value = false;
};

const unHide = async () => {
  const { error } = await client
    .from('lignosdatabasen')
    .update({ hidden: 'FALSE' })
    .eq('id', `${specificPlant.value.id}`);
  if (error) {
    console.error(error);
  }
  showHide.value = true;
};

const images = computed(() => {
  state.currentPageImages.value = specificPlant.value.text
    .split(/!\[(?!omslag\])[^]*?\]\(([^)]+)\)/g)
    .filter((str) => str !== '' && str.includes('http') && !str.includes('['));

  state.currentPageBildtexter.value = specificPlant.value.text
    .split(/(!\[[^\]]*\]\([^\)]+\)(?:\{[^}]+\})?)/)
    .filter((str) => str !== '' && str.includes('http') && str.includes('!['))
    .map((str) => str.match(/\{[^}]*text="([^"]+)"[^}]*\}/)?.[1] || '');

  return specificPlant.value.text
    .split(/!\[[^\]]*\]\(([^)]+)\)/g)
    .filter((str) => str !== '' && str.includes('http') && !str.includes('['));
});

const compressedUrl = computed(() => {
  // console.log(images.value == new Array ? 'true' : 'false');
  // console.log(images.value[0] === undefined);

  if (images.value[0] === undefined) {
    return '';
  } else {
    return images.value[0].replace('/upload/', '/upload/t_300bred/');
  }
});

const computedList = computed(() => {
  let newList = plantsInSlakte.value;

  newList = newList.filter((e) => e.text !== 'Ingen info');

  newList = newList.sort((a, b) => a.sortnamn.localeCompare(b.sortnamn));
  newList = newList.sort((a, b) => a.art.localeCompare(b.art));
  newList = newList.sort((a, b) => a.slakte.localeCompare(b.slakte));

  return newList;
});

useHead({
  // or as a function
  titleTemplate: () => {
    return `
    ${route.params.slakte}
    ${
      route.params.art === 'slakte'
        ? ' släkte'
        : route.params.art === '-'
        ? ''
        : ' ' + route.params.art.replace(/\+/g, ' ')
    }
    ${
      route.params.sortnamn.replace(/\+/g, ' ')
        ? " '" + route.params.sortnamn.replace(/\+/g, ' ') + "'"
        : ''
    } - Ligonsdatabasen`;
  },
  scripts: [
    {
      type: 'application/ld+json',
      innerHTML: {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: `${specificPlant.value.slakte} ${
          specificPlant.value.art === 'slakte'
            ? 'släkte'
            : specificPlant.value.art === '-'
            ? ''
            : specificPlant.value.art
        } ${specificPlant.value.sortnamn ? "'" + specificPlant.value.sortnamn + "'" : ''}`,
        author: 'Peter Linder',
        image: images.value,
      },
    },
  ],
});
useSeoMeta({
  description: specificPlant.value.ingress,
});

// ? Close / refresh
onMounted(() => {
  const handleBeforeUnload = (event) => {
    if (isEditing.value) {
      event.preventDefault();
      event.returnValue = ''; // Required for the dialog to show in modern browsers
    }
  };

  // Add event listener
  window.addEventListener('beforeunload', handleBeforeUnload);

  // Remove event listener on component unmount
  onBeforeUnmount(() => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  });
});
// ? Internal route change
onMounted(() => {
  // Add a global navigation guard
  const unregister = router.beforeEach((to, from, next) => {
    if (isEditing.value) {
      const confirmLeave = confirm('Du har osparade ändringar. Säker du vill lämna?');
      if (confirmLeave) {
        // isEditing.value = false; // Reset changes if confirmed
        next(); // Allow navigation
      } else {
        next(false); // Block navigation
      }
    } else {
      next(); // Allow navigation
    }
  });
  // Cleanup guard on component unmount
  onBeforeUnmount(() => unregister());
});

// const editor = ref(null);
// const container = ref(null);
// const view = ref();
// // const editorState = ref();
// const theme = (ref < 'light') | 'dark' | ('none' > 'light');
// // const extensions = [javascript(), lineNumbersRelative];

// import { useCodeMirror } from 'vue-codemirror';
// import { javascript } from '@codemirror/lang-javascript';

// const editorState = ref('// Write your code here');
// const { editor } = useCodeMirror({
//   value: editorState.value,
//   extensions: [javascript()],
//   onUpdate: (v) => {
//     editorState.value = v.state.doc.toString();
//   },
// });

// // onMounted(() => {
//   useNuxtCodeMirror({
//     ...props,
//     container: editor.value,
//     viewRef: view,
//     stateRef: state,
//     containerRef: container,
//   });
// });

import { Codemirror } from 'vue-codemirror';
// import 'codemirror/lib/codemirror.css';
// import 'codemirror/theme/material.css';
// import 'codemirror/mode/markdown/markdown';
import { markdown } from '@codemirror/lang-markdown';
import { oneDark } from '@codemirror/theme-one-dark';
const extensions = [markdown(), oneDark];
</script>

<template>
  <div class="page plant">
    <img class="backdrop" :src="compressedUrl" alt="" />
    <div class="confirm model delete" v-if="showDeleteModel">
      <div class="content" ref="outsideClickTarget">
        <h1>Är du säker?</h1>
        <div class="buttons">
          <button @click="showDeleteModel = false">Nej</button>
          <button class="cta" @click="deletePlant">Ja</button>
        </div>
      </div>
    </div>
    <div class="admin-panel" v-if="runtimeConfig.public.ADMIN_PASSWORD === enteredPassword">
      <button v-if="!isEditing" @click="isEditing = true">
        <Icon name="material-symbols:edit-outline-rounded" />Ändra
      </button>
      <button v-else @click="isEditing = false">
        <Icon name="material-symbols:cancel-outline-rounded" />Avbryt
      </button>
      <button @click="showDeleteModel = true" v-if="!isSlakte">
        <Icon name="material-symbols:delete-forever-outline-rounded" />Ta bort
      </button>
      <!-- <button @click="duplicate()">Dublicera</button> -->
      <button v-if="showHide === false" @click="unHide()" class="visa">
        <Icon name="zondicons:view-show" />Visa växt
      </button>
      <button v-else @click="hide()"><Icon name="zondicons:view-hide" />Dölj växt</button>
    </div>

    <!-- <div class="image-showcase" :style="{ gridTemplateColumns: `repeat(${plant.bilder.length}, 1fr)` }">
      <nuxt-img v-for="image in plant.bilder" :src="image" />
    </div> -->
    <header
      class="top-bar"
      :class="{
        'no-image': images[0] == undefined,
        'page-not-found': specificPlant.sortnamn.includes('404 - Existerar inte'),
      }"
    >
      <div class="content">
        <h1>
          {{ specificPlant.slakte }}
          {{ specificPlant.art === 'slakte' || specificPlant.art === '-' ? '' : specificPlant.art }}
          {{ specificPlant.sortnamn ? `'${specificPlant.sortnamn}'` : '' }}
        </h1>
        <!-- <h1>{{ $route.params.slakte }} {{ $route.params.art === 'slakte' ? '' : $route.params.art }} {{
            $route.params.sortnamn ? `'${$route.params.sortnamn}'` :
            '' }}</h1> -->
        <h2 class="subtitle fakta">
          <span v-if="specificPlant.höjd"
            ><span class="label">Höjd: </span> {{ specificPlant.höjd }} m</span
          >
          <span v-if="specificPlant.bredd"
            ><span class="label">Bredd: </span> {{ specificPlant.bredd }} m</span
          >
          <span v-if="specificPlant.zon"
            ><span class="label">Zon: </span> {{ specificPlant.zon }}</span
          >
          <span v-if="specificPlant.synonymer"
            ><span class="label">Synonymer: </span> {{ specificPlant.synonymer }}</span
          >
          <span v-if="specificPlant.synonymtill"
            ><span class="label">Synonym till: </span>
            <NuxtLink class="link" :to="specificPlant.synonymtill">{{
              specificPlant.synonymtill
                .replace(/planta\//g, '')
                .replace(/\+/g, ' ')
                .replace(/\//g, ' ')
            }}</NuxtLink></span
          >
        </h2>
        <h2 class="subtitle">{{ specificPlant.svensktnamn }}</h2>
        <PlantApi v-if="!isSlakte && !specificPlant.sortnamn" :plant="specificPlant" />
        <div class="finns-att-kopa">
          <!-- <KopaSuperlistan /> -->
        </div>
      </div>
      <img :src="compressedUrl" alt="" />
    </header>
    <Transition name="main">
      <div class="edit" v-if="isEditing">
        <form @submit.prevent="">
          <div>
            <h2>Släkte</h2>
            <input type="text" v-model="editablePlant.slakte" />
          </div>
          <div>
            <h2>Art</h2>
            <input type="text" v-model="editablePlant.art" />
          </div>
          <div>
            <h2>Sortnamn</h2>
            <input type="text" v-model="editablePlant.sortnamn" />
          </div>
          <div>
            <h2>Svenskt Namn</h2>
            <input type="text" v-model="editablePlant.svensktnamn" />
          </div>
          <div>
            <div class="three-column">
              <div>
                <h2>Höjd</h2>
                <input type="text" v-model="editablePlant.höjd" />
              </div>
              <div>
                <h2>Bredd</h2>
                <input type="text" v-model="editablePlant.bredd" />
              </div>
              <div>
                <h2>Zon</h2>
                <input type="text" v-model="editablePlant.zon" />
              </div>
            </div>
          </div>
          <div>
            <h2>Syn.</h2>
            <input type="text" v-model="editablePlant.synonymer" />
          </div>
          <div>
            <h2>
              Syn. till <br />(lokal länk) <br />
              /planta/Acer/griseum
            </h2>
            <input type="text" v-model="editablePlant.synonymtill" />
          </div>
          <div>
            <h2>Ingress <br />{{ editablePlant.ingress.length }} tecken. (150 max)</h2>
            <textarea class="y-size" type="text" v-model="editablePlant.ingress" />
          </div>
          <!-- <div class="text">
            <h2>Text</h2>
            <textarea class="y-size" type="text" v-model="editablePlant.text" />
          </div> -->
          <div>
            <!-- <NuxtCodeMirror
              ref="editor"
              v-model="editorState"
              style="width: 500px; height: 400px"
              :theme="theme"
              placeholder="Enter your code here..."
              :auto-focus="true"
              :editable="true"
              :basic-setup="true"
              :indent-with-tab="true"
            /> -->
            <h2>Text</h2>
            <Codemirror
              :style="{ width: '100%', overflowX: 'auto' }"
              v-model="editablePlant.text"
              :options="{
                // mode: 'markdown',
                // theme: 'material',

                lineNumbers: true,
                tabSize: 10,
                matchBrackets: true,
                autoCloseBrackets: true,
                styleActiveLine: true,
              }"
              :extensions="extensions"
            />
          </div>

          <div>
            <div></div>
            <div class="guide">
              <div>
                <p class="copy" @click="copy(`![](){text=&quot;Foto: Peter Linder&quot;}`)">
                  ![](){text="Foto: Peter Linder"}
                </p>
                <p><strong>Bild</strong></p>
                <p class="list">halv hel omslag kvadrat</p>
                <p class="list">Ej höger vänster vid fifty fifty</p>
              </div>
              <div>
                <p class="copy" @click="copy(`[]()`)">[]()</p>
                <p><strong>Länk</strong></p>
              </div>
              <div>
                <div class="copy" @click="copy(`::Fifty\n\n![halv]()\n\n<div>\n\n</div>\n::`)">
                  <p>::Fifty</p>
                  <p>![halv]()</p>
                  <p>&lt;div&gt;</p>
                  <p>&lt;/div&gt;</p>
                  <p>::</p>
                </div>
                <p><strong>Fifty fifty</strong></p>
                <p>Endast div om du har text</p>
                <p>Först = vänster</p>
              </div>
              <div>
                <div class="copy" @click="copy(`::Fifty\n\n![halv]()\n\n![halv]()\n\n::`)">
                  <p>::Fifty</p>
                  <p>![halv]()</p>
                  <p>![halv]()</p>
                  <p>::</p>
                </div>
                <p><strong>Fifty fifty</strong></p>
                <p>Två bilder</p>
              </div>
              <div>
                <div
                  class="copy"
                  @click="copy(`::Kolumner2{del=&quot;8020&quot;}\n\n<div>\n\n</div>\n\n::`)"
                >
                  <p>::Kolumner2{del=8020}</p>
                  <p></p>
                  <p>&lt;div&gt;</p>
                  <p>&lt;/div&gt;</p>
                  <p></p>
                  <p>::</p>
                </div>
                <p><strong>Uppdelning</strong></p>
                <p>2 kolumner</p>
              </div>
            </div>
          </div>
          <div>
            <div></div>
            <div>
              <p>&amp;quot&semi; = "</p>
            </div>
          </div>
          <div>
            <div></div>
            <button class="bold uppdatera" @click="editPlant()">Uppdatera</button>
          </div>
        </form>
        <article class="main-content">
          <p class="ingress">{{ specificPlant.ingress }}</p>
          <Markdown :plant="specificPlant" />
        </article>
      </div>
      <div class="center-content" v-else>
        <main>
          <article class="main-content">
            <h2 class="ingress" v-if="specificPlant.ingress">{{ specificPlant.ingress }}</h2>
            <Markdown :plant="specificPlant" />
          </article>

          <div
            class="grid-layout"
            v-if="(specificPlant.art === 'slakte' || false) && windowSize.width > 700"
          >
            <div v-if="specificPlant.text !== 'Ingen info'" class="line-spacer"></div>
            <h1
              v-if="
                (specificPlant.text !== 'Ingen info' &&
                  specificPlant.text !== 'Kontrollera adressen') ||
                computedList.length
              "
            >
              Växter i släktet:
            </h1>
            <SearchCard v-for="växt in computedList" :key="växt.id" :plant="växt" />
          </div>
        </main>
        <aside class="sidebar">
          <ul>
            <li class="slakte">
              <nuxt-link :to="`/planta/${$route.params.slakte}/slakte`"
                >Släkte: {{ $route.params.slakte }}</nuxt-link
              >
            </li>
            <li v-for="plant in plantsInSlakte" :class="{ muted: plant.text === 'Ingen info' }">
              <nuxt-link
                :to="`/planta/${plant.slakte}/${plant.art.replace(
                  / /g,
                  '+'
                )}/${plant.sortnamn.replace(/ /g, '+')}`"
              >
                {{ plant.slakte }} {{ plant.art === '-' ? '' : plant.art }}
                {{ plant.sortnamn ? `'${plant.sortnamn}'` : ''
                }}{{
                  plant.hidden
                    ? ` -
              ( Dold växt )`
                    : ''
                }}
              </nuxt-link>
            </li>
          </ul>
        </aside>
      </div>
    </Transition>
  </div>
</template>

<style>
.page.plant {
  padding: 0;
}

.page.plant {
  transition: all 200ms;
}

.center-content {
  max-width: 70rem;
  width: 100%;
  display: grid;
  gap: 0.5rem;
  flex-grow: 1;
  padding-top: 1rem;
  padding: 1rem 1rem 0;
}

@media screen and (min-width: 1000px) {
  .center-content {
    grid-template-columns: 70% 30%;
    gap: 3rem;
  }
}

@media screen and (max-width: 1000px) {
}

.page.plant {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* max-width: 45rem; */
  /* margin: 0 auto; */
}

.page.plant h1 {
  font-size: var(--font-h3);
  margin: 0;
  margin-top: 1rem;
}

header h2.subtitle {
  font-size: var(--font-2xl);
}

header .content h2.fakta {
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
  font-weight: 500;
  margin-top: 0.1rem;
  margin-bottom: 0.15rem;
  flex-wrap: wrap;
  height: fit-content;
}

@media screen and (max-width: 500px) {
  header .content h2.subtitle.fakta {
    flex-direction: column;
    gap: 0.2rem;
  }

  header .content h2.fakta > span::before {
    content: '•';
    margin-right: 0.5rem;
    color: var(--text);
  }
}

header .content h2.fakta .label {
  opacity: 0.9;
}

@media screen and (min-width: 700px) {
  .page.plant h1 {
    font-size: var(--font-h2);
  }

  .page.plant .main-content h1 {
    font-size: var(--font-4xl);
  }

  header h2.subtitle {
    font-size: var(--font-2xl);
  }
}

.page.plant header {
  margin-bottom: 0.5rem;
}

.page .top-bar {
  width: 100%;
  height: 15rem;
  overflow: hidden;
  position: relative;
  transition: height 250ms ease-in-out;
  /* border-radius: 1rem; */
}

.page .top-bar:has(.extra-fakta) {
  height: 20rem;
}

.page .top-bar img {
  width: 100%;
  object-fit: cover;
  height: 15rem;
  filter: blur(10px) brightness(80%);
  transform: scale(110%);
  transition: height 250ms ease-in-out;
}

.page .top-bar:has(.extra-fakta) img {
  height: 20rem;
}

.page .top-bar .content {
  padding: 0 1rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  width: 100%;
  max-width: 70rem;
  margin: 0 auto;
  display: grid;
  color: #fff;
}

@media screen and (min-width: 800px) {
  .page .top-bar .content {
    grid-template-columns: 2fr 1fr;
  }
  .page .top-bar .content:not(:has(.superlistan)) h1 {
    grid-column: 1/3;
    grid-row: 1;
  }

  .content .finns-att-kopa {
    grid-column: 2/3;
    grid-row: 1/6;
  }
}

.content .finns-att-kopa {
  margin-top: 0.5rem;
}

@media screen and (max-width: 800px) {
  .content .finns-att-kopa {
    margin-top: 1rem;
  }
  .page .top-bar:has(.superlistan),
  .page .top-bar:has(.superlistan) img {
    height: 20rem;
  }
}

/* .page .top-bar .content > h2, */
.page .top-bar .content > h1 {
  margin: 0;
}

.page .top-bar:not(.no-image) .content * {
  text-shadow: 0 0 13px rgba(0, 0, 0, 0.5);
}

.page .top-bar {
  background: var(--primary-green-light);
}
.page .top-bar.page-not-found {
  background: var(--primary-red);
}

.sidebar {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 1rem;
  border-left: 1px solid var(--border-color);
  height: fit-content;
  width: fit-content;
  max-width: 100%;
}

.sidebar .slakte * {
  font-weight: bold;
  font-size: 1.1em;
  /* font-style: italic; */
}
.sidebar .slakte {
  /* font-weight: bold; */
  /* margin-bottom: 0.3rem; */
}

.sidebar ul > li {
  margin-bottom: 0.3rem;
  width: fit-content;
}

.sidebar ul {
  width: fit-content;
}

.sidebar li:hover {
  /* translate: 7px 0; */
  margin-left: 0.5rem;
}

html:not(.dark) .sidebar li a.router-link-active {
  text-decoration: underline;
}

.sidebar .router-link-active {
  color: var(--mute-text);
}

@media screen and (min-width: 700px) {
  .sidebar .router-link-active {
    color: var(--primary-green);
  }
}

@media screen and (max-width: 700px) {
  .sidebar {
    margin-top: 1rem;
  }
}

.sidebar li.muted * {
  opacity: 0.5;
}

article.main-content .article-image {
  /* max-height: 35rem; */
  max-width: 100%;
  margin: 0.5rem 0;
  object-fit: cover;
  /* width: 60ch; */
  display: inline;
  margin-right: 1rem;
  cursor: pointer;
}

article.main-content p {
  max-width: 70ch;
  line-height: 1.4;
}
article.main-content h1 {
  font-size: var(--font-h1);
}
article.main-content h2:not(.ingress) {
  font-size: var(--font-h3);
  font-weight: 700;
}

.center-content main,
.center-content main *,
.center-content .grid-layout {
  /* font-size: 1.15rem; */
}

.center-content main {
  max-width: 70ch;
}

.plant .image-showcase {
  display: grid;
  /* grid-template-columns: repeat(2, 1fr); */
  gap: 2rem;
}

.plant .image-showcase img {
  width: 100%;
  height: 20rem;
  object-fit: cover;
  border-radius: 0.5rem;
}

.page.plant .admin-panel {
  z-index: 2;
  /* top: 3rem; */
  right: 0;
  padding: 1rem 1rem 1rem 0;
  display: flex;
  gap: 1rem;
}

@media screen and (min-width: 700px) {
  .page.plant .admin-panel {
    position: absolute;
  }
}

.page.plant .admin-panel button:has(svg) {
  text-align: center;
  display: grid;
  grid-template-columns: auto auto;
  place-items: center;
  gap: 0.25rem;
}

@media screen and (min-width: 1000px) {
  .page.plant .admin-panel {
    align-self: flex-end;
  }
}

.admin-panel .visa {
  color: var(--primary-red);
}

.model {
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  display: grid;
  place-items: center;
}

.model.confirm .content {
  background: var(--bg-color);
  /* border: 1px solid var(--border-color); */
  padding: 5rem;
  border-radius: 1rem;
}

.model.confirm .content .buttons {
  margin-top: 1rem;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.model .buttons button {
  /* font-size: 1.2rem; */
  width: 4em;
}

img.backdrop {
  position: absolute;
  z-index: -2;
  width: 90%;
  height: 60%;
  object-fit: cover;
  filter: blur(100px);
  opacity: 0;
}

.dark img.backdrop {
  opacity: 0.1;
}

@media screen and (min-width: 1450px) {
  .plant .edit {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding-top: 1rem;
    padding-left: 1rem;
  }
}

.plant .edit article {
  max-width: 77ch;
  margin: 0 auto;
}

.plant .edit form {
  max-width: 100ch;
}

.plant .edit .uppdatera {
  background: var(--primary-green-light);
  color: var(--text-color-light);
  /* border: 1px solid var(--primary-green); */
}

.plant .edit .forhandsgranskning h1 {
  font-size: 2rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 1rem;
  margin-bottom: 0.5rem;
}

.plant .edit form > div {
  display: grid;
  grid-template-columns: 1fr 7fr;
  gap: 1rem;
  margin-bottom: 1rem;
  place-items: center stretch;
}

.plant .edit form > div.text textarea {
  min-height: 30rem;
}

.plant .edit form .y-size {
  min-height: 7rem;
  resize: vertical;
  transition: none;
}

.plant .edit form > div button {
  margin-top: 1rem;
  margin-bottom: 3rem;
  /* grid-column: 1/3; */
}

.plant .edit .three-column {
  grid-column: 2/3;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
  place-items: center;
}

.plant .edit .three-column > div {
  text-align: center;
}

.plant .edit .three-column input {
  width: 100%;
  margin-top: 0.3rem;
}

.edit .guide {
  display: flex;
  justify-content: space-between;
  /* display: grid; */
  /* grid-template-columns: 1fr 1fr 1fr; */
  gap: 1rem;
}

.edit .guide > div {
  display: flex;
  gap: 0.5rem;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.edit .guide .copy {
  text-align: start;
  padding: 0.5rem;
  background: var(--element-bg);
  border-radius: 0.5rem;
}

.edit .cm-editor {
  border-radius: 1rem;
  background: var(--element-bg);
  color: var(--text);
}

.edit .cm-editor,
.edit .cm-editor * {
  transition: none;
}

.ͼ1 .cm-scroller {
  padding-bottom: 1rem;
}

.edit .cm-gutters {
  background: var(--element-bg);
  color: var(--mute-text);
}

.edit .cm-activeLineGutter {
  background: var(--element-top-bg);
}

.edit .ͼ10.ͼv {
  color: var(--link);
  opacity: 0.6;
}
.edit .ͼ10.ͼ13 {
  color: #118f00;
}
.dark .edit .ͼ10.ͼ13 {
  color: var(--primary-green);
}

.edit .ͼ10 {
  color: var(--primary-green-light);
}

.ͼo.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground,
.ͼo .cm-selectionBackground,
.ͼo .cm-content ::selection {
  background: var(--primary-green-light);
}

.edit .ͼu {
  color: #ca8a00;
}

.edit .ͼ11 {
  font-size: var(--font-h3);
}

.main-content .ingress {
  font-weight: bold;
  margin-bottom: 1rem;
  /* font-size: 1.1em; */
}

.center-content .grid-layout {
  /* font-size: 1.15rem; */

  /* max-width: 70ch; */
  /* grid-template-columns: 1fr; */
  /* gap: 2rem; */
}

/* @media screen and (min-width: 700px) {
  .center-content .grid-layout {
    padding-right: 1rem;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .center-content .grid-layout h1 {
    grid-column: 1/3;
    font-size: 2.5rem;
  }

  .center-content .grid-layout .card {
    margin-bottom: 1rem;
  }

  .center-content .grid-layout .line-spacer {
    grid-column: 1/3;
  }
}

.center-content .grid-layout .card {
  padding: 0;
  font-size: 1.05rem;
}

.dark .center-content .grid-layout .card {
  background: none;
  box-shadow: none;
} */

.center-content .grid-layout h1 {
  margin: 1.5rem 0 1.5rem;
  line-height: 1;
  /* font-size: 2.25rem; */
  font-size: var(--font-h3);
}

.center-content .grid-layout .line-spacer {
  margin-top: 1.5rem;
  margin-bottom: calc(1.5rem - 1rem);
  width: 100%;
  border-top: 1px solid var(--border-color);
}

.edit-enter-active,
.edit-leave-active {
  transition: all 5s ease;
}

.edit-enter-from {
  opacity: 0;
  transform: translate(0, -100vh);
}

.edit-leave-to {
  opacity: 0;
  transform: translate(0, 100vh);
}

.main-enter-active,
.main-leave-active {
  transition: all 0.4s ease;
  /* position: absolute; */
  z-index: -1;
  /* max-width: 90ch; */
}

.main-enter-from {
  opacity: 0;
  transform: translate(-100vh, 0);
  /* scale: 90%; */
}

.main-leave-to {
  opacity: 0;
  transform: translate(100vh, 0);
  /* scale: 90%; */
}
</style>
