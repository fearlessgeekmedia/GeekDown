document.addEventListener("DOMContentLoaded", function () {
  const viewModeSettingsBtn = document.getElementById("settings-view-mode");
  
  if (viewModeSettingsBtn) {
    viewModeSettingsBtn.addEventListener("click", function (e) {
      e.preventDefault();
      console.log("View mode settings clicked");
      showViewModeSettingsModal();
    });
  }
  
  // Apply saved view mode settings on load
  setTimeout(() => {
    applyViewModeSettings();
  }, 500);
});

function showViewModeSettingsModal() {
  // Get current settings
  const currentSettings = getViewModeSettings();
  
  // Create modal container
  const modal = document.createElement("div");
  modal.id = "view-mode-settings-modal";
  modal.className = "w3-modal";
  modal.style.display = "block";
  
  // Create modal content
  const modalContent = document.createElement("div");
  modalContent.className = "w3-modal-content w3-card-4 w3-animate-zoom";
  modalContent.style.maxWidth = "500px";
  
  // Create header
  const header = document.createElement("header");
  header.className = "w3-container w3-green";
  
  const closeSpan = document.createElement("span");
  closeSpan.innerHTML = "&times;";
  closeSpan.className = "w3-button w3-display-topright";
  closeSpan.onclick = function() {
    document.body.removeChild(modal);
  };
  
  const headerTitle = document.createElement("h2");
  headerTitle.textContent = "View Mode Settings";
  
  header.appendChild(closeSpan);
  header.appendChild(headerTitle);
  
  // Create form container
  const formContainer = document.createElement("div");
  formContainer.className = "w3-container w3-padding";
  
  // View Mode Selection
  const viewModeGroup = document.createElement("div");
  viewModeGroup.className = "w3-margin-bottom";
  
  const viewModeLabel = document.createElement("label");
  viewModeLabel.textContent = "View Mode:";
  viewModeLabel.className = "w3-text-dark-grey";
  viewModeLabel.style.display = "block";
  viewModeLabel.style.marginBottom = "12px";
  viewModeLabel.style.fontWeight = "bold";
  
  // Switch Mode Option
  const switchModeDiv = document.createElement("div");
  switchModeDiv.className = "w3-margin-bottom";
  
  const switchModeRadio = document.createElement("input");
  switchModeRadio.type = "radio";
  switchModeRadio.id = "switch-mode";
  switchModeRadio.name = "viewMode";
  switchModeRadio.value = "switch";
  switchModeRadio.className = "w3-radio";
  if (currentSettings.mode === "switch") {
    switchModeRadio.checked = true;
  }
  
  const switchModeLabel = document.createElement("label");
  switchModeLabel.htmlFor = "switch-mode";
  switchModeLabel.className = "w3-margin-left";
  switchModeLabel.innerHTML = "<strong>Switch Mode</strong><br><small class='w3-text-grey'>Toggle between WYSIWYG and Markdown views (current behavior)</small>";
  
  switchModeDiv.appendChild(switchModeRadio);
  switchModeDiv.appendChild(switchModeLabel);
  
  // Side-by-Side Mode Option
  const sideBySideDiv = document.createElement("div");
  sideBySideDiv.className = "w3-margin-bottom";
  
  const sideBySideRadio = document.createElement("input");
  sideBySideRadio.type = "radio";
  sideBySideRadio.id = "side-by-side-mode";
  sideBySideRadio.name = "viewMode";
  sideBySideRadio.value = "sideBySide";
  sideBySideRadio.className = "w3-radio";
  if (currentSettings.mode === "sideBySide") {
    sideBySideRadio.checked = true;
  }
  
  const sideBySideLabel = document.createElement("label");
  sideBySideLabel.htmlFor = "side-by-side-mode";
  sideBySideLabel.className = "w3-margin-left";
  sideBySideLabel.innerHTML = "<strong>Side-by-Side Mode</strong><br><small class='w3-text-grey'>Show WYSIWYG and Markdown views simultaneously with resizable divider</small>";
  
  sideBySideDiv.appendChild(sideBySideRadio);
  sideBySideDiv.appendChild(sideBySideLabel);
  
  // Split Ratio Setting (only shown for side-by-side mode)
  const splitRatioGroup = document.createElement("div");
  splitRatioGroup.className = "w3-margin-top";
  splitRatioGroup.id = "split-ratio-group";
  splitRatioGroup.style.display = currentSettings.mode === "sideBySide" ? "block" : "none";
  
  const splitRatioLabel = document.createElement("label");
  splitRatioLabel.textContent = "Default Split Ratio:";
  splitRatioLabel.className = "w3-text-dark-grey";
  splitRatioLabel.style.display = "block";
  splitRatioLabel.style.marginBottom = "8px";
  
  const splitRatioSlider = document.createElement("input");
  splitRatioSlider.type = "range";
  splitRatioSlider.id = "split-ratio-slider";
  splitRatioSlider.min = "20";
  splitRatioSlider.max = "80";
  splitRatioSlider.value = Math.round(currentSettings.splitRatio * 100);
  splitRatioSlider.className = "w3-border";
  splitRatioSlider.style.width = "100%";
  
  const splitRatioValue = document.createElement("span");
  splitRatioValue.id = "split-ratio-value";
  splitRatioValue.className = "w3-text-grey";
  splitRatioValue.textContent = `WYSIWYG: ${Math.round(currentSettings.splitRatio * 100)}% | Markdown: ${Math.round((1 - currentSettings.splitRatio) * 100)}%`;
  
  splitRatioSlider.addEventListener("input", function() {
    const ratio = this.value / 100;
    splitRatioValue.textContent = `WYSIWYG: ${this.value}% | Markdown: ${100 - this.value}%`;
  });
  
  splitRatioGroup.appendChild(splitRatioLabel);
  splitRatioGroup.appendChild(splitRatioSlider);
  splitRatioGroup.appendChild(document.createElement("br"));
  splitRatioGroup.appendChild(splitRatioValue);
  
  // Show/hide split ratio based on mode selection
  switchModeRadio.addEventListener("change", function() {
    if (this.checked) {
      splitRatioGroup.style.display = "none";
    }
  });
  
  sideBySideRadio.addEventListener("change", function() {
    if (this.checked) {
      splitRatioGroup.style.display = "block";
    }
  });
  
  viewModeGroup.appendChild(viewModeLabel);
  viewModeGroup.appendChild(switchModeDiv);
  viewModeGroup.appendChild(sideBySideDiv);
  viewModeGroup.appendChild(splitRatioGroup);
  
  // Buttons
  const buttonGroup = document.createElement("div");
  buttonGroup.className = "w3-container w3-border-top w3-padding-16 w3-light-grey";
  
  const cancelButton = document.createElement("button");
  cancelButton.className = "w3-button w3-red";
  cancelButton.textContent = "Cancel";
  cancelButton.onclick = function() {
    document.body.removeChild(modal);
  };
  
  const applyButton = document.createElement("button");
  applyButton.className = "w3-button w3-green w3-right";
  applyButton.textContent = "Apply";
  applyButton.onclick = function() {
    const selectedMode = document.querySelector('input[name="viewMode"]:checked').value;
    const splitRatio = splitRatioSlider.value / 100;
    
    const settings = {
      mode: selectedMode,
      splitRatio: splitRatio
    };
    
    saveViewModeSettings(settings);
    applyViewModeSettings();
    document.body.removeChild(modal);
  };
  
  buttonGroup.appendChild(cancelButton);
  buttonGroup.appendChild(applyButton);
  
  // Assemble modal
  formContainer.appendChild(viewModeGroup);
  
  modalContent.appendChild(header);
  modalContent.appendChild(formContainer);
  modalContent.appendChild(buttonGroup);
  
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
}

function getViewModeSettings() {
  // Get settings from localStorage or use defaults
  const defaultSettings = {
    mode: "switch", // "switch" or "sideBySide"
    splitRatio: 0.5 // 0.5 means 50/50 split
  };
  
  const savedSettings = localStorage.getItem("geekdown-view-mode-settings");
  return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
}

function saveViewModeSettings(settings) {
  localStorage.setItem("geekdown-view-mode-settings", JSON.stringify(settings));
}

function applyViewModeSettings() {
  const settings = getViewModeSettings();
  console.log("Applying view mode settings:", settings);
  
  // Store settings globally for access by other modules
  window.viewModeSettings = settings;
  
  // Check if we're currently in side-by-side mode
  const isCurrentlyInSideBySide = document.getElementById("side-by-side-container") !== null;
  
  if (settings.mode === "sideBySide") {
    // If we should be in side-by-side mode but aren't, initialize it
    if (!isCurrentlyInSideBySide) {
      const markdownView = document.getElementById("markdown-view");
      if (!markdownView) {
        initializeSideBySideMode();
      }
    }
  } else if (settings.mode === "switch") {
    // If we should be in switch mode but are currently in side-by-side mode, exit it
    if (isCurrentlyInSideBySide) {
      exitSideBySideMode();
    }
  }
}

function initializeSideBySideMode() {
  const settings = getViewModeSettings();
  const appContainer = document.getElementById("app");
  const parentContainer = appContainer.parentElement;
  
  // Create side-by-side container
  const sideBySideContainer = document.createElement("div");
  sideBySideContainer.id = "side-by-side-container";
  sideBySideContainer.style.display = "flex";
  sideBySideContainer.style.height = "calc(100vh - 100px)";
  sideBySideContainer.style.width = "100%";
  
  // Create WYSIWYG container
  const wysiwygContainer = document.createElement("div");
  wysiwygContainer.id = "wysiwyg-container";
  wysiwygContainer.style.width = `${settings.splitRatio * 100}%`;
  wysiwygContainer.style.height = "100%";
  wysiwygContainer.style.overflow = "auto";
  wysiwygContainer.style.borderRight = "1px solid #ccc";
  
  // Create resizer
  const resizer = document.createElement("div");
  resizer.id = "view-resizer";
  resizer.style.width = "5px";
  resizer.style.height = "100%";
  resizer.style.backgroundColor = "#ddd";
  resizer.style.cursor = "col-resize";
  resizer.style.userSelect = "none";
  
  // Create markdown container
  const markdownContainer = document.createElement("div");
  markdownContainer.id = "markdown-container";
  markdownContainer.style.width = `${(1 - settings.splitRatio) * 100}%`;
  markdownContainer.style.height = "100%";
  markdownContainer.style.overflow = "auto";
  
  // Move existing app content to WYSIWYG container
  wysiwygContainer.appendChild(appContainer);
  
  // Create markdown textarea
  const markdownTextarea = document.createElement("textarea");
  markdownTextarea.id = "markdown-view-sidebyside";
  markdownTextarea.style.width = "100%";
  markdownTextarea.style.height = "100%";
  markdownTextarea.style.border = "none";
  markdownTextarea.style.outline = "none";
  markdownTextarea.style.padding = "10px";
  markdownTextarea.style.fontFamily = "monospace";
  markdownTextarea.style.fontSize = "14px";
  markdownTextarea.style.backgroundColor = "#f9f9f9";
  markdownTextarea.style.color = "#333";
  markdownTextarea.style.resize = "none";
  
  // Get initial content from the editor
  if (window.crepeInstance) {
    const markdown = window.crepeInstance.getMarkdown();
    markdownTextarea.value = markdown || '';
  }
  
  markdownContainer.appendChild(markdownTextarea);
  
  // Assemble side-by-side container
  sideBySideContainer.appendChild(wysiwygContainer);
  sideBySideContainer.appendChild(resizer);
  sideBySideContainer.appendChild(markdownContainer);
  
  // Replace the original container
  parentContainer.appendChild(sideBySideContainer);
  
  // Set up resizer functionality
  setupResizer(resizer, wysiwygContainer, markdownContainer);
  
  // Set up synchronization between views
  setupViewSynchronization(markdownTextarea);
  
  // Update toggle button text
  const toggleBtn = document.getElementById("toggle-mode");
  if (toggleBtn) {
    toggleBtn.textContent = "Switch to Single View Mode";
  }
}

function setupResizer(resizer, leftPanel, rightPanel) {
  let isResizing = false;
  
  resizer.addEventListener('mousedown', function(e) {
    isResizing = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    e.preventDefault();
  });
  
  function handleMouseMove(e) {
    if (!isResizing) return;
    
    const container = document.getElementById("side-by-side-container");
    const containerRect = container.getBoundingClientRect();
    const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    
    // Constrain between 20% and 80%
    const constrainedWidth = Math.max(20, Math.min(80, newLeftWidth));
    
    leftPanel.style.width = `${constrainedWidth}%`;
    rightPanel.style.width = `${100 - constrainedWidth}%`;
    
    // Save the new ratio
    const settings = getViewModeSettings();
    settings.splitRatio = constrainedWidth / 100;
    saveViewModeSettings(settings);
  }
  
  function handleMouseUp() {
    isResizing = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }
}

function setupViewSynchronization(markdownTextarea) {
  let isUpdating = false;
  
  // Update markdown when WYSIWYG changes
  if (window.crepeInstance) {
    // Set up a periodic sync (since Milkdown doesn't have a direct change event)
    setInterval(() => {
      if (!isUpdating && window.crepeInstance) {
        const currentMarkdown = window.crepeInstance.getMarkdown();
        if (currentMarkdown !== markdownTextarea.value) {
          isUpdating = true;
          markdownTextarea.value = currentMarkdown;
          setTimeout(() => { isUpdating = false; }, 100);
        }
      }
    }, 1000);
  }
  
  // Update WYSIWYG when markdown changes
  markdownTextarea.addEventListener('input', function() {
    if (!isUpdating && window.crepeInstance) {
      isUpdating = true;
      const markdown = this.value;
      
      // Update the WYSIWYG editor
      window.crepeInstance.destroy().then(() => {
        // Import Crepe dynamically or use the global reference
        const CrepeClass = window.Crepe || (window.milkdown && window.milkdown.Crepe);
        if (!CrepeClass) {
          console.error('Crepe class not available');
          isUpdating = false;
          return;
        }
        
        const newCrepe = new CrepeClass({
          root: '#app',
          defaultValue: markdown,
        });
        
        return newCrepe.create().then(() => {
          window.crepeInstance = newCrepe;
          setTimeout(() => { isUpdating = false; }, 100);
        });
      }).catch((err) => {
        console.error('Error updating WYSIWYG view:', err);
        isUpdating = false;
      });
    }
  });
}

function exitSideBySideMode() {
  const sideBySideContainer = document.getElementById("side-by-side-container");
  if (sideBySideContainer) {
    const appContainer = document.getElementById("app");
    const parentContainer = sideBySideContainer.parentElement;
    
    // Move app container back to its original position
    parentContainer.appendChild(appContainer);
    
    // Remove side-by-side container
    sideBySideContainer.remove();
    
    // Update toggle button text
    const toggleBtn = document.getElementById("toggle-mode");
    if (toggleBtn) {
      toggleBtn.textContent = "Switch to Markdown Mode";
    }
  }
}

// Export functions for use by other modules
window.getViewModeSettings = getViewModeSettings;
window.saveViewModeSettings = saveViewModeSettings;
window.applyViewModeSettings = applyViewModeSettings;
window.initializeSideBySideMode = initializeSideBySideMode;
window.exitSideBySideMode = exitSideBySideMode;
