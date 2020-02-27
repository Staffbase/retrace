const { menubar } = require('menubar');
const { globalShortcut, localShortcut } = require('electron')

const mb = menubar({
  index: `file://${process.cwd()}/build/index.html`,
  browserWindow: {
    alwaysOnTop: true,
    useContentSize: true,
    transparent: true,
    width: 500,
    height: 47
  },
  preloadWindow: true,
  tooltip: 'Shutdown',
  windowPosition: 'center',
  icon: "./check_icon.png"
});

mb.on('ready', () => {
  globalShortcut.register('CommandOrControl+L', () => {
    mb.showWindow();
  });
});

mb.on('focus-lost', mb.hideWindow);