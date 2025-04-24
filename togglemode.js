import { Crepe } from "@milkdown/crepe";

function toggleEditorMode(crepe, menuItem) {
  console.log("toggleEditorMode called");
  console.log("Current menu item text:", menuItem.textContent);

  const markdownView = document.getElementById("markdown-view");

  if (markdownView) {
    console.log("Markdown view detected. Switching to WYSIWYG mode...");

    let markdown = markdownView.value;
    console.log("Markdown content from textarea:", markdown);

    markdownView.remove();
    console.log("Markdown textarea removed");

    const appDiv = document.getElementById("app");
    if (appDiv) {
      appDiv.innerHTML = "";
      console.log("#app container cleared");
    }

    crepe
      .destroy()
      .then(() => {
        console.log("Crepe instance destroyed");

        const newCrepe = new Crepe({
          root: "#app",
          defaultValue: markdown,
        });

        window.crepeInstance = newCrepe;

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

    // Get raw markdown directly from the editor
    let markdown = crepe.getMarkdown();
    console.log("Markdown content retrieved from editor:", markdown);

    if (!markdown) {
      console.error("Failed to retrieve Markdown content from the editor");
      return;
    }

    // Clean up unwanted <br /> tags in tables and other elements
    markdown = cleanupMarkdown(markdown);

    // Create the textarea for editing raw markdown
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

// Helper function to clean up unwanted <br /> tags and other issues
function cleanupMarkdown(markdown) {
  console.log("Cleaning up markdown...");
  
  // Remove <br /> tags from table cells
  markdown = markdown.replace(/\|\s*<br \/>\s*\|/g, '| |');
  markdown = markdown.replace(/\|\s*<br \/>\s*$/gm, '| ');
  markdown = markdown.replace(/^\s*<br \/>\s*\|/gm, '| ');
  
  // Remove standalone <br /> tags
  markdown = markdown.replace(/^\s*<br \/>\s*$/gm, '');
  
  // Fix any table formatting issues
  const tableRegex = /(\|[^\n]*\|)(\s*<br \/>)*/g;
  markdown = markdown.replace(tableRegex, (match, tableLine) => {
    return tableLine;
  });
  
  // General cleanup of any remaining <br /> tags
  markdown = markdown.replace(/<br \/>/g, '');
  
  console.log("Cleaned markdown:", markdown);
  return markdown;
}

document.addEventListener("DOMContentLoaded", function () {
  const toggleModeBtn = document.getElementById("toggle-mode");
  console.log("Toggle Mode Button:", toggleModeBtn);

  if (toggleModeBtn) {
    toggleModeBtn.addEventListener("click", function (e) {
      e.preventDefault();
      console.log("Toggle Mode Button Clicked");
      toggleEditorMode(window.crepeInstance, toggleModeBtn);
    });
    console.log("Event listener added to Toggle Mode Button");
  } else {
    console.error("Toggle Mode Button not found in the DOM");
  }
});
