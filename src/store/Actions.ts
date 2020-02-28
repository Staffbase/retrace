import {PartialItem, Item, DateFilter} from './Types';

export enum ActionTypes {
  ADD_ITEM,
  UPDATE_ITEM,
  REMOVE_ITEM,
  SET_FILTER
};

export interface ActionPayload<T> {
  type: ActionTypes;
  data: T;
}

export const addItem = (data: PartialItem): ActionPayload<PartialItem> => {
  return {
    type: ActionTypes.ADD_ITEM,
    data
  };
};

export const updateItem = (data: Item): ActionPayload<Item> => {
  return {
    type: ActionTypes.UPDATE_ITEM,
    data
  };
};

export const removeItem = (data: Item): ActionPayload<Item> => {
  return {
    type: ActionTypes.REMOVE_ITEM,
    data
  };
};

export const setFilter = (from: number, to: number): ActionPayload<DateFilter> => {
  return {
    type: ActionTypes.SET_FILTER,
    data: {from, to}
  };
}