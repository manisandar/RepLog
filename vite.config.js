import { defineConfig } from 'vite';

export default defineConfig({
  // Use relative base path so the app works on GitHub Pages subdirectories (e.g., /RepLog/) or custom domains seamlessly
  base: './',
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
});
