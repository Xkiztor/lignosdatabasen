import { ref } from 'vue';
import { createGlobalState, useStorage } from '@vueuse/core';

export const useGlobalState = createGlobalState(() => {
  const currentPageImages = ref([]);
  const currentPagePlant = ref([]);

  return {
    currentPageImages, currentPagePlant
  };
});
