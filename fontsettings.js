document.addEventListener("DOMContentLoaded", function () {
  const fontSettingsBtn = document.getElementById("settings-font");
  
  if (fontSettingsBtn) {
    fontSettingsBtn.addEventListener("click", function (e) {
      e.preventDefault();
      console.log("Font settings clicked");
      showFontSettingsModal();
    });
  }
  
  // Apply saved font settings after a short delay to ensure the editor is fully loaded
  setTimeout(() => {
    applyFontSettings();
  }, 500);
});

function showFontSettingsModal() {
  // Get current settings
  const currentSettings = getFontSettings();
  
  // Create modal container
  const modal = document.createElement("div");
  modal.id = "font-settings-modal";
  modal.className = "w3-modal";
  modal.style.display = "block";
  
  // Create modal content
  const modalContent = document.createElement("div");
  modalContent.className = "w3-modal-content w3-card-4 w3-animate-zoom";
  modalContent.style.maxWidth = "600px";
  
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
  headerTitle.textContent = "Font Settings";
  
  header.appendChild(closeSpan);
  header.appendChild(headerTitle);
  
  // Create form container
  const formContainer = document.createElement("div");
  formContainer.className = "w3-container w3-padding";
  
  // Font Family
  const fontFamilyGroup = document.createElement("div");
  fontFamilyGroup.className = "w3-margin-bottom";
  
  const fontFamilyLabel = document.createElement("label");
  fontFamilyLabel.textContent = "Font Family:";
  fontFamilyLabel.className = "w3-text-dark-grey";
  fontFamilyLabel.style.display = "block";
  fontFamilyLabel.style.marginBottom = "8px";
  
  const fontFamilySelect = document.createElement("select");
  fontFamilySelect.className = "w3-select w3-border";
  fontFamilySelect.id = "font-family-select";
  
  const fontFamilies = [
    { value: "system-ui", label: "System Default" },
    { value: "Arial, sans-serif", label: "Arial" },
    { value: "Helvetica, sans-serif", label: "Helvetica" },
    { value: "Georgia, serif", label: "Georgia" },
    { value: "'Times New Roman', serif", label: "Times New Roman" },
    { value: "Verdana, sans-serif", label: "Verdana" },
    { value: "'Courier New', monospace", label: "Courier New" },
    { value: "'Segoe UI', sans-serif", label: "Segoe UI" },
    { value: "'Roboto', sans-serif", label: "Roboto" },
    { value: "'Open Sans', sans-serif", label: "Open Sans" }
  ];
  
  fontFamilies.forEach(font => {
    const option = document.createElement("option");
    option.value = font.value;
    option.textContent = font.label;
    if (font.value === currentSettings.fontFamily) {
      option.selected = true;
    }
    fontFamilySelect.appendChild(option);
  });
  
  fontFamilyGroup.appendChild(fontFamilyLabel);
  fontFamilyGroup.appendChild(fontFamilySelect);
  
  // Font Size
  const fontSizeGroup = document.createElement("div");
  fontSizeGroup.className = "w3-margin-bottom";
  
  const fontSizeLabel = document.createElement("label");
  fontSizeLabel.textContent = "Font Size:";
  fontSizeLabel.className = "w3-text-dark-grey";
  fontSizeLabel.style.display = "block";
  fontSizeLabel.style.marginBottom = "8px";
  
  const fontSizeSelect = document.createElement("select");
  fontSizeSelect.className = "w3-select w3-border";
  fontSizeSelect.id = "font-size-select";
  
  const fontSizes = [
    { value: "12px", label: "Small (12px)" },
    { value: "14px", label: "Medium (14px)" },
    { value: "16px", label: "Default (16px)" },
    { value: "18px", label: "Large (18px)" },
    { value: "20px", label: "Larger (20px)" },
    { value: "24px", label: "Extra Large (24px)" }
  ];
  
  fontSizes.forEach(size => {
    const option = document.createElement("option");
    option.value = size.value;
    option.textContent = size.label;
    if (size.value === currentSettings.fontSize) {
      option.selected = true;
    }
    fontSizeSelect.appendChild(option);
  });
  
  fontSizeGroup.appendChild(fontSizeLabel);
  fontSizeGroup.appendChild(fontSizeSelect);
  
  // Line Height
  const lineHeightGroup = document.createElement("div");
  lineHeightGroup.className = "w3-margin-bottom";
  
  const lineHeightLabel = document.createElement("label");
  lineHeightLabel.textContent = "Line Height:";
  lineHeightLabel.className = "w3-text-dark-grey";
  lineHeightLabel.style.display = "block";
  lineHeightLabel.style.marginBottom = "8px";
  
  const lineHeightSelect = document.createElement("select");
  lineHeightSelect.className = "w3-select w3-border";
  lineHeightSelect.id = "line-height-select";
  
  const lineHeights = [
    { value: "1.2", label: "Tight (1.2)" },
    { value: "1.5", label: "Normal (1.5)" },
    { value: "1.8", label: "Relaxed (1.8)" },
    { value: "2.0", label: "Spacious (2.0)" }
  ];
  
  lineHeights.forEach(height => {
    const option = document.createElement("option");
    option.value = height.value;
    option.textContent = height.label;
    if (height.value === currentSettings.lineHeight) {
      option.selected = true;
    }
    lineHeightSelect.appendChild(option);
  });
  
  lineHeightGroup.appendChild(lineHeightLabel);
  lineHeightGroup.appendChild(lineHeightSelect);
  
  // Preview
  const previewGroup = document.createElement("div");
  previewGroup.className = "w3-margin-bottom";
  
  const previewLabel = document.createElement("label");
  previewLabel.textContent = "Preview:";
  previewLabel.className = "w3-text-dark-grey";
  previewLabel.style.display = "block";
  previewLabel.style.marginBottom = "8px";
  
  const previewBox = document.createElement("div");
  previewBox.className = "w3-border w3-padding";
  previewBox.id = "font-preview";
  previewBox.style.minHeight = "100px";
  previewBox.style.fontFamily = currentSettings.fontFamily;
  previewBox.style.fontSize = currentSettings.fontSize;
  previewBox.style.lineHeight = currentSettings.lineHeight;
  previewBox.innerHTML = `
    <h3>Heading Example</h3>
    <p>This is a paragraph of text that demonstrates how your content will look with the selected font settings. The quick brown fox jumps over the lazy dog.</p>
    <p><strong>Bold text</strong> and <em>italic text</em> are also affected by your font choice.</p>
    <code>This is how code will appear.</code>
  `;
  
  previewGroup.appendChild(previewLabel);
  previewGroup.appendChild(previewBox);
  
  // Update preview when settings change
  fontFamilySelect.addEventListener("change", updatePreview);
  fontSizeSelect.addEventListener("change", updatePreview);
  lineHeightSelect.addEventListener("change", updatePreview);
  
  function updatePreview() {
    previewBox.style.fontFamily = fontFamilySelect.value;
    previewBox.style.fontSize = fontSizeSelect.value;
    previewBox.style.lineHeight = lineHeightSelect.value;
  }
  
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
    const settings = {
      fontFamily: fontFamilySelect.value,
      fontSize: fontSizeSelect.value,
      lineHeight: lineHeightSelect.value
    };
    
    saveFontSettings(settings);
    applyFontSettings();
    document.body.removeChild(modal);
  };
  
  buttonGroup.appendChild(cancelButton);
  buttonGroup.appendChild(applyButton);
  
  // Assemble modal
  formContainer.appendChild(fontFamilyGroup);
  formContainer.appendChild(fontSizeGroup);
  formContainer.appendChild(lineHeightGroup);
  formContainer.appendChild(previewGroup);
  
  modalContent.appendChild(header);
  modalContent.appendChild(formContainer);
  modalContent.appendChild(buttonGroup);
  
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
}

function getFontSettings() {
  // Get settings from localStorage or use defaults
  const defaultSettings = {
    fontFamily: "system-ui",
    fontSize: "16px",
    lineHeight: "1.5"
  };
  
  const savedSettings = localStorage.getItem("geekdown-font-settings");
  return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
}

function saveFontSettings(settings) {
  localStorage.setItem("geekdown-font-settings", JSON.stringify(settings));
}

function applyFontSettings() {
  const settings = getFontSettings();
  console.log("Applying font settings:", settings);
  
  // Create a style element to apply the font settings globally
  let styleEl = document.getElementById("geekdown-font-styles");
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = "geekdown-font-styles";
    document.head.appendChild(styleEl);
  }
  
  // Apply styles to various editor elements
  styleEl.textContent = `
    /* Main editor container */
    #app {
      font-family: ${settings.fontFamily} !important;
      font-size: ${settings.fontSize} !important;
      line-height: ${settings.lineHeight} !important;
    }
    
    /* Milkdown/Crepe specific selectors */
    .milkdown, 
    .milkdown-root,
    .ProseMirror,
    .editor,
    .milkdown .editor,
    .milkdown .ProseMirror {
      font-family: ${settings.fontFamily} !important;
      font-size: ${settings.fontSize} !important;
      line-height: ${settings.lineHeight} !important;
    }
    
    /* Markdown view */
    #markdown-view {
      font-family: ${settings.fontFamily} !important;
      font-size: ${settings.fontSize} !important;
      line-height: ${settings.lineHeight} !important;
    }
    
    /* Editor content elements */
    .milkdown p,
    .milkdown h1,
    .milkdown h2,
    .milkdown h3,
    .milkdown h4,
    .milkdown h5,
    .milkdown h6,
    .milkdown ul,
    .milkdown ol,
    .milkdown li,
    .milkdown blockquote,
    .ProseMirror p,
    .ProseMirror h1,
    .ProseMirror h2,
    .ProseMirror h3,
    .ProseMirror h4,
    .ProseMirror h5,
    .ProseMirror h6,
    .ProseMirror ul,
    .ProseMirror ol,
    .ProseMirror li,
    .ProseMirror blockquote {
      font-family: ${settings.fontFamily} !important;
      line-height: ${settings.lineHeight} !important;
    }
  `;
  
  // Direct application to elements that might already exist
  const editorContainer = document.querySelector("#app");
  if (editorContainer) {
    editorContainer.style.fontFamily = settings.fontFamily;
    editorContainer.style.fontSize = settings.fontSize;
    editorContainer.style.lineHeight = settings.lineHeight;
  }
  
  // Apply to the markdown view if it exists
  const markdownView = document.getElementById("markdown-view");
  if (markdownView) {
    markdownView.style.fontFamily = settings.fontFamily;
    markdownView.style.fontSize = settings.fontSize;
    markdownView.style.lineHeight = settings.lineHeight;
  }
  
  // Apply to Milkdown/Crepe specific elements
  const editorElements = document.querySelectorAll(".milkdown, .milkdown-root, .ProseMirror, .editor");
  editorElements.forEach(el => {
    el.style.fontFamily = settings.fontFamily;
    el.style.fontSize = settings.fontSize;
    el.style.lineHeight = settings.lineHeight;
  });
  
  console.log("Font settings applied");
}
