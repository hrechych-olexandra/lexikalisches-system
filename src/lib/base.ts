// GitHub Pages для проєктної сторінки віддає сайт з підшляху (/lexikalisches-system/),
// тому кожне посилання на публічний файл має враховувати astro.config.mjs → base.
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}
