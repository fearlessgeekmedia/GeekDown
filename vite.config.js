import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: './', // This is important for Electron to find assets correctly
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
});
