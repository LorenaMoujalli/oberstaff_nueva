// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  vite: {
    server: {
      proxy: {
        '/api/guardar-lead': {
          target: 'http://localhost:3000',
          changeOrigin: true,
        }
      }
    }
  }
});