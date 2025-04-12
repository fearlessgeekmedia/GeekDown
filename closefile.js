document.addEventListener("DOMContentLoaded", function () {
  const closeBtn = document.getElementById("close");
  if (closeBtn) {
    closeBtn.addEventListener("click", function (e) {
      e.preventDefault();
      console.log("File > Close clicked");
      confirmAndCloseApplication();
    });
    console.log("Close button listener added");
  } else {
    console.error("Close button not found");
  }
});

function confirmAndCloseApplication() {
  // Create the dialog container
  const dialog = document.createElement("div");
  dialog.id = "close-confirmation-dialog";
  dialog.style.position = "fixed";
  dialog.style.top = "0";
  dialog.style.left = "0";
  dialog.style.width = "100%";
  dialog.style.height = "100%";
  dialog.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  dialog.style.zIndex = "9999";
  dialog.style.display = "flex";
  dialog.style.justifyContent = "center";
  dialog.style.alignItems = "center";

  // Create the dialog content
  const dialogContent = document.createElement("div");
  dialogContent.style.backgroundColor = "#fff";
  dialogContent.style.padding = "20px";
  dialogContent.style.borderRadius = "5px";
  dialogContent.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
  dialogContent.style.textAlign = "center";
  dialogContent.style.maxWidth = "400px";

  // Add the title
  const title = document.createElement("h3");
  title.textContent = "Close GeekDown";
  title.style.marginTop = "0";
  dialogContent.appendChild(title);

  // Add the message
  const message = document.createElement("p");
  message.textContent = "Are you sure you want to close the application? Any unsaved changes will be lost.";
  dialogContent.appendChild(message);

  // Add the buttons
  const buttonContainer = document.createElement("div");
  buttonContainer.style.display = "flex";
  buttonContainer.style.justifyContent = "space-between";
  buttonContainer.style.marginTop = "20px";

  const cancelButton = document.createElement("button");
  cancelButton.textContent = "Cancel";
  cancelButton.style.padding = "10px 20px";
  cancelButton.style.border = "none";
  cancelButton.style.borderRadius = "5px";
  cancelButton.style.backgroundColor = "#f44336";
  cancelButton.style.color = "#fff";
  cancelButton.style.cursor = "pointer";
  cancelButton.addEventListener("click", function () {
    document.body.removeChild(dialog);
  });

  const closeButton = document.createElement("button");
  closeButton.textContent = "Close Application";
  closeButton.style.padding = "10px 20px";
  closeButton.style.border = "none";
  closeButton.style.borderRadius = "5px";
  closeButton.style.backgroundColor = "#4CAF50";
  closeButton.style.color = "#fff";
  closeButton.style.cursor = "pointer";
  closeButton.addEventListener("click", function () {
    closeApplication();
    document.body.removeChild(dialog);
  });

  buttonContainer.appendChild(cancelButton);
  buttonContainer.appendChild(closeButton);
  dialogContent.appendChild(buttonContainer);

  dialog.appendChild(dialogContent);
  document.body.appendChild(dialog);
}

function closeApplication() {
  console.log("Closing application");

  // Use the Electron API to send the close event to the main process
  if (window.electronAPI && window.electronAPI.closeApplication) {
    console.log("Using Electron IPC to close the application");
    window.electronAPI.closeApplication();
  } else {
    console.error("Electron API not available");
    window.close(); // Fallback for non-Electron environments
  }
}
