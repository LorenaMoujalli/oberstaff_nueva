import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.oberstaff.com',
  output: 'static',
  vite: {
    // In development: proxy /api requests to the standalone server.js
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
        }
      }
    }
  }
});