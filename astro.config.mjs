// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// GitHub Pages для репозиторію hrechych-olexandra/lexikalisches-system
// віддає сайт як проєктну сторінку — з підшляху /lexikalisches-system/.
// На Netlify/Vercel/своєму хостингу сайт живе в корені домену, тому підшлях
// вмикається лише всередині workflow GitHub Actions (GITHUB_ACTIONS=true).
const onGithubPages = process.env.GITHUB_ACTIONS === 'true';

// https://astro.build/config
export default defineConfig({
  site: onGithubPages ? 'https://hrechych-olexandra.github.io' : 'https://systema-leksyky.send-pulse.com',
  base: onGithubPages ? '/lexikalisches-system' : '/',
  vite: {
    plugins: [tailwindcss()],
  },
});
