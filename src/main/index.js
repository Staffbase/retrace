const { menubar } = require("menubar");
const { globalShortcut, ipcMain, Menu } = require("electron");
const path = require("path");
const ElectronStore = require("electron-store");
const defaultConfig = require("./config.default.json");
const electron = require("electron");

const config = new ElectronStore({
  name: "config",
  defaults: defaultConfig
});

const getIcon = () => {
  const imgMode = electron.nativeTheme.shouldUseDarkColors ? "light" : "dark";
  return path.join(__dirname, `assets/icon_${imgMode}.png`);
};

const mb = menubar({
  //eslint-disable-next-line no-undef
  index: MAIN_WINDOW_WEBPACK_ENTRY,
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
  icon: getIcon(),
  preloadWindow: true,
  windowPosition: "trayRight",
  tooltip: "RE:Trace"
});

electron.nativeTheme.on("updated", () => {
  mb.tray.setImage(getIcon());
});

const collapse = skipEvent => {
  if (!skipEvent) {
    mb.window.webContents.send("window-collapse");
  }

  mb.window.setSize(500, 47);
};

const expand = skipEvent => {
  if (!skipEvent) {
    mb.window.webContents.send("window-expand");
  }

  mb.window.setSize(500, 350);
};

const secondaryMenu = Menu.buildFromTemplate([
  {
    label: "Quit",
    click: mb.app.quit,
    accelerator: "CommandOrControl+Q"
  }
]);

if (mb.app.isPackaged) {
  mb.app.setLoginItemSettings({
    openAtLogin: config.get("autostart") === true,
    openAsHidden: true
  });
}

mb.on("ready", () => {
  if (!config.get("floatShortcut")) {
    config.set("floatShortcut", "CommandOrControl+L");
  }

  globalShortcut.register(config.get("floatShortcut"), () => {
    // initiate smaller hotkey mode, collapsed and centered
    collapse();

    mb.setOption("windowPosition", "center");
    mb.showWindow();
  });

  mb.tray.on("right-click", () => {
    mb.tray.popUpContextMenu(secondaryMenu);
  });

  mb.window.webContents.send("reset-calendar");
});

mb.on("focus-lost", mb.hideWindow);

mb.on("after-hide", () => {
  // restore initial menu bar app position
  mb.setOption("windowPosition", "trayRight");
  expand();

  mb.window.webContents.send("reset-calendar");

  // restore focus to where it was before
  mb.app.hide();
});

ipcMain.on("close-window", () => {
  mb.hideWindow();
});

ipcMain.on("window-collapse", collapse.bind(null, true));
ipcMain.on("window-expand", expand.bind(null, true));
