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
  tooltip: 'Shutdown'
});

const collapse = () => {
  mb.window.webContents.send('window-collapse');
  mb.window.setSize(500, 47);
};

const expand = () => {
  mb.window.webContents.send('window-expand');
  mb.window.setSize(500, 250);
}

mb.on('ready', () => {
  globalShortcut.register('CommandOrControl+L', () => {
    collapse();
    mb.setOption('windowPosition', 'center');
    mb.showWindow();
  });
});

mb.on('focus-lost', mb.hideWindow);

mb.on('after-hide', () => {
  mb.setOption('windowPosition', 'trayCenter');
  expand();
});

ipcMain.on('close-window', () => {
  mb.hideWindow();
});

ipcMain.on('window-collapse', collapse);
ipcMain.on('window-expand', expand);