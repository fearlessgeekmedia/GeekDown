document.addEventListener("DOMContentLoaded", function () {
  const closeBtn = document.getElementById("close");
  console.log('closefile.js: DOM loaded, closeBtn: ' + !!closeBtn);
  if (closeBtn) {
    closeBtn.addEventListener("click", function (e) {
      e.preventDefault();
      console.log('closefile.js: Close button clicked');
      confirmAndCloseApplication();
    });
  }
});

function waitForTauriHost() {
  console.log('closefile.js: waitForTauriHost, tauriHost type: ' + typeof window.tauriHost);
  return new Promise((resolve) => {
    if (window.tauriHost && window.tauriHost._ready) {
      console.log('closefile.js: tauriHost already ready');
      resolve(true);
      return;
    }

    const checkReady = () => {
      if (window.tauriHost && window.tauriHost._ready) {
        console.log('closefile.js: tauriHost now ready');
        resolve(true);
      }
    };
    window.addEventListener('tauriHostReady', checkReady);

    let attempts = 0;
    const poll = setInterval(() => {
      if (window.tauriHost && window.tauriHost._ready) {
        clearInterval(poll);
        console.log('closefile.js: tauriHost now available and ready');
        resolve(true);
      } else if (attempts++ > 50) {
        clearInterval(poll);
        console.error('closefile.js: tauriHost timeout');
        resolve(false);
      }
    }, 100);
  });
}

async function confirmAndCloseApplication() {
  console.log('closefile.js: confirmAndCloseApplication');
  const shouldClose = confirm("Close the application?");
  if (!shouldClose) return;

  try {
    const ready = await waitForTauriHost();
    if (ready && window.tauriHost) {
      window.tauriHost.closeApplication();
    } else {
      console.error('closefile.js: tauriHost not available');
      alert("Tauri host not available");
    }
  } catch (err) {
    console.error('closefile.js error:', err);
  }
}