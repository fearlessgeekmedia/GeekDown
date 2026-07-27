import { defineConfig } from 'vite';
import { copyFileSync } from 'fs';

export default defineConfig({
  base: './',
  server: {
    hmr: {
      overlay: false
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      external: ['@sys', '@env']
    }
  },
  optimizeDeps: {
    exclude: ['tauri-preload.js', 'openfile.js', 'savefile.js', 'closefile.js', 'hotkeys.js', 'newfile.js', 'fontsettings.js', 'viewmodesettings.js']
  },
  plugins: [
    {
      name: 'copy-files',
      closeBundle() {
        const files = [
          'newfile.js',
          'openfile.js',
          'savefile.js',
          'closefile.js',
          'hotkeys.js',
          'fontsettings.js',
          'viewmodesettings.js',
          'version.json',
          'tauri-preload.js',
          'w3.css'
        ];
        
        files.forEach(file => {
          try {
            copyFileSync(file, `dist/${file}`);
            console.log(`Successfully copied ${file} to dist directory`);
          } catch (err) {
            console.error(`Error copying ${file}:`, err);
          }
        });
      }
    }
  ]
});
