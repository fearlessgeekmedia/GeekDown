const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron');
const path = require('path');

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
