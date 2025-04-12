document.addEventListener("DOMContentLoaded", function () {
  const newBtn = document.getElementById("new");
  if (newBtn) {
    newBtn.addEventListener("click", function (e) {
      e.preventDefault();
      console.log("File > New clicked");
      createNewDocument();
    });
  }
});

function createNewDocument() {
  localStorage.setItem("geekdown-content-to-load", "# New Document");
  localStorage.removeItem("geekdown-filename");
  window.location.reload();
}
