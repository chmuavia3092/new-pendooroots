import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import { viteConfig } from './vite.config';

export default defineConfig({
  site: 'https://pendooroots-site.vercel.app',
  output: 'static',
  adapter: undefined,
  integrations: [react()],
  vite: viteConfig,
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp'
    }
  },
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
    assets: 'assets'
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport'
  }
});