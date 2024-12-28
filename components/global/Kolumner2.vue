<script setup>
const props = defineProps(['del']);
</script>

<template>
  <div
    class="del-container"
    :style="{ gridTemplateColumns: `${del[0]}${del[1]}% ${del[2]}${del[3]}%` }"
  >
    <slot />
  </div>
</template>

<style>
@media (min-width: 700px) {
  .del-container {
    display: grid;
    /* grid-template-columns: 80% 20%; */
    gap: 1.5rem;
    width: 100%;
    padding-right: 1rem;
  }

  article.main-content .del-container img.article-image {
    margin: 0;
    margin-bottom: 0.5rem;
    width: 100%;
    max-width: none;
  }
  .del-container p:not(:has(img)) {
    grid-column: 2/3;
  }
}
</style>
