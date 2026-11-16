// Configuration Astro d'Aqua2.0
// SITE_URL et BASE_PATH sont fournis par le déploiement GitHub Pages
// (voir .github/workflows/deploy.yml). En local, le site tourne à la racine "/".
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';

export default defineConfig({
  site: process.env.SITE_URL || 'http://localhost:4321',
  base: process.env.BASE_PATH || '/',
  integrations: [preact()],
});
