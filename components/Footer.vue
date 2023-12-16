<script setup lang='ts'>

</script>


<template>
  <footer>
    <div class="grid-align">
      <div>
        <p>© 2023 Fotodendron.</p>
        <p>Alla rättigheter tillhör Peter Linder / Fotodendron.se.</p>
        <p>Material från denna sida får ej användas utan tillåtelse.</p>
      </div>
      <div>
        Se även
        <a href="http://lindersplantskola.se/">Lindersplantskola.se</a>
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

footer .grid-align>div {
  width: 100%;
}

@media screen and (min-width: 700px) {
  footer .grid-align {
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  footer .grid-align>div {
    width: fit-content;
  }
}

footer a {
  font-weight: 600;
}
</style>