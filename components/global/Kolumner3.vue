<script setup></script>

<template>
  <div class="tre-container">
    <slot />
  </div>
</template>

<style>
@media (min-width: 700px) {
  .tre-container {
    margin-top: 0.5rem;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 1.5rem;
    width: 100%;
    padding-right: 1rem;
  }

  article.main-content .tre-container img.article-image {
    margin: 0;
    margin-bottom: 0.5rem;
    width: 100%;
    max-width: none;
  }

  article.main-content .tre-container div.img-div {
    margin: 0;
  }
}
</style>
