document.addEventListener("DOMContentLoaded", function () {
  const exportHtmlBtn = document.getElementById("export-to-html");
  const exportPdfBtn = document.getElementById("export-to-pdf");

  if (exportHtmlBtn) {
    exportHtmlBtn.addEventListener("click", function (e) {
      e.preventDefault();
      console.log("Export to HTML clicked");
      exportToHtml();
    });
  }

  if (exportPdfBtn) {
    exportPdfBtn.addEventListener("click", function (e) {
      e.preventDefault();
      console.log("Export to PDF clicked");
      exportToPdf();
    });
  }
});

function exportToHtml() {
  const markdown = extractMarkdownFromEditor();
  if (!markdown) {
    console.error("Could not extract markdown from editor");
    return;
  }
  
  if (window.electronAPI && window.electronAPI.exportToHtml) {
    // Use Electron's API for file saving dialog
    window.electronAPI.exportToHtml(markdown);
  } else {
    // Browser fallback
    const html = createHtmlDocument(markdown);
    downloadHtml(html);
  }
}

function exportToPdf() {
  const markdown = extractMarkdownFromEditor();
  if (!markdown) {
    console.error("Could not extract markdown from editor");
    return;
  }
  
  if (window.electronAPI && window.electronAPI.exportToPdf) {
    window.electronAPI.exportToPdf(markdown);
  } else {
    alert("PDF export is only available in the desktop application");
  }
}

function extractMarkdownFromEditor() {
  const crepeInstance = window.crepeInstance;
  if (!crepeInstance) {
    console.error("Crepe instance not found");
    return null;
  }
  
  // Check if we're in markdown view mode
  const markdownView = document.getElementById("markdown-view");
  if (markdownView) {
    return markdownView.value;
  }
  
  // Otherwise get markdown from the editor
  return crepeInstance.getMarkdown();
}

function createHtmlDocument(markdown) {
  // Get HTML content from the editor
  const htmlContent = window.crepeInstance.getHTML ? 
                      window.crepeInstance.getHTML() : 
                      convertMarkdownToHtml(markdown);
  
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Exported from GeekDown</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      color: #333;
    }
    pre {
      background-color: #f5f5f5;
      padding: 10px;
      border-radius: 4px;
      overflow-x: auto;
    }
    code {
      font-family: 'Courier New', Courier, monospace;
      background-color: #f5f5f5;
      padding: 2px 4px;
      border-radius: 3px;
    }
    blockquote {
      border-left: 4px solid #ddd;
      padding-left: 16px;
      margin-left: 0;
      color: #666;
    }
    img {
      max-width: 100%;
    }
    table {
      border-collapse: collapse;
      width: 100%;
    }
    table, th, td {
      border: 1px solid #ddd;
    }
    th, td {
      padding: 8px;
      text-align: left;
    }
    th {
      background-color: #f2f2f2;
    }
  </style>
</head>
<body>
  <div id="content">
    ${htmlContent}
  </div>
</body>
</html>`;
}

function convertMarkdownToHtml(markdown) {
  // Simple markdown to HTML conversion
  // This is a very basic implementation
  // In a real app, you'd use a library like marked or showdown
  
  let html = markdown
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\`\`\`([\s\S]*?)\`\`\`/g, '<pre><code>$1</code></pre>')
    .replace(/\`(.*?)\`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
    .replace(/^##### (.*$)/gm, '<h5>$1</h5>')
    .replace(/^###### (.*$)/gm, '<h6>$1</h6>');
  
  return '<p>' + html + '</p>';
}

function downloadHtml(html) {
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.href = url;
  
  // Get filename from localStorage or use default
  const filename = localStorage.getItem("geekdown-filename") || "document";
  link.download = `${filename}.html`;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object
  setTimeout(() => URL.revokeObjectURL(url), 100);
}
