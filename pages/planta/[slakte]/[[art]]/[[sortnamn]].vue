<script setup>
const runtimeConfig = useRuntimeConfig();
const enteredPassword = useCookie('enteredPassword', { maxAge: 60604800 });
const client = useSupabaseClient()

const windowSize = useWidth()
// const { planta } = useRoute().params

const route = useRoute()
const router = useRouter()
console.log(route.params);

const state = useGlobalState()

const isSlakte = ref(route.params.art === 'slakte')

console.log(isSlakte.value);


const { data: plantsInSlakte } = await useAsyncData('plants-fetch', async () => {
  const { data, error } = await client.from('lignosdatabasen').select().eq('slakte', `${route.params.slakte}`).neq('art', 'slakte')
  // const { data, error } = await client.from('lignosdatabasen').select().eq('slakte', `${planta}`).single()
  if (error) {
    console.error(error);
  }
  let newList = data
  newList = newList.sort((a, b) => a.sortnamn.localeCompare(b.sortnamn))
  newList = newList.sort((a, b) => a.art.localeCompare(b.art))

  if (runtimeConfig.public.ADMIN_PASSWORD === enteredPassword.value) {
    return newList
  } else {
    // return data
    return newList.filter(e => e.hidden !== true)
  }
})

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
      .eq('art', `${route.params.art === '-' ? '-' : route.params.art}`)
      .eq('sortnamn', `${route.params.sortnamn}`)
      .single()

    if (error) {
      console.error(error);
    }
    
    // If no data:
    if (error || !data) {
      return { slakte: route.params.slakte, art: route.params.art, sortnamn: route.params.sortnamn + '- 404 - Existerar inte', text: 'Kontrollera adressen', hidden: false }
    } else {
      return data
    }


    // ? Släkte
  } else {
    console.log('släkte');
    const { data, error } = await client.from('lignosdatabasen').select().eq('slakte', `${route.params.slakte}`).eq('art', `${route.params.art}`).single()
    if (error) { console.error(error) }

    // If no data:
    return data ? data : { slakte: route.params.slakte, art: 'slakte', sortnamn: route.params.sortnamn, text: 'Ingen Info', hidden: false }
  }

})




const isEditing = ref(false)

const editablePlant = reactive(specificPlant.value)

const editPlant = async () => {
  const { error } = await client.from('lignosdatabasen').update({ ...editablePlant }).eq('id', `${editablePlant.id}`)
  if (error) {
    console.error(error)
  } else {
    isEditing.value = false
  }
}

const showDeleteModel = ref(false)
const outsideClickTarget = ref(null)
onClickOutside(outsideClickTarget, () => {
  showDeleteModel.value = false
})

const deletePlant = async () => {
  showDeleteModel.value = false

  const { error } = await client.from('lignosdatabasen').delete().eq('id', `${specificPlant.value.id}`)
  if (error) {
    console.error(error)
  }
}

const showHide = ref(!specificPlant.value.hidden)

const hide = async () => {
  const { error } = await client.from('lignosdatabasen').update({ hidden: 'TRUE' }).eq('id', `${specificPlant.value.id}`)
  if (error) {
    console.error(error)
  }
  showHide.value = false
}

const unHide = async () => {
  const { error } = await client.from('lignosdatabasen').update({ hidden: 'FALSE' }).eq('id', `${specificPlant.value.id}`)
  if (error) {
    console.error(error)
  }
  showHide.value = true
}


const images = computed(() => {
  state.currentPageImages.value = specificPlant.value.text.split(/!\[(?!omslag\])[^]*?\]\(([^)]+)\)/g).filter(str => str !== '' && str.includes('http') && !str.includes('['))
  return specificPlant.value.text.split(/!\[[^\]]*\]\(([^)]+)\)/g).filter(str => str !== '' && str.includes('http') && !str.includes('['))
})

const compressedUrl = computed(() => {
  // console.log(images.value == new Array ? 'true' : 'false');
  // console.log(images.value[0] === undefined);

  if (images.value[0] === undefined) {
    return ''
  } else {
    return images.value[0].replace('/upload/', '/upload/t_300bred/')
  }
})

const computedList = computed(() => {
  let newList = plantsInSlakte.value

  newList = newList.filter(e => e.text !== 'Ingen info')

  newList = newList.sort((a, b) => a.sortnamn.localeCompare(b.sortnamn))
  newList = newList.sort((a, b) => a.art.localeCompare(b.art))
  newList = newList.sort((a, b) => a.slakte.localeCompare(b.slakte))



  return newList
})

useHead({
  // or as a function
  titleTemplate: () => {
    return `
    ${route.params.slakte}
    ${route.params.art === 'slakte' ? ' släkte' : (route.params.art === '-' ? '' : ' ' + route.params.art)}
    ${route.params.sortnamn ? " '" + route.params.sortnamn + "'" : ''}`
  },
  scripts: [
    {
      type: 'application/ld+json',
      innerHTML: {
        '@context': 'https://schema.org',
        '@type': 'Article',
        'headline': `${specificPlant.value.slakte} ${specificPlant.value.art === 'slakte' ? 'släkte' : (specificPlant.value.art === '-' ? '' : specificPlant.value.art)} ${specificPlant.value.sortnamn ? "'" + specificPlant.value.sortnamn + "'" : ''}`,
        'author': 'Peter Linder',
        "image": images.value
      }
    }
  ],
})

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
</script>


<template>
  <div class="page plant">
    <img class="backdrop" :src="compressedUrl" alt="">
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
      <button v-if="showHide === false" @click="unHide()">
        <Icon name="zondicons:view-show" />Visa växt
      </button>
      <button v-else @click="hide()">
        <Icon name="zondicons:view-hide" />Dölj växt
      </button>
    </div>

    <!-- <div class="image-showcase" :style="{ gridTemplateColumns: `repeat(${plant.bilder.length}, 1fr)` }">
      <nuxt-img v-for="image in plant.bilder" :src="image" />
    </div> -->
    <header class="top-bar" :class="{ 'no-image': images[0] == undefined }">
      <div class="content">
        <h1>{{ specificPlant.slakte }} {{ specificPlant.art === 'slakte' || specificPlant.art === '-' ? '' :
          specificPlant.art }} {{
            specificPlant.sortnamn ? `'${specificPlant.sortnamn}'` :
              '' }}</h1>
        <!-- <h1>{{ $route.params.slakte }} {{ $route.params.art === 'slakte' ? '' : $route.params.art }} {{
            $route.params.sortnamn ? `'${$route.params.sortnamn}'` :
            '' }}</h1> -->
        <h2 class="subtitle fakta">
          <span v-if="specificPlant.höjd">Höjd: {{ specificPlant.höjd }} m</span>
          <span v-if="specificPlant.bredd">Bredd: {{ specificPlant.bredd }} m</span>
          <span v-if="specificPlant.zon">Zon: {{ specificPlant.zon }}</span>
          <span v-if="specificPlant.synonymer">Synonymer: {{ specificPlant.synonymer }}</span>
        </h2>
        <h2 class="subtitle">{{ specificPlant.svensktnamn }}</h2>
      </div>
      <img :src="compressedUrl" alt="">
    </header>
    <div class="center-content">
      <main>
        <Transition name="main">

          <article class="main-content edit" v-if="isEditing">
            <form @submit.prevent="">
              <div>
                <h2>Släkte</h2>
                <input type="text" v-model="editablePlant.slakte">
              </div>
              <div>
                <h2>Art</h2>
                <input type="text" v-model="editablePlant.art">
              </div>
              <div>
                <h2>Sortnamn</h2>
                <input type="text" v-model="editablePlant.sortnamn">
              </div>
              <div>
                <h2>Svenskt Namn</h2>
                <input type="text" v-model="editablePlant.svensktnamn">
              </div>
              <div>
                <div class="three-column">
                  <div>
                    <h2>Höjd</h2>
                    <input type="text" v-model="editablePlant.höjd">
                  </div>
                  <div>
                    <h2>Bredd</h2>
                    <input type="text" v-model="editablePlant.bredd">
                  </div>
                  <div>
                    <h2>Zon</h2>
                    <input type="text" v-model="editablePlant.zon">
                  </div>
                </div>
              </div>
              <div>
                <h2>Syn.</h2>
                <input type="text" v-model="editablePlant.synonymer">
              </div>
              <div>
                <h2>Syn. till <br>(lokal länk)</h2>
                <input type="text" v-model="editablePlant.synonymtill">
              </div>
              <div>
                <h2>Ingress <br>{{ editablePlant.ingress.length }} tecken. (150 max)</h2>
                <textarea class="y-size" type="text" v-model="editablePlant.ingress" />
              </div>
              <div class="text">
                <h2>Text</h2>
                <textarea class="y-size" type="text" v-model="editablePlant.text" />
              </div>
              <div>
                <div></div>
                <p>Bild: ![halv hel vänster höger omslag](länk) ![]()</p>
              </div>
              <div>
                <div></div>
                <p>Länk: [här är texten som ska stå](länk) []()</p>
              </div>
              <div>
                <div></div>
                <button class="bold" @click="editPlant()">Updatera</button>
              </div>
            </form>
            <div class="forhandsgranskning">
              <h1>Förhandsgranskning:</h1>
            </div>
            <p class="ingress">{{ specificPlant.ingress }}</p>
            <Markdown :plant="specificPlant" />
          </article>

          <article class="main-content" v-else>
            <p class="ingress" v-if="specificPlant.ingress">{{ specificPlant.ingress }}</p>
            <Markdown :plant="specificPlant" />
          </article>
        </Transition>


        <div class="grid-layout" v-if="(specificPlant.art === 'slakte' || false) && windowSize.width > 700">
          <div v-if="specificPlant.text !== 'Ingen info'" class="line-spacer"></div>
          <h1 v-if="specificPlant.text !== 'Ingen info'">Växter i släktet:</h1>
          <SearchCard v-for="växt in computedList" :key="växt.id" :plant="växt" />
        </div>


      </main>
      <aside class="sidebar">

        <ul>
          <li class="slakte"><nuxt-link :to="`/planta/${$route.params.slakte}/slakte`">Släkte: {{ $route.params.slakte
              }}</nuxt-link></li>
          <li v-for="plant in plantsInSlakte" :class="{ 'muted': plant.text === 'Ingen info' }">
            <nuxt-link :to="`/planta/${plant.slakte}/${plant.art}/${plant.sortnamn}`">
              {{ plant.slakte }} {{ plant.art === '-' ? '' : plant.art }} {{ plant.sortnamn ? `'${plant.sortnamn}'` : ''
              }}{{ plant.hidden ? ` -
              ( Dold växt )` : "" }}
            </nuxt-link>
          </li>
        </ul>

      </aside>
    </div>
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

@media screen and (max-width: 1000px) {}

.page.plant {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* max-width: 45rem; */
  /* margin: 0 auto; */
}

.page.plant h1 {
  font-size: 2rem;
  margin: 0;
  margin-top: 1rem;
}

header h2.subtitle {
  font-size: 1.2em;
}

header .content h2.subtitle.fakta {
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
  font-weight: 500;
  margin-top: 0.1rem;
  margin-bottom: 0.15rem;
}

@media screen and (min-width: 700px) {
  .page.plant h1 {
    font-size: 3rem;
  }

  .page.plant .main-content h1 {
    font-size: 2.5rem;
  }

  header h2.subtitle {
    font-size: 1.4rem;
  }
}

.page.plant header {
  margin-bottom: .5rem;
}



.page .top-bar {
  width: 100%;
  height: 12rem;
  overflow: hidden;
  position: relative;
  /* border-radius: 1rem; */
}

.page .top-bar img {
  width: 100%;
  object-fit: cover;
  height: 12rem;
  filter: blur(10px) brightness(80%);
  transform: scale(110%);
}

.page .top-bar .content {
  padding-left: 1rem;
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

.page .top-bar .content * {
  margin: 0;
}

.page .top-bar:not(.no-image) .content * {
  text-shadow: 0 0 13px rgba(0, 0, 0, 0.5);
}

.page .top-bar {
  background: var(--primary-green-light);
}












.sidebar {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 1rem;
  border-left: 1px solid var(--border-color);
  height: fit-content;
}

.sidebar .slakte {
  font-weight: bold;
}

.sidebar ul>li {
  margin-bottom: 0.2rem;
}

.sidebar li:hover {
  translate: 7px 0;
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
  max-height: 35rem;
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

.center-content main,
.center-content main *,
.center-content .grid-layout {
  font-size: 1.15rem;
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
  z-index: 1;
  right: 1rem;
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
  font-size: 1.2rem;
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





.main-content.edit .forhandsgranskning h1 {
  font-size: 2rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 1rem;
  margin-bottom: 0.5rem;
}

.main-content.edit form>div {
  display: grid;
  grid-template-columns: 1fr 7fr;
  gap: 1rem;
  margin-bottom: 1rem;
  place-items: center stretch;
}

.main-content.edit form>div.text textarea {
  min-height: 20rem;
}

.main-content.edit form .y-size {
  min-height: 7rem;
  resize: vertical;
  transition: none;
}

.main-content.edit form>div button {
  margin-top: 1rem;
  margin-bottom: 3rem;
  /* grid-column: 1/3; */
}

.main-content.edit .three-column {
  grid-column: 2/3;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
  place-items: center;
}

.main-content.edit .three-column>div {
  text-align: center;
}

.main-content.edit .three-column input {
  width: 100%;
  margin-top: 0.3rem;
}



.main-content .ingress {
  font-weight: bold;
  margin-bottom: 1rem;
  font-size: 1.1em;
}





.center-content .grid-layout {
  font-size: 1.15rem;

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
  margin: 1rem 0;
  line-height: 1;
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
  position: absolute;
  z-index: -1;
  max-width: 90ch;
}

.main-enter-from {
  opacity: 0;
  transform: translate(-50vh, 0);
  scale: 90%;
}

.main-leave-to {
  opacity: 0;
  transform: translate(50vh, 0);
  scale: 90%;
}
</style>