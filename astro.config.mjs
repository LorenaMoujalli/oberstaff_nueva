// @ts-check
import { defineConfig } from 'astro/config';

// Detect if we are building for production
const isProd = process.env.NODE_ENV === 'production';

// https://astro.build/config
export default defineConfig({
  redirects: isProd ? {
    '/pr': '/',
    '/pr/[...slug]': '/',
  } : {},
});
