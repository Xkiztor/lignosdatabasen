<script setup lang='ts'>
const props = defineProps(['href'])
</script>


<template>
  <NuxtLink class="link" :href="props.href" target="_blank">
    <slot />
  </NuxtLink>
</template>


<style></style>