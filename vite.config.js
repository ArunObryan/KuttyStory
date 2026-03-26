import { defineConfig } from 'vite';

export default defineConfig({
  base: '/KuttyStory/',
  root: '.',
  publicDir: 'public',
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: 'index.html',
      },
    },
  },
});
