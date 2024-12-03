<script setup>
</script>

<template>
  <div class="fifty-container">
    <slot />
  </div>
</template>


<style>
@media (min-width: 700px) {
  .fifty-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    width: 100%;
    padding-right: 1rem;
  }

  article.main-content .fifty-container img.article-image {
    margin: 0;
    margin-bottom: 0.5rem;
    width: 100%;
    max-width: none;
  }
  .fifty-container p:not(:has(img)) {
    grid-column: 2/3;
  }
}

</style>