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
import ElectronStore from "electron-store";
import defaultConfig from "./config.default.json";
import electron, { nativeImage, BrowserWindow } from "electron";

const config = new ElectronStore({
  name: "config",
  defaults: defaultConfig,
});

const getIcon = () => {
  const path = join(__dirname, `assets/iconTemplate.png`);
  return nativeImage.createFromPath(path);
};

const webPreferences = {
  nodeIntegration: true,
  nativeWindowOpen: true,
  devTools: process.env.NODE_ENV !== "production",
};

const mb = menubar({
  index: MAIN_WINDOW_WEBPACK_ENTRY,
  browserWindow: {
    alwaysOnTop: true,
    useContentSize: true,
    transparent: false,
    width: process.env.NODE_ENV === "production" ? 500 : 1000,
    height: 47,
    webPreferences,
  },
  icon: getIcon(),
  preloadWindow: true,
  windowPosition: "trayRight",
  tooltip: "RE-Trace",
});

const childWindows = {};

function openChildWindow(path) {
  let win = childWindows[path];

  if (win) {
    if (win.isMinimized()) {
      win.restore();
    }

    win.focus();
  } else {
    win = new BrowserWindow({
      width: process.env.NODE_ENV === "production" ? 500 : 1000,
      height: 500,
      center: true,
      resizable: true,
      show: false,
      webPreferences,
    });

    win.loadURL(`${MAIN_WINDOW_WEBPACK_ENTRY}#${path}`).then(() => {
      win.show();
    });

    win.on("closed", () => {
      delete childWindows[path];
    });

    childWindows[path] = win;
  }
}

electron.nativeTheme.on("updated", () => {
  mb.tray.setImage(getIcon());
});

const collapse = (skipEvent) => {
  if (!skipEvent) {
    mb.window.webContents.send("window-collapse");
  }

  mb.window.setSize(500, 47);
};

const expand = (skipEvent) => {
  if (!skipEvent) {
    mb.window.webContents.send("window-expand");
  }

  mb.window.setSize(500, 350);
};

const secondaryMenu = Menu.buildFromTemplate([
  {
    label: "History",
    click: openChildWindow.bind(null, "/history"),
    accelerator: "CommandOrControl+H",
  },
  {
    label: "Quit",
    click: mb.app.quit,
    accelerator: "CommandOrControl+Q",
  },
]);

if (mb.app.isPackaged) {
  mb.app.setLoginItemSettings({
    openAtLogin: config.get("autostart") === true,
    openAsHidden: true,
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
