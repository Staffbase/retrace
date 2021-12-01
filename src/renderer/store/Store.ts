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

import { StoreState } from "./Types";
import { createStore, Store } from "redux";
import { reducer } from "./Reducers";
import throttle from "lodash.throttle";
import { default as ElectronStore } from "electron-store";
import { ipcRenderer } from "electron";
import { setFilter } from "./Actions";
import Migrations from "./Migrations";

function getFilter(date: Date = new Date()) {
  date.setHours(0, 0, 0, 0);
  const from = date.getTime();
  date.setHours(23, 59, 59, 99);
  const to = date.getTime();
  return [from, to];
}

const defaultFilter = getFilter();

const electronStore = new ElectronStore({
  name: "database",
  defaults: {
    state: {
      data: {},
      total: 0,
      filter: {
        from: defaultFilter[0],
        to: defaultFilter[1],
      },
    },
  },
  migrations: Migrations,
  //@ts-ignore
  projectVersion: VERSION,
});

const restoreState = (): StoreState => {
  return electronStore.get("state");
};

const saveState = (state: StoreState): void => {
  electronStore.set("state", state);
};

const store: Store = createStore(reducer, restoreState());

ipcRenderer.on("reset-calendar", () => {
  const [from, to] = getFilter();
  store.dispatch(setFilter(from, to));
});

store.subscribe(throttle(() => saveState(store.getState()), 1000));

export default store;
