// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ["bootstrap/dist/css/bootstrap.min.css", "bootstrap-icons/font/bootstrap-icons.css"],

  modules: ["@nuxtjs/supabase"],
  supabase: { redirect: false },
  app: {
    head: {
      script: [
        { src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.2/dist/js/bootstrap.bundle.min.js'}
      ]
    }
  },
})
