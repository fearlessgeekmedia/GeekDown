// image-upload.js
import { Crepe } from '@milkdown/crepe';
import { upload } from '@milkdown/plugin-upload';

// Custom upload handler for Electron
async function electronUploadHandler(file) {
  // Electron's File object may have a 'path' property
  if (!file.path) {
    console.error('File path not available. Cannot save image locally.');
    return '';
  }

  // Call Electron API to save the image file
  const savedFilePath = await window.electronAPI.saveImageFile(file.path);

  if (!savedFilePath) {
    console.error('Failed to save image file locally.');
    return '';
  }

  // Return the file:// URL for the saved image
  return savedFilePath;
}

async function setupEditor() {
  const crepe = new Crepe({
    root: '#app',
    defaultValue: localStorage.getItem('geekdown-content-to-load') || '# Hello, GeekDown user!',
    plugins: [
      upload({
        // Provide your custom upload handler here
        upload: electronUploadHandler,
      }),
    ],
  });

  await crepe.create();
  window.crepeInstance = crepe;
}

setupEditor();
