/*
Copyright 2021, Staffbase GmbH and contributors.

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

import electron, {
  globalShortcut,
  nativeImage,
  BrowserWindow,
  Menu,
} from "electron";
import { Menubar, menubar } from "menubar";
import { join } from "path";
import config from "../renderer/store/ConfigStore";
import { getTranslation } from "../i18n/index";

const getIcon = () => {
  const path = join(__dirname, `assets/iconTemplate.png`);
  return nativeImage.createFromPath(path);
};

const webPreferences = {
  nodeIntegration: true,
  nativeWindowOpen: true,
  devTools: process.env.NODE_ENV !== "production",
};

export default class MenuBar {
  menuBar: Menubar | undefined;
  childWindows: { [key: string]: BrowserWindow } = {};
  index: string;
  currentFloatShortcut: string;
  ready: Promise<void>;

  constructor(index: string) {
    this.index = index;
    this.currentFloatShortcut = config.get("floatShortcut");

    this.menuBar = menubar({
      index,
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

    this.registerAutoStart(config.get("autostart"));

    if (!config.get("locale")) {
      config.set("locale", this.menuBar.app.getLocale());
    }

    electron.nativeTheme.on("updated", () => {
      this.menuBar?.tray.setImage(getIcon());
    });

    this.menuBar.on("focus-lost", this.menuBar.hideWindow);

    this.menuBar.on("after-hide", () => {
      // restore initial menu bar app position
      this.menuBar?.setOption("windowPosition", "trayRight");
      this.expand();

      this.menuBar?.window?.webContents.send("reset-calendar");

      // restore focus to where it was before
      this.menuBar?.app.hide();
    });

    this.ready = new Promise<void>((resolve) => {
      if (this.menuBar) {
        this.menuBar.on("ready", () => {
          if (!config.get("floatShortcut")) {
            config.set("floatShortcut", "CommandOrControl+L");
          }

          this.registerFloatShortcut(config.get("floatShortcut"));

          this.menuBar?.tray.on("right-click", () => {
            this.menuBar?.tray.popUpContextMenu(this.getSecondaryMenu());
          });

          config.onDidChange("locale", () => {
            this.menuBar?.tray.popUpContextMenu(this.getSecondaryMenu());
          });

          this.menuBar?.window?.webContents.send("reset-calendar");

          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  openHistory() {
    this.openChildWindow("/history")
  }

  openSettings() {
    this.openChildWindow("/settings", {
      width: 400,
      height: 250,
      resizable: false,
    });
  }

  getSecondaryMenu() {
    const { PAGES } = getTranslation();

    return Menu.buildFromTemplate([
      {
        label: PAGES.history,
        click: this.openHistory.bind(this),
        accelerator: "CommandOrControl+H",
      },
      {
        label: PAGES.settings,
        click: this.openSettings.bind(this),
        accelerator: "CommandOrControl+D",
      },
      {
        label: PAGES.quit,
        click: this.menuBar?.app.quit,
        accelerator: "CommandOrControl+Q",
      },
    ]);
  }

  openChildWindow(path: string, options = {}) {
    let win = this.childWindows[path];
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
        parent: this.menuBar?.window,
        ...options,
      });

      win.loadURL(`${this.index}#${path}`).then(() => {
        win.show();
      });

      win.on("closed", () => {
        delete this.childWindows[path];
        this.menuBar?.window?.hide();
      });

      this.childWindows[path] = win;
    }
  }

  collapse = (skipEvent = false) => {
    if (!skipEvent) {
      this.menuBar?.window?.webContents.send("window-collapse");
    }

    this.menuBar?.window?.setSize(500, 47);
  };

  expand = (skipEvent = false) => {
    if (!skipEvent) {
      this.menuBar?.window?.webContents.send("window-expand");
    }

    this.menuBar?.window?.setSize(500, 375);
  };

  hide = () => {
    this.menuBar?.hideWindow();
  };

  registerAutoStart(value: boolean) {
    if (this.menuBar?.app.isPackaged) {
      this.menuBar?.app.setLoginItemSettings({
        openAtLogin: value === true,
        openAsHidden: true,
      });
    }
  }

  registerFloatShortcut(value: string) {
    globalShortcut.unregister(this.currentFloatShortcut);

    this.currentFloatShortcut = value;

    globalShortcut.register(this.currentFloatShortcut, () => {
      // initiate smaller hotkey mode, collapsed and centered
      this.collapse();

      this.menuBar?.setOption("windowPosition", "center");
      this.menuBar?.showWindow();
    });
  }
}
