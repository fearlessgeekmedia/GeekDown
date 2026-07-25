import { Crepe } from '@milkdown/crepe';
import '@milkdown/crepe/theme/common/style.css';
import '@milkdown/crepe/theme/frame.css';

declare global {
  interface Window {
    sciterHost: {
      saveImageFile: (path: string) => Promise<string>;
      showOpenDialog: () => Promise<{ content: string; filename: string } | null>;
      showSaveDialog: (defaultName: string, content: string) => void;
      showExportHtmlDialog: (markdown: string) => void;
      closeApplication: () => void;
    };
    crepeInstance: any;
  }
}

async function tauriOnUpload(files: any) {
  const host = window.tauriHost || window.sciterHost;
  if (!host) {
    console.error('tauriHost not available in upload handler');
    return null;
  }
  
  const file = files.item(0);
  if (!file || !file.path) return null;
  
  try {
    const savedFilePath = await host.saveImageFile(file.path);
    if (!savedFilePath) return null;
    return savedFilePath;
  } catch (e) {
    console.error('Error uploading file:', e);
    return null;
  }
}

const contentToLoad = localStorage.getItem('geekdown-content-to-load') || '# Hello, GeekDown user!';

const crepe = new Crepe({
  root: '#app',
  defaultValue: contentToLoad,
  featureConfigs: {
    'image-block': {
      onUpload: tauriOnUpload
    }
  }
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

document.addEventListener('DOMContentLoaded', () => {
  const versionElem = document.getElementById('about-version');
  if (versionElem) {
    fetch('version.json')
      .then((response) => response.json())
      .then((data) => {
        if (data.version) {
          versionElem.textContent = `v. ${data.version}`;
        }
      })
      .catch((err) => {
        console.error('Failed to load version.json:', err);
      });
  }
});
