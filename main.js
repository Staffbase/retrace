const { menubar } = require('menubar');
const { globalShortcut, ipcMain } = require('electron');

const mb = menubar({
  index: `file://${process.cwd()}/build/index.html`,
  browserWindow: {
    alwaysOnTop: true,
    useContentSize: true,
    transparent: true,
    width: 500,
    height: 47,
    webPreferences: {
      nodeIntegration: true
    }
  },
  preloadWindow: true,
  tooltip: 'Shutdown',
  windowPosition: 'center'//,
  //icon: "./check_icon.png"
});

mb.on('ready', () => {
  globalShortcut.register('CommandOrControl+L', () => {
    mb.showWindow();
  });
});

mb.on('focus-lost', mb.hideWindow);

ipcMain.on('close-window', () => {
  mb.hideWindow();
});

ipcMain.on('window-collapse', () => {
  mb.window.setSize(500, 47);
});

ipcMain.on('window-expand', () => {
  mb.window.setSize(500, 250);
});