<script setup>
const props = defineProps(['plant']);

// console.log(props.plant.text);

const formattedText = computed(() => {
  let text = props.plant.text;

  text = text.replace(/!\[omslag]\([^)]+\)/g, '');

  return text;
});
</script>

<template>
  <MDC v-if="formattedText" :value="formattedText" tag="div" />
</template>

<style>
hr {
  height: 1rem;
  opacity: 0;
}

article.main-content .screen-cover {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 5;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  /* justify-content: center; */
  /* flex-shrink: 1; */
  backdrop-filter: blur(2px);
  padding: 2rem 2rem 4rem;
  object-fit: scale-down;
}

article.main-content .screen-cover img {
  box-shadow: 0 0 100px 5px rgba(0, 0, 0, 0.5);
  max-height: 100%;
  /* height: 100%; */
  max-width: 100%;
  /* object-fit: cover; */
  transition: none;
  /* flex-shrink: 1; */
  /* flex-grow: 1; */
  margin: auto;
}

article.main-content .screen-cover a {
  position: absolute;
  font-size: var(--font-base);
  opacity: 0.6;
  display: flex;
  align-items: center;
  color: var(--text-color-dark);
}

@media screen and (max-width: 1000px) {
  article.main-content .screen-cover a {
    top: 0.75rem;
    left: 0.75rem;
  }
}
@media screen and (min-width: 1000px) {
  article.main-content .screen-cover a {
    bottom: 0.75rem;
    left: 0.75rem;
  }
}

article .screen-cover a .icon {
  margin-right: 0.25rem;
}

article .screen-cover a:hover {
  text-decoration: underline;
}

article.main-content img.hel {
  width: 100%;
}

article.main-content img.halv {
  width: 100%;
}

article.main-content img.kvadrat {
  aspect-ratio: 1/1;
}

article.main-content img {
  transition: none;
  cursor: pointer;
}

@media screen and (min-width: 700px) {
  article.main-content .img-div:has(img.hel) {
    max-width: calc(70ch - 1rem);
    width: 100%;
  }

  article.main-content .img-div:has(img.halv) {
    max-width: calc(35ch - 1rem);
    width: 100%;
    /* display: inline; */
  }

  article.main-content .img-div:has(img.vänster) {
    float: left;
    margin-top: 0;
    margin-right: 1.5rem;
  }

  article.main-content .img-div:has(img.höger) {
    float: right;
    margin-top: 0;
    margin-left: 1.5rem;
  }

  article.main-content .img-div img.höger,
  article.main-content .img-div img.vänster {
    margin-top: 0;
  }

  article.main-content p:has(img.vänster),
  article.main-content p:has(img.höger) {
    overflow: hidden;
  }
}

@media screen and (max-width: 700px) {
  article.main-content .img-div {
    display: block;
  }
}

article.main-content .link {
  color: var(--link);
  text-decoration: underline;
}

article.main-content ol * {
  margin-top: 0.5rem;
  list-style-type: decimal;
  list-style-position: inside;
}

article.main-content ul * {
  list-style-type: disc;
  list-style-position: inside;
  /* margin-left: 0.5rem; */
  /* margin-inline-start: 0.5rem; */
  padding-inline-start: 0.5rem;
}

article.main-content #text {
  background: red;
}
</style>
