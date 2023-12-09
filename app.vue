<script setup>
const runtimeConfig = useRuntimeConfig();
const enteredPassword = useCookie('enteredPassword', { maxAge: 60604800 });

const isDark = useDark()
const toggleDark = useToggle(isDark)

const { width, height } = useWindowSize()

const showMobileMenu = ref(false)

const client = useSupabaseClient()

const { data: plants } = await useAsyncData('plantor', async () => {
  const { data, error } = await client.from('växt-databas').select().eq('hidden', 'FALSE')

  if (error) {
    console.log(error);
  }
  return data
})

console.log(plants);
</script>


<template>
  <div class="site">
    <nav>
      <NuxtLink to="/" class="title">
        <h1>
          <Icon name="ph:database" />Växtdatabasen
        </h1>
      </NuxtLink>
      <div class="large-nav" v-if="width > 700">


        <ul class="link-align">
          <art-bokstav :bokstav="'A'" :plants="plants" />
          <art-bokstav :bokstav="'B'" :plants="plants" />
          <art-bokstav :bokstav="'C'" :plants="plants" />
          <art-bokstav :bokstav="'D'" :plants="plants" />
          <art-bokstav :bokstav="'E'" :plants="plants" />
          <art-bokstav :bokstav="'F'" :plants="plants" />
          <art-bokstav :bokstav="'G'" :plants="plants" />
          <art-bokstav :bokstav="'H'" :plants="plants" />
          <art-bokstav :bokstav="'I'" :plants="plants" />
          <art-bokstav :bokstav="'J'" :plants="plants" />
          <art-bokstav :bokstav="'K'" :plants="plants" />
          <art-bokstav :bokstav="'L'" :plants="plants" />
          <art-bokstav :bokstav="'M'" :plants="plants" />
          <art-bokstav :bokstav="'N'" :plants="plants" />
          <art-bokstav :bokstav="'O'" :plants="plants" />
          <art-bokstav :bokstav="'P'" :plants="plants" />
          <art-bokstav :bokstav="'Q'" :plants="plants" />
          <art-bokstav :bokstav="'R'" :plants="plants" />
          <art-bokstav :bokstav="'S'" :plants="plants" />
          <art-bokstav :bokstav="'T'" :plants="plants" />
          <art-bokstav :bokstav="'U'" :plants="plants" />
          <art-bokstav :bokstav="'V'" :plants="plants" />
          <art-bokstav :bokstav="'W'" :plants="plants" />
          <art-bokstav :bokstav="'X'" :plants="plants" />
          <art-bokstav :bokstav="'Y'" :plants="plants" />
          <art-bokstav :bokstav="'Z'" :plants="plants" />
        </ul>


        <div class="account-icon" v-if="runtimeConfig.public.ADMIN_PASSWORD === enteredPassword">
          <NuxtLink to="/admin">
            <Icon name="ic:baseline-person" />
          </NuxtLink>
        </div>
      </div>
      <button @click="showMobileMenu = !showMobileMenu" v-else class="hamburger-menu">
        <Icon name="ci:hamburger-md" />
      </button>
      <ThemeToggle />
      <nav v-if="showMobileMenu" class="mobile-menu" @click="showMobileMenu = false">
        <NuxtLink to="/">Startsidan</NuxtLink>
        <NuxtLink to="/data">Databas</NuxtLink>
        <NuxtLink to="/admin" class="account-icon" v-if="runtimeConfig.public.ADMIN_PASSWORD === enteredPassword">
          <Icon name="ic:baseline-person" />
        </NuxtLink>
      </nav>
    </nav>
    <NuxtPage />
    <footer></footer>
  </div>
</template>

<style>
* {
  transition: all 200ms;
  box-sizing: border-box;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif, Helvetica, sans-serif;
}

:root {
  --title-color-light: #000000;
  --title-color-dark: #fef6ec;

  --text-color-light: #352a24;
  --text-color-dark: #eae0d4;

  --mute-text-light: #adaba5;
  --mute-text-dark: #959595;

  --bg-color-light: #edebe6;
  --bg-color-dark: #181410;

  --element-bg-light: #dddad1;
  --element-bg-dark: #261f18;

  --border-color-dark: #27272a;
  --border-color-light: #ccc9c2;

  --primary-brown: #6b5e0a;
  --primary-green-dark: #8ac957;
  --primary-green-light: #76994e;
  /* --primary-green-light: #386641; */
  /* --primary-green-light: #447c4f; */
  --primary-red: #bc4749;
}

html {
  --title-color: var(--title-color-light);

  --text-color: var(--text-color-light);

  --mute-text: var(--mute-text-light);

  --bg-color: var(--bg-color-light);

  --element-bg: var(--element-bg-light);

  --border-color: var(--border-color-light);

  --primary-green: var(--primary-green-light);
}

.dark {
  --title-color: var(--title-color-dark);

  --text-color: var(--text-color-dark);

  --mute-text: var(--mute-text-dark);

  --bg-color: var(--bg-color-dark);

  --element-bg: var(--element-bg-dark);

  --border-color: var(--border-color-dark);

  --primary-green: var(--primary-green-dark);
}

html {
  background: var(--bg-color);
  color: var(--text-color);
  overflow-x: hidden;
}

html.dark {
  background: var(--bg-color);
  color: var(--text-color);
}

body {
  margin: 0;
}

.site {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

a {
  color: var(--text-color);
}

input,
button,
textarea {
  background: var(--element-bg);
  border: 1px solid transparent;
  padding: 0.75rem;
  color: var(--text-color);
  border-radius: 0.5rem;
  transition: all 150ms;
  /* font-size: 105%; */
  font-size: 0.95em;
}

.dark input,
.dark button,
.darf textarea {
  background: var(--element-bg);
  /* border-color: var(--border-color); */
  color: var(--text-color);
}

input:hover,
input:focus,
input:active,
textarea:hover,
textarea:focus,
textarea:active {
  border-color: var(--primary-green);
  outline: none;
}

.dark input:hover,
.dark input:focus,
.dark input:active,
.dark textarea:hover,
.dark textarea:focus,
.dark textarea:active {
  border-color: var(--primary-green);
}

button:hover {
  /* border-color: var(--primary-brown); */
  opacity: 0.8;
}

.dark button:hover {
  border-color: var(--primary-green);
}

button {
  cursor: pointer;
}


nav {
  /* flex-grow: 1; */
  display: grid;
  grid-template-columns: 20% 60% 20%;
  font-size: 1.4rem;
  padding: 0.5rem;
  border-bottom: 1px solid var(--border-color);
  height: fit-content;
}

@media screen and (max-width: 1100px) {
  nav {
    grid-template-columns: min-content auto min-content;
  }
}

/* @media screen and (max-width: 900px) {
  nav {
    grid-template-columns: 20% 75% 5%;
  }
} */


nav .link-align {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-grow: 1;
  padding-right: 1rem;
  padding-left: 1rem;
  margin: auto;
}

nav .link-align>li {
  width: 100%;
  text-align: center;
}

@media screen and (min-width: 1000px) {
  nav .link-align {
    padding-left: 5rem;
    /* gap: 5rem; */
  }
}



.dark nav .link-align a:hover,
.dark .link-align .router-link-active {
  color: var(--primary-green);
  background: var(--element-bg);
}

nav p {
  margin: 0;
}

nav h1 {
  margin: 0;
  justify-self: flex-start;
  color: var(--text-color);
  text-decoration: none;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1em;
}

@media screen and (min-width: 900px) {
  nav h1 {
    font-size: 1.2em;
  }
}

nav h1 svg {
  font-size: 115%;
  color: var(--primary-green);
}

nav .title {
  text-decoration: none;
}

nav .large-nav {
  display: flex;
  flex-grow: 1;
}

nav .account-icon {
  margin: auto;
  color: var(--primary-green);
  line-height: 0;
  font-size: 1.4em;
}



nav .account-icon svg {
  margin: auto;
  color: var(--primary-green);
}


nav .hamburger-menu {
  color: var(--primary-brown);
  margin: auto 0 auto auto;
  padding: 0;
  background: none;
  border: none;
  display: grid;
  place-items: center;
  font-size: 1.25em;
}

.dark .hamburger-menu {
  color: var(--primary-green);
}

nav .mobile-menu {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: absolute;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  gap: 0.25rem;
  top: 5rem;
  right: 1rem;
}


nav .mobile-menu * {
  color: var(--text-color);
  text-align: start;
  text-decoration: none;
  margin: 0;
}


nav .mobile-menu .router-link-active {
  color: #757575;
}
</style>
