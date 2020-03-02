import { StoreState } from "./Types";
import { createStore, Store } from "redux";
import { reducer } from "./Reducers";
import throttle from "lodash.throttle";
import { default as ElectronStore } from "electron-store";
import { ipcRenderer } from "electron";
import { setFilter } from "./Actions";

const electronStore = new ElectronStore({
  name: "database"
});

const restoreState = (): StoreState => {
  return electronStore.get("state");
};

const saveState = (state: StoreState): void => {
  electronStore.set("state", state);
};

const store: Store = createStore(reducer, restoreState());

ipcRenderer.on("reset-calendar", () => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const from = now.getTime();
  now.setHours(23, 59, 59, 99);
  const to = now.getTime();

  store.dispatch(setFilter(from, to));
});

store.subscribe(throttle(() => saveState(store.getState()), 1000));

export default store;
