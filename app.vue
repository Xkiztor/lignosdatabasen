<template>
  <div class="site">
    <nav>
      <NuxtLink to="/" class="title">
        <h1>
          <Icon name="ph:database" />Växtdatabasen
        </h1>
      </NuxtLink>
      <div class="link-align">
        <NuxtLink to="/">Startsidan</NuxtLink>
        <NuxtLink to="/data">Databas</NuxtLink>
      </div>
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
  --text-color: #fff;
  --mute-white: #cecece;
  --bg-color: #0c0c0d;
  --element-bg: #1c1c1f;
  --border-color: #27272a;
  --primary-green: #73c957;
  --primary-darker: #6a994e;
  --primary-dark: #386641;
  --primary-red: #bc4749;
}

html {
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

nav {
  /* flex-grow: 1; */
  display: flex;
  font-size: 1.4rem;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  height: fit-content;
}

nav .link-align {
  display: flex;
  flex-grow: 1;
  padding-left: 5rem;
  gap: 5rem;
}

nav .link-align a {
  color: var(--mute-white);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: all 250ms;
}

nav .link-align a:hover,
.link-align .router-link-active {
  color: var(--primary-green);
  background: var(--element-bg);
}

nav h1 {
  margin: 0;
  justify-self: flex-start;
  color: var(--text-color);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

nav h1 svg {
  font-size: 115%;
  color: var(--primary-green);
}

nav .title {
  text-decoration: none;
}

input,
button,
textarea {
  background: var(--element-bg);
  border: 1px solid var(--border-color);
  padding: 0.75rem;
  color: var(--text-color);
  border-radius: 0.5rem;
  transition: all 150ms;
  /* font-size: 105%; */
  font-size: 0.95em;
}

input:hover,
input:focus,
input:active,
textarea:hover,
textarea:focus,
textarea:active {
  border-color: var(--primary-dark);
  outline: none;
}

button:hover {

  border-color: var(--primary-dark);
}

button {
  cursor: pointer;
}
</style>
