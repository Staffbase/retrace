import { Item, StoreState } from './Types';
import { createStore, combineReducers, Store } from 'redux';
import nanoid from 'nanoid';
import { reducer } from './Reducers';
import throttle from 'lodash.throttle';

const appID = localStorage.getItem('appID') || nanoid(42);
const storageID = `data_${appID}`;

const restoreState = (): StoreState => {
  const oldState = localStorage.getItem(storageID);
  return oldState && JSON.parse(oldState) ||
    { data: {}, total: 0 };
};

const saveState = (state: StoreState): void => {
  localStorage.setItem(storageID, JSON.stringify(state));
};

const store: Store = createStore(reducer, restoreState());

// save store to LocalStorage on updates
store.subscribe(throttle(() => saveState(store.getState()), 1000));

export default store;