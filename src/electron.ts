import { app, BrowserWindow } from 'electron';

function createWindow () {   
  const mainWnd = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 718,
    minHeight: 505,
    frame: false,
    backgroundColor: '#0fff',
    transparent: true,
    webPreferences: {
      nodeIntegration: true,
    },
    alwaysOnTop: false,
  });
  mainWnd.loadFile('./dist/index.html');
}

app.on('ready', createWindow);
