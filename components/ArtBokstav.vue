<script setup>
const props = defineProps(['bokstav', 'plants']);
// console.log(props.bokstav);

// console.log(props.plants)

const plantsInLetter = computed(() => {
  // let newList = []
  // newList = props.plants.filter(plant => plant.slakte.charAt(0) === props.bokstav)
  // newList = newList.filter((value, index) => {
  //   return newList.indexOf(value) === index;
  // })
  let plantString = props.plants.map((obj) => obj.slakte);

  let uniqueSlakteArray = plantString.filter((item, index) => plantString.indexOf(item) === index);

  let correctLetter = uniqueSlakteArray.filter((plant) => plant.charAt(0) === props.bokstav);

  let sortedArray = correctLetter.sort();

  return sortedArray;
});

// console.log(plantsInLetter.value);

// console.log(plantsInLetter.value.lenght)

const showDropdown = ref(false);
const isHovering = ref(false);

const outsideClickRef = ref();

onClickOutside(outsideClickRef, () => {
  showDropdown.value = false;
  if (width.value > 700) {
    // console.log('outside');
  }
});

const { width, height } = useWindowSize();

const router = useRoute();
onMounted(() => {
  // console.log(props.bokstav);
  // console.log(router.params);
  // console.log(router.params.slakte[0]);
});

const routerActive = computed(() => {
  // console.log(router.params);
  // console.log(router.params === {} ? 'ye' : 'no');
  // console.log(Object.keys(router.params).length === 0);
  if (Object.keys(router.params).length === 0) {
    return false;
  } else {
    if (router.params.slakte[0] == props.bokstav) {
      return true;
    } else {
      return false;
    }
  }
  // return false
});
</script>

<template>
  <li
    @mouseenter="
      (isHovering = true),
        (showDropdown = width > 700 ? (plantsInLetter == 0 ? false : true) : false)
    "
    @mouseleave="(isHovering = false), width > 700 ? (showDropdown = false) : ''"
    @click="showDropdown = plantsInLetter == 0 ? false : isHovering ? true : !showDropdown"
    ref="outsideClickRef"
    class="artbokstav"
  >
    <p :class="{ muted: plantsInLetter == 0, 'router-active': routerActive }">
      {{ bokstav }}
    </p>
    <Teleport to="#popup-location" :disabled="width > 700">
      <div class="dropdown-spacer">
        <Transition name="dropdown">
          <ul class="dropdown" v-if="showDropdown">
            <li v-for="plant in plantsInLetter">
              <nuxt-link :to="'/planta/' + plant + '/' + 'slakte' + '/'">{{ plant }}</nuxt-link>
            </li>
          </ul>
        </Transition>
      </div>
    </Teleport>
  </li>
</template>

<style>
.artbokstav {
  list-style-type: none;
}

@media screen and (min-width: 700px) {
  .artbokstav {
    position: relative;
  }
}

.artbokstav p,
.artbokstav a {
  cursor: pointer;
  text-decoration: none;
}

.artbokstav p:hover:not(.muted),
.artbokstav a:hover:not(.muted) {
  color: var(--primary-green);
}

.dark .artbokstav p:hover:not(.muted),
.dark .artbokstav a:hover:not(.muted) {
  color: var(--primary-green);
}

.dropdown .artbokstav:has(a:hover) {
  transform: translate(4px, 0);
}

p.muted {
  color: var(--mute-text);
  cursor: default;
}

.artbokstav .router-active {
  color: var(--primary-green);
  text-decoration: underline;
}

@media screen and (min-width: 700px) {
  .dropdown-spacer {
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0);
    padding-top: 1.25rem;
    z-index: 5;
  }

  .dropdown {
    padding: 1rem;
    border-radius: 0.5rem;
    background: var(--element-bg);
    border: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.85rem;
    line-height: 1;
    z-index: 5;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
    /* font-size: 1.05em; */
  }

  .dark .dropdown {
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.7);
  }

  .dropdown::before {
    content: '';
    z-index: 5;
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
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 70ms ease;
}

.dropdown-enter-from {
  opacity: 1;
  transform: translate(0, -30px);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translate(0, 10px);
}
</style>
