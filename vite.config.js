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
        const files = [
          'newfile.js',
          'openfile.js',
          'savefile.js',
          'closefile.js',
          'hotkeys.js',
          'exportfile.js',
          'fontsettings.js',
          'viewmodesettings.js',
          'version.json'
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
