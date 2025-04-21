import { Crepe } from "@milkdown/crepe";
import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/frame.css";

const contentToLoad =
  localStorage.getItem("geekdown-content-to-load") || "# Hello, GeekDown user!";

const crepe = new Crepe({
  root: "#app",
  defaultValue: contentToLoad,
});

// Apply font settings after editor initialization
crepe.create()
  .then(() => {
    console.log("Milkdown is ready!");
    (window as any).crepeInstance = crepe; // Expose the Crepe instance globally
    
    // Apply font settings after editor is initialized
    if (typeof window.applyFontSettings === 'function') {
      window.applyFontSettings();
    }
  })
  .catch((err) => {
    console.error("Error initializing Milkdown:", err);
  });
