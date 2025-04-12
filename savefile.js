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
      showFilenameDialog();
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

function showFilenameDialog() {
  const dialog = document.createElement("div");
  dialog.style.position = "fixed";
  dialog.style.top = "0";
  dialog.style.left = "0";
  dialog.style.width = "100%";
  dialog.style.height = "100%";
  dialog.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  dialog.style.display = "flex";
  dialog.style.justifyContent = "center";
  dialog.style.alignItems = "center";

  const dialogContent = document.createElement("div");
  dialogContent.style.backgroundColor = "#fff";
  dialogContent.style.padding = "20px";
  dialogContent.style.borderRadius = "5px";
  dialogContent.style.textAlign = "center";

  const input = document.createElement("input");
  input.type = "text";
  input.value = "document.md";
  input.style.width = "100%";
  input.style.marginBottom = "20px";
  dialogContent.appendChild(input);

  const saveButton = document.createElement("button");
  saveButton.textContent = "Save";
  saveButton.addEventListener("click", function () {
    saveAsMarkdownFile(input.value.trim());
    document.body.removeChild(dialog);
  });

  dialogContent.appendChild(saveButton);
  dialog.appendChild(dialogContent);
  document.body.appendChild(dialog);
}

function saveAsMarkdownFile(filename) {
  const markdown = extractMarkdownFromEditor();
  const blob = new Blob([markdown], { type: "text/markdown" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

function extractMarkdownFromEditor() {
  const crepeInstance = window.crepeInstance;
  return crepeInstance ? crepeInstance.getMarkdown() : null;
}

