import { defineConfig } from 'vite';
import { copyFileSync } from 'fs';

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  plugins: [
    {
      name: 'copy-files',
      closeBundle() {
        try {
          copyFileSync('newfile.js', 'dist/newfile.js');
          copyFileSync('openfile.js', 'dist/openfile.js');
          copyFileSync('savefile.js', 'dist/savefile.js');
          copyFileSync('closefile.js', 'dist/closefile.js');
          console.log('Successfully copied menu scripts to dist directory');
        } catch (err) {
          console.error('Error copying menu scripts:', err);
        }
      }
    }
  ]
});
