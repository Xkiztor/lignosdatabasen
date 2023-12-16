<script setup lang='js'>
const runtimeConfig = useRuntimeConfig();
const enteredPassword = useCookie('enteredPassword', { maxAge: 60604800 });

const router = useRoute()
const client = useSupabaseClient()


const editablePlant = reactive({
  slakte: '',
  art: '',
  sortnamn: '',
  svensktnamn: '',
  text: '',
  hidden: false
})

const addPlant = async () => {
  const { error } = await client.from('växt-databas').insert({ ...editablePlant })
  if (error) {
    console.error(error)
  } else {
    navigateTo('/')
  }
}
</script>


<template>
  <div class="page add plant">
    <div class="main-content add">
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
          <div></div>
          <button class="bold" @click="addPlant()">Lägg till</button>
        </div>
      </form>
      <div class="forhandsgranskning">
        <h1>Förhandsgranskning:</h1>
      </div>
      <div class="forhandsgranskning-article">
        <div>
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
        <div></div>
      </div>
    </div>
  </div>
</template>


<style>
.main-content.add {
  max-width: 70rem;
  padding-top: 2rem;
}

.main-content.add .forhandsgranskning h1 {
  font-size: 2rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 1rem;
  margin-bottom: 4rem;
}

.main-content.add form>div {
  display: grid;
  grid-template-columns: 1fr 4fr;
  gap: 1rem;
  margin-bottom: 1rem;
  place-items: center stretch;
}

.main-content.add form>div textarea {
  min-height: 10rem;
  resize: vertical;
  transition: none;
}

.main-content.add form>div button {
  margin-top: 1rem;
  margin-bottom: 3rem;
  /* grid-column: 1/3; */
}


@media screen and (min-width: 700px) {
  .forhandsgranskning-article {
    display: grid;
    grid-template-columns: 70% 30%;
    gap: 2rem;
  }
}
</style>