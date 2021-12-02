/*
Copyright 2020, Staffbase GmbH and contributors.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { menubar } from "menubar";
import { globalShortcut, ipcMain, Menu } from "electron";
import { join } from "path";
import electron, { nativeImage, BrowserWindow } from "electron";
import config from "../renderer/store/ConfigStore";

const getIcon = () => {
  const path = join(__dirname, `assets/iconTemplate.png`);
  return nativeImage.createFromPath(path);
};

const webPreferences = {
  nodeIntegration: true,
  nativeWindowOpen: true,
  devTools: process.env.NODE_ENV !== "production",
};

const menuBar = menubar({
  index: MAIN_WINDOW_WEBPACK_ENTRY,
  browserWindow: {
    alwaysOnTop: true,
    useContentSize: true,
    transparent: false,
    width: 500,
    height: 47,
    webPreferences,
  },
  icon: getIcon(),
  preloadWindow: true,
  windowPosition: "trayRight",
  tooltip: "RE-Trace",
});

const childWindows = {};

function openChildWindow(path, options = {}) {
  let win = childWindows[path];

  if (win) {
    if (win.isMinimized()) {
      win.restore();
    }

    win.focus();
  } else {
    win = new BrowserWindow({
      width: 500,
      height: 500,
      center: true,
      resizable: true,
      show: false,
      webPreferences,
      parent: menuBar.window,
      ...options,
    });

    win.loadURL(`${MAIN_WINDOW_WEBPACK_ENTRY}#${path}`).then(() => {
      win.show();
    });

    win.on("closed", () => {
      delete childWindows[path];
      mb.window.hide();
    });

    childWindows[path] = win;
  }
}

electron.nativeTheme.on("updated", () => {
  menuBar.tray.setImage(getIcon());
});

const collapse = (skipEvent) => {
  if (!skipEvent) {
    menuBar.window.webContents.send("window-collapse");
  }

  menuBar.window.setSize(500, 47);
};

const expand = (skipEvent) => {
  if (!skipEvent) {
    menuBar.window.webContents.send("window-expand");
  }

  menuBar.window.setSize(500, 350);
};

const secondaryMenu = Menu.buildFromTemplate([
  {
    label: "History",
    click: openChildWindow.bind(null, "/history"),
    accelerator: "CommandOrControl+H",
  },
  {
    label: "Settings",
    click: openChildWindow.bind(null, "/settings", {
      width: 400,
      height: 250,
      resizable: false,
    }),
    accelerator: "CommandOrControl+D",
  },
  {
    label: "Quit",
    click: menuBar.app.quit,
    accelerator: "CommandOrControl+Q",
  },
]);

if (menuBar.app.isPackaged) {
  menuBar.app.setLoginItemSettings({
    openAtLogin: config.get("autostart") === true,
    openAsHidden: true,
  });
}

menuBar.on("ready", () => {
  if (!config.get("floatShortcut")) {
    config.set("floatShortcut", "CommandOrControl+L");
  }

  config.set("locale", menuBar.app.getLocale());
  menuBar.window.webContents.openDevTools();

  globalShortcut.register(config.get("floatShortcut"), () => {
    // initiate smaller hotkey mode, collapsed and centered
    collapse();

    menuBar.setOption("windowPosition", "center");
    menuBar.showWindow();
  });

  menuBar.tray.on("right-click", () => {
    menuBar.tray.popUpContextMenu(secondaryMenu);
  });

  menuBar.window.webContents.send("reset-calendar");
});

menuBar.on("focus-lost", menuBar.hideWindow);

menuBar.on("after-hide", () => {
  // restore initial menu bar app position
  menuBar.setOption("windowPosition", "trayRight");
  expand();

  menuBar.window.webContents.send("reset-calendar");

  // restore focus to where it was before
  menuBar.app.hide();
});

ipcMain.on("close-window", () => {
  menuBar.hideWindow();
});

ipcMain.on("window-collapse", collapse.bind(null, true));
ipcMain.on("window-expand", expand.bind(null, true));
