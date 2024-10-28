<script setup>
const isDark = useDark()
const toggleDark = useToggle(isDark)

</script>

<template>
  <button @click="toggleDark()" class="theme-toggle">
    <Icon v-if="isDark" size="18" name="lucide:sun-medium" />
    <Icon v-else size="18" name="majesticons:moon" class="gray" />
  </button>
  <!-- <button @click="toggleDark()" class="theme-toggle">
    <v-if v-if="!isDark">
      <Icon name="lucide:sun-medium" />
      Ljust
    </v-if>
    <v-if v-else>
      <Icon name="majesticons:moon" />
      Mörkt
    </v-if>
  </button> -->
</template>

<style>
.theme-toggle {
  width: fit-content;
  aspect-ratio: 1/1;
  margin-left: auto;
}

.theme-toggle>* {
  display: grid;
  grid-template-columns: auto;
  place-items: center start;
  /* gap: 0.3rem; */
}

.gray {
  color: rgb(84, 84, 84);
}

.theme-toggle:hover {
  border-color: none;
}
</style>