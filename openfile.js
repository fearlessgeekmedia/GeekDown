document.addEventListener("DOMContentLoaded", function () {
  const openBtn = document.getElementById("open");
  if (openBtn) {
    openBtn.addEventListener("click", function (e) {
      e.preventDefault();
      openFile();
    });
  }
});

function openFile() {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ".md,.markdown,.txt";
  fileInput.style.display = "none";
  document.body.appendChild(fileInput);

  fileInput.addEventListener("change", function () {
    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      const reader = new FileReader();

      reader.onload = function (e) {
        const content = e.target.result;
        localStorage.setItem("geekdown-content-to-load", content);
        localStorage.setItem("geekdown-filename", file.name);
        window.location.reload();
      };

      reader.readAsText(file);
    }
    document.body.removeChild(fileInput);
  });

  fileInput.click();
}

