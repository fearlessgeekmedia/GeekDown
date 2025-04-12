import { Crepe } from "@milkdown/crepe";

function toggleEditorMode(crepe, menuItem) {
  console.log("toggleEditorMode called"); // Debug: Function entry point
  console.log("Current menu item text:", menuItem.textContent);

  const markdownView = document.getElementById("markdown-view");

  if (markdownView) {
    console.log("Markdown view detected. Switching to WYSIWYG mode...");

    // Get the updated Markdown content from the textarea
    const markdown = markdownView.value;
    console.log("Markdown content from textarea:", markdown);

    // Remove the Markdown textarea
    markdownView.remove();
    console.log("Markdown textarea removed");

    // Clear the #app element
    const appDiv = document.getElementById("app");
    if (appDiv) {
      appDiv.innerHTML = ""; // Clear the editor container
      console.log("#app container cleared");
    }

    // Destroy the current editor instance and recreate it
    crepe
      .destroy()
      .then(() => {
        console.log("Crepe instance destroyed");

        // Recreate the editor with the updated Markdown content
        const newCrepe = new Crepe({
          root: "#app",
          defaultValue: markdown, // Pass the updated Markdown content
        });

        window.crepeInstance = newCrepe; // Update the global instance

        return newCrepe.create();
      })
      .then(() => {
        console.log("Switched back to WYSIWYG mode with updated content");
        menuItem.textContent = "Switch to Markdown Mode";
      })
      .catch((err) => {
        console.error("Error switching back to WYSIWYG mode:", err);
      });
  } else {
    console.log("No Markdown view detected. Switching to Markdown code mode...");

    // Get the current Markdown content from the editor
    const markdown = crepe.getMarkdown();
    console.log("Markdown content retrieved from editor:", markdown);

    if (!markdown) {
      console.error("Failed to retrieve Markdown content from the editor");
      return;
    }

    // Create a textarea for Markdown editing
    const textarea = document.createElement("textarea");
    textarea.id = "markdown-view";
    textarea.value = markdown;
    textarea.style.position = "absolute";
    textarea.style.top = "50px";
    textarea.style.left = "10px";
    textarea.style.width = "calc(100% - 20px)";
    textarea.style.height = "calc(100% - 60px)";
    textarea.style.padding = "10px";
    textarea.style.border = "1px solid #ccc";
    textarea.style.borderRadius = "5px";
    textarea.style.fontFamily = "monospace";
    textarea.style.fontSize = "16px";
    textarea.style.backgroundColor = "#f9f9f9";
    textarea.style.color = "#333";
    document.body.appendChild(textarea);

    console.log("Markdown textarea created and appended to the DOM");

    menuItem.textContent = "Switch to WYSIWYG Mode";
    console.log("Switched to Markdown code mode");
  }
}


document.addEventListener("DOMContentLoaded", function () {
  const toggleModeBtn = document.getElementById("toggle-mode");
  console.log("Toggle Mode Button:", toggleModeBtn); // Debug: Check if the button exists

  if (toggleModeBtn) {
    toggleModeBtn.addEventListener("click", function (e) {
      e.preventDefault();
      console.log("Toggle Mode Button Clicked"); // Debug: Check if the click event is triggered
      toggleEditorMode(window.crepeInstance, toggleModeBtn);
    });
    console.log("Event listener added to Toggle Mode Button"); // Debug: Confirm listener is added
  } else {
    console.error("Toggle Mode Button not found in the DOM");
  }
});
