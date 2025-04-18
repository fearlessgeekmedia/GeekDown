document.addEventListener("DOMContentLoaded", function() {
  // Register event listeners for shortcuts
  if (window.electronAPI) {
    window.electronAPI.onNew(() => {
      if (typeof createNewDocument === 'function') {
        createNewDocument();
      }
    });

    window.electronAPI.onOpen(() => {
      if (typeof openFile === 'function') {
        openFile();
      }
    });

    window.electronAPI.onSave(() => {
      if (typeof saveToLocalStorage === 'function') {
        saveToLocalStorage();
      }
    });

    window.electronAPI.onSaveAs(() => {
      if (typeof saveAsMarkdownFile === 'function') {
        saveAsMarkdownFile("document.md");
      }
    });

    window.electronAPI.onClose(() => {
      if (typeof confirmAndCloseApplication === 'function') {
        confirmAndCloseApplication();
      }
    });
  }

  // Also keep browser shortcuts for development
  document.addEventListener("keydown", function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      return;
    }

    const cmdOrCtrl = e.ctrlKey || e.metaKey;

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
