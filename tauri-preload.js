// tauri-preload.js - exposes tauriHost API for Tauri 2.x

console.log('[tauri-preload] Loading...');

// Create tauriHost object immediately
window.tauriHost = {
  _ready: false,
  _invoke: null
};

// Helper to wait for Tauri injection
async function waitForTauri() {
  let attempts = 0;
  while (typeof window.__TAURI_INTERNALS__ === 'undefined' &&
         typeof window.__TAURI__ === 'undefined' &&
         attempts < 100) {
    await new Promise(function(r) { setTimeout(r, 100); });
    attempts++;
    console.log('[tauri-preload] Waiting for __TAURI__, attempt ' + attempts);
  }
  console.log('[tauri-preload] __TAURI__ available:', !!window.__TAURI__, '__TAURI_INTERNALS__ available:', !!window.__TAURI_INTERNALS__);
}

// Initialize on first use
window.tauriHost._init = async function() {
   if (window.tauriHost._ready) return true;

   await waitForTauri();

   // Get invoke function
   var invoke = window.__TAURI_INTERNALS__?.invoke || window.__TAURI__?.core?.invoke;

   if (!invoke) {
     console.error('[tauri-preload] Tauri API not available. Cannot initialize tauriHost.');
     return false;
   }

   window.tauriHost._invoke = invoke;
   window.tauriHost._ready = true;
   console.log('[tauri-preload] tauriHost ready');
   return true;
 };

window.tauriHost.saveImageFile = async function(originalFilePath) {
  console.log('[tauri-preload] saveImageFile:', originalFilePath);
  if (!(await window.tauriHost._init())) return null;

  try {
    var dir = await window.tauriHost._invoke('plugin:path|resolve_directory', { directory: 14 });
    var dirPath = dir + '/images';
    await window.tauriHost._invoke('plugin:fs|mkdir', { path: dirPath, options: { recursive: true } });

    var fileName = originalFilePath.split('/').pop();
    var destPath = dirPath + '/' + fileName;
    var counter = 1;
    var ext = fileName?.split('.').pop();
    var baseName = fileName?.substring(0, (fileName?.length || 0) - (ext?.length || 0) - 1);

    while (await window.tauriHost._invoke('plugin:fs|exists', { path: destPath, options: undefined })) {
      destPath = dirPath + '/' + baseName + '-' + counter + '.' + ext;
      counter++;
    }

    await window.tauriHost._invoke('plugin:fs|copy_file', { fromPath: originalFilePath, toPath: destPath, options: undefined });
    return 'file://' + destPath;
  } catch (e) {
    alert('Error saving image: ' + e);
    throw e;
  }
};

window.tauriHost.showOpenDialog = async function() {
  console.log('[tauri-preload] showOpenDialog');
  if (!(await window.tauriHost._init())) return null;

  try {
    var result = await window.tauriHost._invoke('plugin:dialog|open', {
      options: {
        multiple: false,
        directory: false,
        filters: [{ name: 'Markdown Files', extensions: ['md', 'markdown', 'txt'] }]
      }
    });

    console.log('[tauri-preload] open result:', result);
    if (result) {
      var raw = await window.tauriHost._invoke('plugin:fs|read_text_file', { path: result, options: undefined });
      console.log('[tauri-preload] read_text_file raw type:', typeof raw, raw instanceof ArrayBuffer, Array.isArray(raw));
      var content;
      if (raw instanceof ArrayBuffer) {
        content = new TextDecoder().decode(raw);
      } else if (Array.isArray(raw)) {
        content = new TextDecoder().decode(Uint8Array.from(raw));
      } else {
        content = String(raw);
      }
      var filename = result.split('/').pop();
      return { content: content, filename: filename };
    }
    return null;
  } catch (e) {
    alert('Error opening file: ' + e);
    throw e;
  }
};

window.tauriHost.showSaveDialog = async function(defaultName, content) {
  console.log('[tauri-preload] showSaveDialog:', defaultName);
  if (!(await window.tauriHost._init())) return null;

  try {
    var filePath = await window.tauriHost._invoke('plugin:dialog|save', {
      options: {
        defaultPath: defaultName,
        filters: [{ name: 'Markdown Files', extensions: ['md', 'markdown', 'txt'] }]
      }
    });

    console.log('[tauri-preload] save path selected:', filePath);
    if (filePath) {
      var actualPath = filePath;
      if (filePath.startsWith('file://')) {
        actualPath = decodeURIComponent(filePath.slice(7));
      }

      var encoder = new TextEncoder();
      await window.tauriHost._invoke('plugin:fs|write_text_file', encoder.encode(content), {
        headers: {
          path: encodeURIComponent(actualPath),
          options: '{}'
        }
      });

      var filename = actualPath.split('/').pop();
      localStorage.setItem("geekdown-filename", filename);
      localStorage.setItem("geekdown-content-to-load", content);

      return 'Saved to ' + actualPath;
    }
    return null;
  } catch (e) {
    console.error('[tauri-preload] showSaveDialog error:', e);
    alert('Error saving file: ' + e);
    throw e;
  }
};

window.tauriHost.savePdfFile = async function(pdfData, defaultName) {
   console.log('[tauri-preload] savePdfFile, pdfData length:', pdfData?.length);
   if (!(await window.tauriHost._init())) return null;

   try {
     var filePath = await window.tauriHost._invoke('plugin:dialog|save', {
       options: {
         defaultPath: defaultName || 'document.pdf',
         filters: [{ name: 'PDF Files', extensions: ['pdf'] }]
       }
     });

     console.log('[tauri-preload] save path selected:', filePath);
     if (!filePath) {
       return null;
     }

     var actualPath = filePath;
     if (filePath.startsWith('file://')) {
       actualPath = decodeURIComponent(filePath.slice(7));
     }

     await window.tauriHost._invoke('plugin:fs|write_file', pdfData, {
       headers: {
         path: encodeURIComponent(actualPath),
         options: '{}'
       }
     });

     return 'Exported to ' + actualPath;
   } catch (e) {
     console.error('[tauri-preload] savePdfFile error:', e);
     alert('Error saving PDF: ' + e);
     throw e;
   }
 };

window.tauriHost.showExportHtmlDialog = async function(html, forPdf) {
   console.log('[tauri-preload] showExportHtmlDialog, html length:', html?.length);
   if (!(await window.tauriHost._init())) return null;

   try {
     var fullHtml = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Exported</title></head><body>' + html + '</body></html>';
     console.log('[tauri-preload] fullHtml length:', fullHtml.length);

     var defaultName = forPdf ? 'document.pdf' : 'document.html';
     var saveOptions = {
       defaultPath: defaultName,
       filters: forPdf ? [{ name: 'PDF Files', extensions: ['pdf'] }] : [{ name: 'HTML Files', extensions: ['html', 'htm'] }]
     };
     console.log('[tauri-preload] save options:', JSON.stringify(saveOptions));

     var filePath = await window.tauriHost._invoke('plugin:dialog|save', { options: saveOptions });
     console.log('[tauri-preload] export HTML path selected:', filePath);

     if (!filePath) {
       console.log('[tauri-preload] user cancelled save dialog');
       return null;
     }

     var actualPath = filePath;
     if (filePath.startsWith('file://')) {
       actualPath = decodeURIComponent(filePath.slice(7));
     }

     var encoder = new TextEncoder();
     var encoded = encoder.encode(fullHtml);
     console.log('[tauri-preload] encoded bytes length:', encoded.length);

     console.log('[tauri-preload] invoking write_text_file with path:', actualPath);
     await window.tauriHost._invoke('plugin:fs|write_text_file', encoded, {
       headers: {
         path: encodeURIComponent(actualPath),
         options: '{}'
       }
     });
     console.log('[tauri-preload] write_text_file completed');
     return 'Exported to ' + actualPath;
   } catch (e) {
     console.error('[tauri-preload] showExportHtmlDialog error:', e);
     alert('Error exporting HTML: ' + e);
     throw e;
   }
 };

window.tauriHost.closeApplication = async function() {
  console.log('[tauri-preload] closeApplication');
  if (!(await window.tauriHost._init())) return;
  if (window.tauriHost._invoke) {
    window.tauriHost._invoke('close_application');
  }
};

window.sciterHost = window.tauriHost;
console.log('[tauri-preload] tauriHost created');

// Automatically start initialization
window.tauriHost._init().then(function() {
   console.log('[tauri-preload] Auto-initialized tauriHost');
   window.dispatchEvent(new Event('tauriHostReady'));
 }).catch(function(err) {
   console.error('[tauri-preload] Auto-initialization failed:', err);
 });