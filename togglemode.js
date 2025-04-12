function toggleEditorMode(crepe, menuItem) {
  const markdownView = document.getElementById("markdown-view");

  if (markdownView) {
    // Switch back to WYSIWYG mode
    const markdown = markdownView.value; // Get the updated Markdown content
    markdownView.remove(); // Remove the Markdown textarea

    console.log("Markdown content being applied:", markdown);

    // Clear the #app element
    const appDiv = document.getElementById("app");
    if (appDiv) {
      appDiv.innerHTML = ""; // Clear the editor container
    }

    // Destroy the current editor instance and recreate it
    crepe.destroy().then(() => {
      console.log("Crepe instance destroyed");

      const newCrepe = new Crepe({
        root: "#app",
        defaultValue: markdown, // Pass the updated Markdown content
      });

      window.crepeInstance = newCrepe;

      return newCrepe.create();
    }).then(() => {
      console.log("Switched back to WYSIWYG mode with updated content");
      menuItem.textContent = "Switch to Markdown Mode";
    }).catch((err) => {
      console.error("Error switching back to WYSIWYG mode:", err);
    });
  } else {
    // Switch to Markdown code mode
    const markdown = crepe.getMarkdown(); // Get the current Markdown content

    console.log("Markdown content retrieved:", markdown);

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

    menuItem.textContent = "Switch to WYSIWYG Mode";
    console.log("Switched to Markdown code mode");
  }
}
