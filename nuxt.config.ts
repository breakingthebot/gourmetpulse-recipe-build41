// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],
  app: {
    head: {
      title: 'GourmetPulse — SEO Culinary Recipe Application',
      meta: [
        { name: 'description', content: 'Discover curated gourmet recipes with rich SEO metadata, Schema.org structured data, and interactive cooking guides.' },
        { property: 'og:title', content: 'GourmetPulse — SEO Culinary Recipe Application' },
        { property: 'og:description', content: 'Discover curated gourmet recipes with rich SEO metadata, Schema.org structured data, and interactive cooking guides.' },
        { property: 'og:type', content: 'website' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap' }
      ]
    }
  }
})
