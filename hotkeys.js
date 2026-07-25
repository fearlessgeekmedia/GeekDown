document.addEventListener("DOMContentLoaded", function() {
  document.addEventListener("keydown", function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      return;
    }

    const cmdOrCtrl = e.ctrlKey || e.metaKey;

    // F12 for devtools
    if (e.key === 'F12') {
      e.preventDefault();
      if (typeof window.__TAURI__ !== 'undefined' && window.__TAURI__.core) {
        window.__TAURI__.core.invoke('toggle_devtools');
      }
      return;
    }

    if (cmdOrCtrl && e.key.toLowerCase() === 'n') {
      e.preventDefault();
      if (typeof createNewDocument === 'function') {
        createNewDocument();
      }
    }

    if (cmdOrCtrl && e.key.toLowerCase() === 'o') {
      e.preventDefault();
      if (typeof openFile === 'function') {
        openFile();
      }
    }

    if (cmdOrCtrl && !e.shiftKey && e.key.toLowerCase() === 's') {
      e.preventDefault();
      if (typeof saveToLocalStorage === 'function') {
        saveToLocalStorage();
      }
    }

    if (cmdOrCtrl && e.shiftKey && e.key.toLowerCase() === 's') {
      e.preventDefault();
      if (typeof saveAsMarkdownFile === 'function') {
        saveAsMarkdownFile("document.md");
      }
    }

    if (cmdOrCtrl && e.key.toLowerCase() === 'w') {
      e.preventDefault();
      if (typeof confirmAndCloseApplication === 'function') {
        confirmAndCloseApplication();
      }
    }
  });
});
