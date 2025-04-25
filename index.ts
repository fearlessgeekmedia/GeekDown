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
