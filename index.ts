// index.ts
import { Crepe } from '@milkdown/crepe';
import '@milkdown/crepe/theme/common/style.css';
import '@milkdown/crepe/theme/frame.css';

const contentToLoad = localStorage.getItem('geekdown-content-to-load') || '# Hello, GeekDown user!';

const crepe = new Crepe({
  root: '#app',
  defaultValue: contentToLoad,
  // No custom upload plugin here — default blob URLs will be used
});

crepe.create()
  .then(() => {
    console.log('Milkdown Crepe editor is ready!');
    (window as any).crepeInstance = crepe;

    if (typeof window.applyFontSettings === 'function') {
      window.applyFontSettings();
    }
  })
  .catch((err) => {
    console.error('Error initializing Milkdown Crepe:', err);
  });

// Listen for file content sent from main process (when app is started with a file argument)
if ((window as any).electronAPI && typeof (window as any).electronAPI.onLoadFileContent === 'function') {
  (window as any).electronAPI.onLoadFileContent((data: { content: string, filename: string }) => {
    // Prevent reload loop by using a sessionStorage flag
    if (!sessionStorage.getItem('file-loaded-from-argv')) {
      localStorage.setItem('geekdown-content-to-load', data.content);
      localStorage.setItem('geekdown-filename', data.filename);
      sessionStorage.setItem('file-loaded-from-argv', 'true');
      window.location.reload();
    }
  });
}

// Set version in About modal from version.json
document.addEventListener('DOMContentLoaded', () => {
  fetch('version.json')
    .then((response) => response.json())
    .then((data) => {
      const versionElem = document.getElementById('about-version');
      if (versionElem && data.version) {
        versionElem.textContent = `v. ${data.version}`;
      }
    })
    .catch((err) => {
      console.error('Failed to load version.json:', err);
    });
});
