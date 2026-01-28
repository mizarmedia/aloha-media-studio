// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://alohamediastudio.com',
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [sitemap({
    filter: (page) =>
      !page.includes('booking-confirmed') &&
      !page.includes('studio-agreement')
  })]
});