// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['@/assets/css/styles.css'],

  // modules: ['nuxt-icon'],
  modules: [
    'nuxt-icon',
    '@nuxtjs/supabase',
    '@nuxt/image',
    '@vueuse/nuxt',
    '@nuxtjs/mdc',
    // '@nuxtjs/device',
    // { src: '@nuxtjs/device', ssr: false },
    '@nuxtjs/sitemap',
    '@nuxt/fonts',
    '@nuxt/scripts',
  ],

  supabase: {
    redirect: false,
  },

  runtimeConfig: {
    public: {
      ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    },
  },

  app: {
    head: {
      title: 'Växt Databas',
      meta: [
        {
          name: 'description',
          content: 'En samlad databas med information om växter',
        },
      ],
    },
  },

  image: {
    provider: 'ipx',
  },

  mdc: {
    components: {
      prose: true, // Disable predefined prose components
      map: {
        img: 'Image',
        a: 'Anchor',
      },
    },
  },

  scripts: {
    registry: {
      googleAnalytics: {
        id: 'G-1QX4VQH98Y',
      }
    }
  },

  site: {
    url: 'https://lignosdatabasen.se/',
    name: 'Lignosdatabasen',
  },
  sitemap: {
    sources: [
      '/api/sitemap-urls'
    ]
  },
  fonts: {
    defaults: {
      weights: [400,600,  700, 800,900],
    },
  },
    routeRules: {
    '/': {swr: true},
  },
  // compatibilityDate: '2024-11-28',
});