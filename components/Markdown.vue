<script setup>
const props = defineProps(['plant'])

console.log(props.plant.text);
</script>


<template>
  <MDC :value="plant.text" tag="article" />
</template>


<style>
hr {
  height: 1rem;
  opacity: 0;
}




.main-content article .screen-cover {
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
  padding: 3rem 1rem;
  object-fit: scale-down;
}

.main-content article .screen-cover img {
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


div.main-content article img.hel {
  width: 100%;
}

div.main-content article img.halv {
  width: 100%;
}



.main-content article img {
  transition: none;
  cursor: pointer;
}

@media screen and (min-width: 700px) {
  div.main-content article img.hel {
    max-width: calc(70ch - 1rem);
    width: 100%;
  }

  div.main-content article img.halv {
    max-width: calc(35ch - 1rem);
    width: 100%;
    display: inline;
  }

  div.main-content article img.vänster {
    float: left;
    margin-top: 0;
  }

  div.main-content article img.höger {
    float: right;
    margin-top: 0;
    margin-left: 1rem;
  }

  div.main-content article p:has(img.vänster),
  div.main-content article p:has(img.höger) {
    overflow: hidden;
  }
}

.main-content article .link {
  color: var(--link);
  text-decoration: underline;
}

.main-content article ol * {
  margin-top: 0.5rem;
  list-style-type: decimal;
  list-style-position: inside;
}

.main-content article ul * {
  list-style-type: disc;
  list-style-position: inside;
  /* margin-left: 0.5rem; */
  /* margin-inline-start: 0.5rem; */
  padding-inline-start: 0.5rem;
}

.main-content article #text {
  background: red;
}
</style>