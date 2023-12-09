<script setup lang='ts'>

</script>


<template>
  <div class="page index">
    <header>
      <Icon class="leaf" size="120" name="bx:bxs-leaf" />
      <h1>Peter's Växtdatabas</h1>
      <p>En samlad informationskälla om olika växter</p>
    </header>
  </div>
</template>


<style>
.page {
  display: flex;
}

.index header {
  flex-grow: 1;
  display: grid;
  place-items: center;
  margin-top: 5rem;
}

.index header * {
  text-align: center;
}

.index header h1 {
  margin: 0;
  font-size: 3rem;
}

.index header .leaf {
  color: var(--primary-green);
}

.dark .index header .leaf {
  color: var(--primary-green);
}
</style>