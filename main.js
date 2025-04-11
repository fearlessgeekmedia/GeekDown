const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const url = require('url');

// Keep a global reference of the window object
let mainWindow;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // Load the app
  if (process.env.NODE_ENV === 'development') {
    // Load from development server
    mainWindow.loadURL('http://localhost:5173');
    // Open DevTools
    mainWindow.webContents.openDevTools();
  } else {
    // Load from built files
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }

  // Emitted when the window is closed
  mainWindow.on('closed', function() {
    mainWindow = null;
  });

  Menu.setApplicationMenu(null);
}

// This method will be called when Electron has finished initialization
app.whenReady().then(createWindow);

// Quit when all windows are closed
app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function() {
  if (mainWindow === null) createWindow();
});
