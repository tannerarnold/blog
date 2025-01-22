import { defineConfig } from 'vite';
import vike from 'vike/plugin';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

export default defineConfig({
  plugins: [svelte(), vike()],
  resolve: {
    alias: {
      '@lib': path.resolve('./src/lib'),
    },
  },
});
