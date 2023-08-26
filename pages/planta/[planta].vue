<script setup>
const runtimeConfig = useRuntimeConfig();
const enteredPassword = useCookie('enteredPassword', { maxAge: 60604800 });

const { planta } = useRoute().params

const client = useSupabaseClient()

const { data: plant } = await useAsyncData('planta', async () => {
  const { data } = await client.from('växt-databas').select().eq('id', `${planta}`).single()

  return data
})

console.log(plant.value);

const showDeleteModel = ref(false)
const outsideClickTarget = ref(null)
onClickOutside(outsideClickTarget, () => {
  showDeleteModel.value = false
})

const deletePlant = async () => {
  showDeleteModel.value = false

  const { error } = await client.from('växt-databas').delete().eq('id', `${planta}`)
  if (error) {
    console.error(error)
  }
}

const duplicate = async () => {
  const { error } = await client.from('växt-databas').insert([{ created_at: plant.value.created_at, namn: plant.value.namn, beskrivning: plant.value.beskrivning, bilder: plant.value.bilder }])
  if (error) {
    console.error(error)
  }
  navigateTo('/data')
}

const hide = async () => {
  const { error } = await client.from('växt-databas').update({ hidden: 'TRUE' }).eq('id', `${planta}`)
  if (error) {
    console.error(error)
  }
}

const unHide = async () => {
  const { error } = await client.from('växt-databas').update({ hidden: 'TRUE' }).eq('id', `${planta}`)
  if (error) {
    console.error(error)
  }
}
</script>


<template>
  <div class="page plant">
    <div class="confirm model delete" v-if="showDeleteModel">
      <div class="content" ref="outsideClickTarget">
        <h1>Är du säker?</h1>
        <div class="buttons">
          <button @click="showDeleteModel = false">Nej</button>
          <button @click="deletePlant">Ja</button>
        </div>
      </div>
    </div>
    <div class="admin-panel" v-if="runtimeConfig.public.ADMIN_PASSWORD === enteredPassword">
      <button>Ändra</button>
      <button @click="showDeleteModel = true">Ta bort</button>
      <button @click="duplicate()">Dublicera</button>
      <button v-if="plant.hidden">Visa växt</button>
      <button v-else @click="">Dölj växt</button>
    </div>
    <div class="image-showcase" :style="{ gridTemplateColumns: `repeat(${plant.bilder.length}, 1fr)` }">
      <nuxt-img v-for="image in plant.bilder" :src="image" />
    </div>
    <h1>{{ plant.namn }}</h1>
    <p>{{ plant.beskrivning }}</p>
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima nihil dolores soluta eveniet placeat tempora
      quisquam dignissimos et nisi, dolore eaque sint omnis nam? Facere eum deserunt delectus iusto soluta alias, cumque
      ut veritatis reiciendis tempore ducimus voluptatem eligendi est culpa! Explicabo quidem natus nesciunt perferendis
      harum necessitatibus provident beatae molestias aliquid eos veniam aspernatur illo voluptatibus nisi ea recusandae,
      modi inventore blanditiis. Aut cumque, corporis aliquid, iure adipisci aliquam consequatur doloremque illo minima
      vero perferendis quaerat repellat consequuntur repellendus velit corrupti praesentium ipsum dolorem similique nam!
      Id accusantium earum suscipit ipsa reiciendis laborum, sunt nostrum consequuntur amet inventore officiis tempore
      cupiditate sit nesciunt atque aspernatur dolor iusto quas recusandae qui in adipisci iste. At nulla sed fugiat in
      iusto numquam voluptatem corporis sequi ad libero minus inventore quidem error consequuntur, explicabo enim ipsam
      esse dolorum. Blanditiis assumenda error iure natus impedit sint quam quibusdam consectetur quia odit beatae non,
      porro quidem perspiciatis modi nemo aliquam dignissimos, distinctio praesentium delectus? Dicta debitis, voluptas
      odit laudantium animi quae. Dicta qui illo ipsa recusandae explicabo quidem, facere laboriosam debitis ut sit
      accusamus corporis! Asperiores, error maiores dolor dolore commodi adipisci! Consectetur, iure recusandae est
      repudiandae quasi iusto similique natus vitae commodi tempora facere fugit neque quaerat at nemo. Id culpa totam,
      sunt fuga quo eum impedit excepturi sequi pariatur dolorem doloribus quasi, provident quos eligendi esse dicta unde
      nihil numquam iure nostrum repellendus ad ipsa? Dolorum omnis nesciunt aut harum ullam ea aliquid, animi pariatur
      sequi, saepe tempore amet numquam alias, placeat error incidunt sunt ipsa praesentium. Nesciunt cumque delectus
      itaque voluptate deleniti velit nam, sed illo eaque. Quae recusandae iusto quaerat eveniet dignissimos laboriosam,
      illo mollitia animi eum eligendi incidunt provident vero doloremque quo beatae obcaecati error asperiores id ducimus
      magnam nostrum dolores adipisci quisquam expedita. Enim in eveniet laborum hic.</p>
  </div>
</template>


<style>
.page.plant {
  display: grid;
  place-items: center;
  max-width: 45rem;
  margin: 0 auto;
}

.page.plant h1 {
  font-size: 3rem;
  margin: 0;
  margin-top: 1rem;
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
  padding: 1rem 0;
  display: flex;
  gap: 1rem;
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
  border: 1px solid var(--border-color);
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
</style>