import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://yellow-flowers-alpha.vercel.app',
  output: 'server',
  adapter: vercel(),
  security: {
    checkOrigin: false
  }
});
