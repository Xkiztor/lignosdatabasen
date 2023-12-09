<script setup>
const props = defineProps([
  'bokstav', 'plants'
])
console.log(props.bokstav);

console.log(props.plants)

const plantsInLetter = computed(() => {
  let newList = []
  newList = props.plants.filter(plant => plant.slakte.charAt(0) === props.bokstav)
  return newList
})

console.log(plantsInLetter.value);

console.log(plantsInLetter.value.lenght)

const showDropdown = ref(false)
</script>


<template>
  <li @mouseenter="showDropdown = plantsInLetter == 0 ? false : true" @mouseleave="showDropdown = false" class="">
    <p :class="{ 'muted': plantsInLetter == 0 }">
      {{ bokstav }}
    </p>
    <div class="dropdown-spacer">
      <ul class="dropdown" v-if="showDropdown">
        <li v-for="plant in plantsInLetter"><nuxt-link :to="'/planta/' + plant.slakte">{{ plant.slakte }}</nuxt-link></li>
      </ul>
    </div>
  </li>
</template>


<style>
li {
  list-style: none;
  position: relative;
}

li p,
li a {
  cursor: pointer;
  text-decoration: none;
}

li p:hover:not(.muted),
li a:hover:not(.muted) {
  color: var(--primary-green);
}

.dark li p:hover:not(.muted),
.dark li a:hover:not(.muted) {
  color: var(--primary-green);
}


p.muted {
  color: var(--mute-text);
  cursor: default;
}

.dark p.muted {
  color: var(--mute-text);
}

.dropdown-spacer {
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  padding-top: 1.25rem;
}

.dropdown {
  padding: 0.5rem 0.5rem 0.75rem;
  border-radius: 0.5rem;
  background: var(--element-bg);
  border: 1px solid var(--element-bg);
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 0.75rem;
  line-height: 1;
}

.dark .dropdown {
  background: var(--element-bg);
  border-color: var(--element-bg);
}

.dropdown::before {
  content: "";
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  top: 6px;
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;

  border-bottom: 15px solid var(--element-bg);
}

.dark .dropdown::before {
  border-bottom-color: var(--element-bg);
}
</style>