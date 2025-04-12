import { Crepe } from "@milkdown/crepe";
import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/frame.css";

const contentToLoad =
  localStorage.getItem("geekdown-content-to-load") || "# Hello, Milkdown!";

const crepe = new Crepe({
  root: "#app",
  defaultValue: contentToLoad,
});

crepe.create()
  .then(() => {
    console.log("Milkdown is ready!");
    (window as any).crepeInstance = crepe; // Expose the Crepe instance globally
  })
  .catch((err) => {
    console.error("Error initializing Milkdown:", err);
  });
