const { menubar } = require('menubar');
const { globalShortcut, localShortcut } = require('electron')

const mb = menubar();

mb.on('ready', () => {

  globalShortcut.register('CommandOrControl+L', () => {
    mb.showWindow();
  });

});