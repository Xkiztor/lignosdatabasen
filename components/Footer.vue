<script setup lang="ts">
const currentYear = new Date().getFullYear();
</script>

<template>
  <footer>
    <div class="grid-align">
      <div>
        <p>© {{ currentYear }} Lignosdatabasen.</p>
        <!-- <p>Hemsida utvecklad av Ugo Linder</p> -->
        <p>Material från denna sida får ej användas utan tillåtelse.</p>
        <p class="mobile-line-break">
          <span>Peter Linder</span><span class="dash"> - </span
          ><span>peter@lindersplantskola.se</span><span class="dash"> - </span>
          <span>0733 518 716</span>
        </p>
      </div>
      <div>
        Se även
        <a href="http://lindersplantskola.se/">Lindersplantskola.se</a>
        <a href="https://superlistan.lindersplantskola.se/">Superlistan</a>
        <a href="https://www.facebook.com/LindersPlantskola">Lindersplantskola Facebook</a>
      </div>
    </div>
  </footer>
</template>

<style>
footer {
  margin-top: 3rem;
  padding: 4rem 1rem;
  background: var(--element-bg);
}

footer * {
  color: var(--primary-brown);
  display: block;
}

.dark footer * {
  color: var(--mute-text);
}

footer .grid-align {
  max-width: 80rem;
  margin: 0 auto;
  /* text-align: center; */
  display: grid;
  place-items: center;
  gap: 2rem;
}

footer .grid-align > div {
  width: 100%;
}

@media screen and (min-width: 700px) {
  footer .grid-align {
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  footer .grid-align > div {
    width: fit-content;
  }
}

footer a {
  font-weight: 600;
}

footer p {
  line-height: 1.5;
}

@media screen and (min-width: 1100px) {
  .mobile-line-break span {
    display: inline;
  }
}
@media screen and (max-width: 1100px) {
  .mobile-line-break span {
    display: block;
  }
  .mobile-line-break span.dash {
    display: none;
  }
  .mobile-line-break {
    margin-top: 0.5rem;
  }
}
</style>
