import { PartialItem, Item } from './Types';

export enum ActionTypes {
  ADD_ITEM,
  UPDATE_ITEM,
  REMOVE_ITEM
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