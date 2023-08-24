// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  // modules: ['nuxt-icon'],
  modules: ['nuxt-icon', '@nuxtjs/supabase', '@nuxt/image'],
  supabase: {
    redirect: false,
  },
});
