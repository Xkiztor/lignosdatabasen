<script setup>
const runtimeConfig = useRuntimeConfig();
const enteredPassword = useCookie('enteredPassword', { maxAge: 60604800 });


// const { planta } = useRoute().params

const router = useRoute()
console.log(router.params);

const isSlakte = ref(router.params.art === 'slakte')

console.log(isSlakte.value);

const client = useSupabaseClient()

const { data: plantsInSlakte } = await useAsyncData('plants-fetch', async () => {
  const { data, error } = await client.from('växt-databas').select().eq('slakte', `${router.params.slakte}`).neq('art', 'slakte')
  // const { data, error } = await client.from('växt-databas').select().eq('slakte', `${planta}`).single()
  if (error) {
    console.error(error);
  }
  return data
})

const sortedPlantsInSlakte = computed(() => {
  let newList = plantsInSlakte.value
  // console.log(plantsInSlakte.value);
  // newList = newList.sort((a, b) => a.sortnamn.localeCompare(b.sortnamn))
  newList = newList.sort((a, b) => a.art.localeCompare(b.art))
  // return newList
  return plantsInSlakte.value
})

// console.log(plantsInSlakte.value);
const { data: specificPlant } = await useAsyncData('plant-fetch', async () => {
  if (!isSlakte.value) {
    const { data, error } = await client.from('växt-databas').select().eq('slakte', `${router.params.slakte}`).eq('art', `${router.params.art}`).eq('sortnamn', `${router.params.sortnamn}`).single()
    // const { data, error } = await client.from('växt-databas').select().eq('slakte', `${router.params.slakte}`).eq('art', `${router.params.art}`).eq('sortnamn', `${router.params.sortnamn}`).single()
    // const { data, error } = await client.from('växt-databas').select().eq('slakte', `${router.params.slakte}`.eq('art', `${router.params.art}`).singe())
    // const { data, error } = await client.from('växt-databas').select().eq('slakte', `${planta}`).single()
    if (error) {
      console.error(error);
    }
    console.log(data);
    return data
  } else {
    const { data, error } = await client.from('växt-databas').select().eq('slakte', `${router.params.slakte}`).eq('art', `${router.params.art}`).single()

    if (error) { console.error(error) }

    // return data
    // if (data) {
    //   return data
    // } else {
    // return { slakte: router.params.slakte, art: router.params.slakte, sortnamn: router.params.sortnamn, text: 'Bra släkte' }
    // }
    return data ? data : { slakte: router.params.slakte, art: router.params.slakte, sortnamn: router.params.sortnamn, text: 'Ingen Info' }
  }

})




const isEditing = ref(false)

const editablePlant = reactive(specificPlant.value)

const editPlant = async () => {
  const { error } = await client.from('växt-databas').update({ ...editablePlant }).eq('id', `${editablePlant.id}`)
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

  const { error } = await client.from('växt-databas').delete().eq('id', `${specificPlant.value.id}`)
  if (error) {
    console.error(error)
  }
}

const showHide = ref(!specificPlant.value.hidden)

const hide = async () => {
  const { error } = await client.from('växt-databas').update({ hidden: 'TRUE' }).eq('id', `${specificPlant.value.id}`)
  if (error) {
    console.error(error)
  }
  showHide.value = false
}

const unHide = async () => {
  const { error } = await client.from('växt-databas').update({ hidden: 'FALSE' }).eq('id', `${specificPlant.value.id}`)
  if (error) {
    console.error(error)
  }
  showHide.value = true
}
</script>


<template>
  <div class="page plant">
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
    <div class="center-content">
      <div class="main-content" v-if="!isEditing">
        <header>
          <h1>{{ specificPlant.slakte }} {{ specificPlant.art === 'slakte' ? '' : specificPlant.art }} {{
            specificPlant.sortnamn ? `'${specificPlant.sortnamn}'` :
            '' }}</h1>
          <!-- <h1>{{ $route.params.slakte }} {{ $route.params.art === 'slakte' ? '' : $route.params.art }} {{
            $route.params.sortnamn ? `'${$route.params.sortnamn}'` :
            '' }}</h1> -->
          <h2 class="subtitle">{{ specificPlant.svensktnamn }}</h2>
        </header>
        <article>
          <RichText :plant="specificPlant" />
        </article>
        <!-- <h1>{{ plant.slakte }} {{ plant.art }} <v-if v-if="plant.sortnamn">'{{ plant.sortnamn }}'</v-if></h1> -->
        <!-- <p>{{ plant.text }}</p> -->
      </div>
      <div class="main-content edit" v-else>
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
            <h2>Text</h2>
            <textarea type="text" v-model="editablePlant.text" />
          </div>
          <div>
            <h2>Id</h2>
            <div class="buttonlike muted">{{ specificPlant.id }}</div>
          </div>
          <div>
            <div></div>
            <button class="bold" @click="editPlant()">Updatera</button>
          </div>
        </form>
        <div class="forhandsgranskning">
          <h1>Förhandsgranskning:</h1>
        </div>
        <header>
          <h1>{{ editablePlant.slakte }} {{ editablePlant.art === 'slakte' ? '' : editablePlant.art }} {{
            editablePlant.sortnamn ? `'${editablePlant.sortnamn}'` :
            '' }}</h1>
          <h2 class="subtitle">{{ editablePlant.svensktnamn }}</h2>
        </header>
        <article>
          <RichText :plant="editablePlant" />
        </article>
      </div>
      <div class="sidebar">
        <ul>
          <li class="slakte"><nuxt-link :to="`/planta/${$route.params.slakte}/slakte`">Släkte: {{ $route.params.slakte
          }}</nuxt-link></li>
          <li v-for="plant in sortedPlantsInSlakte">
            <nuxt-link v-if="!plant.hidden || runtimeConfig.public.ADMIN_PASSWORD === enteredPassword"
              :to="`/planta/${plant.slakte}/${plant.art}/${plant.sortnamn}`">
              {{ plant.slakte }} {{ plant.art }} {{ plant.sortnamn ? `'${plant.sortnamn}'` : '' }}{{ plant.hidden ? ` -
              ( Dåld växt )` : "" }}
            </nuxt-link>
          </li>
        </ul>
      </div>
    </div>

  </div>
</template>


<style>
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
  .sidebar {
    /* grid-row: 1; */
  }

  .center-content {
    /* text-align: center; */
    /* place-items: center; */
  }
}

.page.plant {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* max-width: 45rem; */
  /* margin: 0 auto; */
}

.page.plant h1 {
  font-size: 3rem;
  margin: 0;
  margin-top: 1rem;
}

.main-content header {
  margin-bottom: 2rem;
}

header h2.subtitle {
  font-size: 1.4em;
}

.sidebar {
  margin-top: 1rem;
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

.main-content article img {
  max-height: 25rem;
  max-width: 100%;
  margin: 0.5rem 0;
  object-fit: cover;
  /* width: 60ch; */
  display: inline;
  margin-right: 1rem;
}

.main-content article p {
  max-width: 60ch;
  line-height: 1.4;
  font-size: 1.2em;
}

.main-content article div:has(img) {
  display: inline;
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
  /* position: absolute; */
  right: 1rem;
  padding: 1rem 1rem 1rem 0;
  display: flex;
  gap: 1rem;
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






.main-content.edit .forhandsgranskning h1 {
  font-size: 2rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 1rem;
  margin-bottom: 4rem;
}

.main-content.edit form>div {
  display: grid;
  grid-template-columns: 1fr 4fr;
  margin-bottom: 1rem;
  place-items: center stretch;
}

.main-content.edit form>div textarea {
  min-height: 10rem;
  resize: vertical;
  transition: none;
}

.main-content.edit form>div button {
  margin-top: 1rem;
  margin-bottom: 3rem;
  /* grid-column: 1/3; */
}
</style>