// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  closeApplication: () => ipcRenderer.send('app-close'),
  onNew: (callback) => ipcRenderer.on('trigger-new', () => callback()),
  onOpen: (callback) => ipcRenderer.on('trigger-open', () => callback()),
  onSave: (callback) => ipcRenderer.on('trigger-save', () => callback()),
  onSaveAs: (callback) => ipcRenderer.on('trigger-save-as', () => callback()),
  onClose: (callback) => ipcRenderer.on('trigger-close', () => callback()),
  exportToHtml: (markdown) => ipcRenderer.send('export-to-html', markdown),
  exportToPdf: (markdown) => ipcRenderer.send('export-to-pdf', markdown),

  // New API to save image file
  saveImageFile: (filePath) => ipcRenderer.invoke('save-image-file', filePath),
});
