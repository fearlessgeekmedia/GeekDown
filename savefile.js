document.addEventListener("DOMContentLoaded", function () {
  const saveBtn = document.getElementById("save");
  const saveAsBtn = document.getElementById("save_as");

  if (saveBtn) {
    saveBtn.addEventListener("click", function (e) {
      e.preventDefault();
      saveToLocalStorage();
    });
  }

  if (saveAsBtn) {
    saveAsBtn.addEventListener("click", async function (e) {
      e.preventDefault();
      await saveAsMarkdownFile();
    });
  }
});

function saveToLocalStorage() {
  const markdown = extractMarkdownFromEditor();
  if (markdown) {
    localStorage.setItem("geekdown-content", markdown);
    alert("Content saved to browser storage!");
  }
}

function waitForTauriHost() {
  return new Promise((resolve) => {
    if (window.tauriHost && window.tauriHost._ready) {
      resolve(true);
      return;
    }

    const checkReady = () => {
      if (window.tauriHost && window.tauriHost._ready) {
        resolve(true);
      }
    };
    window.addEventListener('tauriHostReady', checkReady);

    let attempts = 0;
    const poll = setInterval(() => {
      if (window.tauriHost && window.tauriHost._ready) {
        clearInterval(poll);
        resolve(true);
      } else if (attempts++ > 100) {
        clearInterval(poll);
        resolve(false);
      }
    }, 100);
  });
}

async function saveAsMarkdownFile(defaultFilename = "document.md") {
  const markdown = extractMarkdownFromEditor();
  if (!markdown) return;

  try {
    const ready = await waitForTauriHost();
    if (!ready || !window.tauriHost) {
      alert("Tauri host not available");
      return;
    }

    const filename = localStorage.getItem("geekdown-filename");
    const result = await window.tauriHost.showSaveDialog(filename ? filename : defaultFilename, markdown);
    if (result) alert(result);
  } catch (err) {
    alert("Save As failed: " + err);
    console.error("Save As failed:", err);
  }
}

function extractMarkdownFromEditor() {
  const crepeInstance = window.crepeInstance;
  return crepeInstance ? crepeInstance.getMarkdown() : null;
}