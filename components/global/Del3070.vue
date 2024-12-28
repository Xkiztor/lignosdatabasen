<script setup></script>

<template>
  <div class="del3070-container">
    <slot />
  </div>
</template>

<style>
@media (min-width: 700px) {
  .del3070-container {
    display: grid;
    grid-template-columns: 70% 30%;
    gap: 1.5rem;
    width: 100%;
    padding-right: 1rem;
  }

  article.main-content .del3070-container img.article-image {
    margin: 0;
    margin-bottom: 0.5rem;
    width: 100%;
    max-width: none;
  }
  .del3070-container p:not(:has(img)) {
    grid-column: 2/3;
  }
}
</style>
