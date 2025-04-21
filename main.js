const { app, BrowserWindow, ipcMain, globalShortcut, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    }
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }

  // Register global shortcuts
  globalShortcut.register('CommandOrControl+N', () => {
    mainWindow.webContents.send('trigger-new');
  });
  
  globalShortcut.register('CommandOrControl+O', () => {
    mainWindow.webContents.send('trigger-open');
  });
  
  globalShortcut.register('CommandOrControl+S', () => {
    mainWindow.webContents.send('trigger-save');
  });
  
  globalShortcut.register('CommandOrControl+Shift+S', () => {
    mainWindow.webContents.send('trigger-save-as');
  });
  
  globalShortcut.register('CommandOrControl+W', () => {
    mainWindow.webContents.send('trigger-close');
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  mainWindow.setMenuBarVisibility(false);
}

// Listen for the close event from the renderer process
ipcMain.on('app-close', () => {
  console.log("Received app-close event");
  if (mainWindow) {
    mainWindow.close();
  }
});

// Handle HTML export
ipcMain.on('export-to-html', (event, markdown) => {
  console.log("Received export-to-html event");
  
  dialog.showSaveDialog(mainWindow, {
    title: 'Export as HTML',
    defaultPath: path.join(app.getPath('documents'), 'document.html'),
    filters: [
      { name: 'HTML Files', extensions: ['html'] }
    ]
  }).then(result => {
    if (!result.canceled && result.filePath) {
      const html = createHtmlDocument(markdown);
      fs.writeFileSync(result.filePath, html);
    }
  }).catch(err => {
    console.error('Error exporting to HTML:', err);
  });
});

// Handle PDF export
ipcMain.on('export-to-pdf', (event, markdown) => {
  console.log("Received export-to-pdf event");
  
  dialog.showSaveDialog(mainWindow, {
    title: 'Export as PDF',
    defaultPath: path.join(app.getPath('documents'), 'document.pdf'),
    filters: [
      { name: 'PDF Files', extensions: ['pdf'] }
    ]
  }).then(result => {
    if (!result.canceled && result.filePath) {
      // Create a temporary HTML file
      const tempHtml = createHtmlDocument(markdown);
      const tempPath = path.join(app.getPath('temp'), 'geekdown-export.html');
      fs.writeFileSync(tempPath, tempHtml);
      
      // Create a hidden window to render the HTML
      const pdfWindow = new BrowserWindow({
        width: 800,
        height: 600,
        show: false
      });
      
      pdfWindow.loadFile(tempPath);
      
      pdfWindow.webContents.on('did-finish-load', () => {
        // Print to PDF
        pdfWindow.webContents.printToPDF({
          marginsType: 0,
          printBackground: true,
          printSelectionOnly: false,
          landscape: false
        }).then(data => {
          fs.writeFileSync(result.filePath, data);
          pdfWindow.close();
          
          // Clean up temp file
          try {
            fs.unlinkSync(tempPath);
          } catch (e) {
            console.error('Error removing temp file:', e);
          }
        }).catch(error => {
          console.error('Error generating PDF:', error);
        });
      });
    }
  }).catch(err => {
    console.error('Error exporting to PDF:', err);
  });
});

function createHtmlDocument(markdown) {
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
    <p>${html}</p>
  </div>
</body>
</html>`;
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
