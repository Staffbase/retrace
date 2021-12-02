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

import React, { ReactElement, useEffect } from "react";
import { Provider } from "react-redux";
import store from "./store/Store";
import { ipcRenderer } from "electron";
import Mousetrap from "mousetrap";
import "mousetrap/plugins/global-bind/mousetrap-global-bind";
import { HashRouter, Routes, Route } from "react-router-dom";
import MainView from "./views/MainView";
import SettingsView from "./views/SettingsView";
import HistoryView from "./views/HistoryView";

export function closeWindow() {
  ipcRenderer.send("close-window");
}

const App = (): ReactElement => {
  useEffect(() => {
    // close window via ESC key
    Mousetrap.bindGlobal("esc", () => {
      closeWindow();
    });
  }, []);

  return (
    <Provider store={store}>
      <HashRouter>
        <Routes>
          <Route path="/history" element={<HistoryView />} />
          <Route path="/settings" element={<SettingsView />} />
          <Route path="/" element={<MainView />} />
        </Routes>
      </HashRouter>
    </Provider>
  );
};

export default App;
