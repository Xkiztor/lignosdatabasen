<script setup lang="ts">
const props = defineProps(['href']);
</script>

<template>
  <NuxtLink class="link" :to="props.href" :target="props.href.includes('http') ? '_blank' : ''">
    <slot />
  </NuxtLink>
</template>

<style></style>
