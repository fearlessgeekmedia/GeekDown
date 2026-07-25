document.addEventListener("DOMContentLoaded", function () {
  const openBtn = document.getElementById("open");
  console.log('openfile.js: DOM loaded, openBtn: ' + !!openBtn);
  if (openBtn) {
    openBtn.addEventListener("click", function (e) {
      e.preventDefault();
      console.log('openfile.js: Open button clicked');
      openFile();
    });
  }
});

function waitForTauriHost() {
  return new Promise((resolve) => {
    console.log('openfile.js: waitForTauriHost, current state: ' + typeof window.tauriHost);
    if (window.tauriHost && window.tauriHost._ready) {
      console.log('openfile.js: tauriHost already available and ready');
      resolve(true);
      return;
    }

    const checkReady = () => {
      if (window.tauriHost && window.tauriHost._ready) {
        console.log('openfile.js: tauriHost now ready');
        resolve(true);
      }
    };
    window.addEventListener('tauriHostReady', checkReady);

    let attempts = 0;
    const poll = setInterval(() => {
      if (window.tauriHost && window.tauriHost._ready) {
        clearInterval(poll);
        console.log('openfile.js: tauriHost now available and ready');
        resolve(true);
      } else if (attempts++ > 100) {
        clearInterval(poll);
        console.error('openfile.js: tauriHost not available after polling');
        resolve(false);
      }
    }, 100);
  });
}

async function openFile() {
  console.log('openfile.js: openFile() called');
  try {
    const ready = await waitForTauriHost();
    if (!ready) {
      alert("Tauri host not available - check terminal for logs");
      return;
    }

    console.log('openfile.js: calling tauriHost.showOpenDialog');
    const result = await window.tauriHost.showOpenDialog();
    console.log('openfile.js: showOpenDialog result: ' + result);
    if (result) {
      localStorage.setItem("geekdown-content-to-load", result.content);
      localStorage.setItem("geekdown-filename", result.filename);
      window.location.reload();
    }
  } catch (err) {
    alert("Open failed: " + err);
    console.error("Open failed:", err);
  }
}

function extractMarkdownFromEditor() {
  const crepeInstance = window.crepeInstance;
  return crepeInstance ? crepeInstance.getMarkdown() : null;
}