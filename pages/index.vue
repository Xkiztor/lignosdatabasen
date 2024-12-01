<script setup>
const client = useSupabaseClient()

const smallImg = 'https://res.cloudinary.com/dxwhmugdr/image/upload/t_1000bred/v1731606845/Li_102332_zk7mww.jpg'
const bigImg = 'https://res.cloudinary.com/dxwhmugdr/image/upload/t_2000bred/v1731606845/Li_102332_zk7mww.jpg'

const windowSize = useWidth()

const query = ref('')

const fullPlantList = ref([])

const fetchList = async () => {
  const { data, error } = await client
    .from('lignosdatabasen')
    .select()

  if (error) {
    console.error(error);
  }
  fullPlantList.value = data
}

onMounted(async () => {
  await nextTick()
  fetchList()
})

const searchResult = computed(() => {
  let newList = fullPlantList.value

  let queryArray = query.value.toLowerCase().split(" ")
  if (query.value) {
    // newList = newList.filter(e => e.text.toLowerCase().contains(searchQuery.value.toLowerCase()))
    newList = newList.filter(item => queryArray.every(str => `${item.slakte} ${item.art} ${item.sortnamn}  ${item.svensktnamn}`.toLowerCase().includes(str)))
  }

  newList = newList.filter(e => e.text !== 'Ingen info')
  newList = newList.filter(e => e.art !== 'slakte')
  newList = newList.filter(e => e.hidden === false)

  newList = newList.sort((a, b) => a.sortnamn.localeCompare(b.sortnamn))
  newList = newList.sort((a, b) => a.art.localeCompare(b.art))
  newList = newList.sort((a, b) => a.slakte.localeCompare(b.slakte))

  return newList
})
</script>


<template>
  <div class="page index" ref="page">
    <header>
      <div>
        <div class="image-align small">
          <img class="hero-image" :src="windowSize.width > 700 ? bigImg : smallImg" alt="">
          <div class="fade"></div>
          <!-- <img class="index-backdrop"
            src="https://res.cloudinary.com/dxwhmugdr/image/upload/t_300bred/v1731606845/Li_102332_zk7mww.jpg" alt=""> -->
        </div>
        <div class="color-fill-up"></div>
        <div class="content">
          <h1 class="lignos">Lignos</h1>
          <h1 class="databas">Databasen</h1>
          <h1 class="lignos-databas">Lignosdatabasen</h1>
          <p>Samlad informationskälla om lignoser</p>

          <div class="sök">
            <input type="text" name="" id="" placeholder="Sök" v-model="query">
            <button @click="query = ''">
              <Icon v-if="query" name="material-symbols:close-rounded" class="stäng-ikon" />
              <Icon v-else name="material-symbols:search-rounded" class="sök-ikon" />
            </button>
            <Transition name="expand">
              <div class="expanded" v-if="query">
                <ul>
                  <SearchCard v-for="plant in searchResult" :plant="plant" />
                </ul>
              </div>
            </Transition>
          </div>

        </div>
      </div>
      <Icon class="dots" name="mdi:dots-horizontal" />
    </header>

    <section class="about">
      <article class="text">
        <p class="välkommen">
          Välkommen till Lignosdatabasen! 
        </p>
        <p>
          Här kan du läsa om vedartade växter, dvs. träd, buskar och klätterväxter.
          Urvalet siktar på allt som är som är härdigt att odla utomhus i Sverige men även en del som är på gränsen men
          som kan klara t.ex. innergårdar i städerna eller kallväxthus.
        </p>
        <p>
          Många bra foton finns och flertalet är till salu om du är intresserad. I vissa fall finns också tips om var du
          kan köpa de olika växterna.
        </p>
        <p>
          Hör gärna av dig om du har synpunkter eller kompletterande information om någon art eller sort. Alltid
          intressant att höra om odlingserfarenheter av de mer oprövade växterna, t.ex. om hur långt norrut de går att
          odla i Sverige.
        </p>
        <p>
          Välkommen att botanisera runt i databasen. Klicka dig fram till ett släkte via alfabetet eller skriv i
          sökrutan.
        </p>
      </article>
      <img src="https://res.cloudinary.com/dxwhmugdr/image/upload/t_1000bred/v1732986145/Li_69394_gnk58o.jpg" alt="" v-if="windowSize.width > 800">
      <!-- <img src="https://res.cloudinary.com/dxwhmugdr/image/upload/t_1000bred/v1732985680/Li_54974_cpkjcz.jpg" alt=""> -->
    </section>

  </div>
</template>


<style>
.page.index {
  padding: 0;
  /* display: flex; */
}

.index header {
  /* flex-grow: 1; */
  height: calc(100vh - 45px);
  display: grid;
  grid-template-rows: 93% 7%;
}


/* @media screen and (min-width: 700px) {
  .index header {
    height: calc(90vh);
  }
} */

.index .content * {
  text-align: center;
}

.index header h1 {
  margin: 0;
  /* margin-bottom: 1rem; */
  font-size: 12.5vw;
  font-weight: 900;
  /* font-size: 2rem; */
}

@media screen and (max-width: 700px) {
  .index header h1.lignos {
    font-size: 20vw;
  }

  .index header h1.lignos-databas {
    display: none;
  }
}

@media screen and (min-width: 700px) {
  .index header h1 {
    font-size: 5rem;
  }

  .index header h1.lignos,
  .index header h1.databas {
    display: none;
  }

  .index header p {
    font-size: 1.5rem;
  }
}

@media screen and (max-width: 700px) {
  .index header h1 {
    line-height: 0.95;
  }

  .index header p {
    margin-top: 1rem;
  }
}

.index .image-align .content p {
  margin-top: 1rem;
}

.index .image-align .hero-image {
  border-radius: 0;
  /* filter: brightness(0.8); */
}

.index header>div {
  position: relative;
  display: flex;
  flex-direction: column;
}

@media screen and (min-width: 700px) {
  .index header>div {
    display: grid;
    grid-template-rows: 80% 20%;
  }
}

@media screen and (max-width: 700px) {
  .index .image-align .hero-image {
    /* height: 70vh; */
    height: 100%;
    width: 100%;
    object-fit: cover;
  }

  .index .image-align {
    height: 100%;
    width: 100%;
    flex-grow: 1;
  }
}

@media screen and (min-width: 700px) {
  .index .image-align .hero-image {
    /* height: 70vh; */
    height: 100%;
    width: 100%;
    object-fit: cover;
  }

  .index .image-align {
    height: 100%;
  }
}

.index .image-align {
  position: relative;
  background: var(--primary-green);
}

.dark .index .image-align {
  background: var(--bg-color);
}

.index .image-align .fade {
  position: absolute;
  /* color: white; */
  /* height: 100%; */
  height: 100%;
  width: 100%;
  bottom: 0;

  padding-top: 140%;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 60%, var(--primary-green) 100%);
  /* background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 10%, rgba(118, 153, 78, 1) 100%); */
  color: white;
}

.dark .index .image-align .fade {
  color: white;
  padding-top: 120%;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 30%, var(--bg-color) 100%);
}

@media screen and (min-width: 700px) {
  .page.index header .image-align .fade {
    padding-top: 0;
  }
}

.index header .content {
  position: absolute;
  padding: 1rem;
  bottom: 2rem;
  color: white;
}

@media screen and (max-width: 700px) {
  .index header .content {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
  }
}

@media screen and (min-width: 700px) {
  .index header .content {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-direction: column;
    width: 100%;
    height: 100%;
    bottom: 2rem;
    /* margin-top: 100%; */
    /* transform: translateY(40vh); */
  }
}


.dark .index header .content * {
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.color-fill-up {
  background: var(--primary-green);
  width: 100%;
  height: 100%;
}

.dark .color-fill-up {
  background: none;
}

.dark .index img {
  box-shadow: none;
}



.index .dots {
  margin: auto;
  display: block;
  font-size: 3rem;
}

.dark .index .dots {
  display: none;
}

@media screen and (min-width: 700px) {
  .index .dots {
    display: none;
  }
}

.index .content .sök {
  margin-top: 1rem;
  background: var(--element-bg);
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: row;
  border-radius: 10000rem;
  position: relative;
  transition: max-width 300ms ease-in-out;
}

.index .content .sök:has(.expanded) {
  z-index: 3;
}

.index .content .sök * {
  background: none
}

.index .content .sök input {
  margin-left: 0.25rem;
  text-align: left;
  background: none;
  flex-grow: 1;
  border: none;
  border-color: transparent;
  border-width: 0;
  border-radius: 0;
}

.index .content .sök input::placeholder {
  opacity: 0.6;
}

.index .content .sök input:hover,
.index .content .sök input:active,
.index .content .sök input:focus {
  border: none;
  border-width: 0;
  border-color: transparent;
}

.index .content .sök button:hover,
.index .content .sök button:active,
.index .content .sök button:focus {
  /* border: none; */
  /* border-width: 0; */
  border-color: transparent;
}

.index .content .sök button {
  display: grid;
  place-items: center;
  margin-right: 0.3rem;
}

.sök button:has(.stäng-ikon) {
  padding: 0.5rem;
  font-size: 1.4rem;
}

.sök button:has(.sök-ikon) {
  pointer-events: none;
}

@media screen and (min-width: 700px) {
  .index .content .sök {
    width: 100%;
    max-width: 23rem;
  }

  .index .content .sök input {
    /* width: 25%; */
    /* border-radius: 10000rem; */
  }
}

.index .content .sök:has(.expanded) {
  width: 90vw;
  max-width: 50rem;
}

@media screen and (min-width:700px) {
  .index .content .sök:has(.expanded) {
    width: 75vw;
  }
}

.index .sök .expanded {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: -1;
  padding-top: 3rem;
  height: 40rem;
  background: var(--element-bg);
  border-radius: 1.5rem;
  box-shadow: 0 20px 30px 2px rgba(0, 0, 0, 0.4);
  color: var(--text-color);
}

.dark .index .sök .expanded {
  box-shadow: 0 5px 25px 5px rgba(0, 0, 0, 0.6);
}

.index .sök .expanded ul {
  width: 100%;
  height: 100%;
  padding: 1rem 1rem 0;
  border-top: 1px solid var(--border-color);
  overflow: clip scroll;
}


.index section {
  padding: 0 1rem;
  display: grid;
}

.index section div.text {
  max-width: 60ch
}


.sök .expanded.expand-enter-active {
  transition: height 0.5s ease;
}

.sök .expanded.expand-leave-active {
  transition: height 0.2s ease;
}

.sök .expanded.expand-enter-from,
.sök .expanded.expand-leave-to {
  height: 0rem;
  overflow: hidden
}

section.about {
  margin: 1rem auto 0;
  font-size: 1.05rem;
  margin-bottom: 3rem;
  max-width: 60ch;
}

@media screen and (min-width:800px) {
  section.about {
    
    margin: 0 auto;
    display: grid;
    place-items: center;
    grid-template-columns: 1fr 1fr;
    max-width: 110ch;
    gap: 3rem;
    padding: 0 2rem
  }
}

@media screen and (min-width:1200px) {
  section.about {
    margin: 0 auto;
    display: grid;
    place-items: center;
    grid-template-columns: 1fr 1fr;
    max-width: 110ch;
    gap: 10rem;
  }
}

section.about p {
  margin-bottom: 1rem;
}
section.about p.välkommen {
  font-size: 1.4rem;
  font-weight: 900;
  font-family: var(--title-font);
}
</style>