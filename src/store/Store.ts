import { StoreState } from './Types';
import { createStore, Store } from 'redux';
import nanoid from 'nanoid';
import { reducer } from './Reducers';
import throttle from 'lodash.throttle';
import { ipcRenderer } from 'electron';
import {default as ElectronStore} from 'electron-store';

const electronStore = new ElectronStore({
  name: 'database'
});

const appID = localStorage.getItem('appID') || nanoid(42);
const storageID = `data_${appID}`;

const restoreState = (): StoreState => {
  return electronStore.get('state');
};

const saveState = (state: StoreState): void => {
  electronStore.set('state', state);
};

const store: Store = createStore(reducer, restoreState());

// save store to LocalStorage on updates
store.subscribe(throttle(() => saveState(store.getState()), 1000));

export default store;