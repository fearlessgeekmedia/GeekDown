document.addEventListener("DOMContentLoaded", function () {
  const saveBtn = document.getElementById("save");
  const saveAsBtn = document.getElementById("save_as");

  if (saveBtn) {
    saveBtn.addEventListener("click", function (e) {
      e.preventDefault();
      console.log("File > Save clicked");
      saveToLocalStorage();
    });
  }

  if (saveAsBtn) {
    saveAsBtn.addEventListener("click", function (e) {
      e.preventDefault();
      console.log("File > Save As clicked");
      saveAsMarkdownFile();
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

function saveAsMarkdownFile(defaultFilename = "document.md") {
  const markdown = extractMarkdownFromEditor();
  if (!markdown) return;
  
  const blob = new Blob([markdown], { type: "text/markdown" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = defaultFilename;
  link.click();
}

function extractMarkdownFromEditor() {
  const crepeInstance = window.crepeInstance;
  return crepeInstance ? crepeInstance.getMarkdown() : null;
}
