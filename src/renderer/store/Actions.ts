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

import { PartialItem, Item, DateFilter } from "./Types";

export enum ActionTypes {
  ADD_ITEM,
  UPDATE_ITEM,
  REMOVE_ITEM,
  SET_FILTER
}

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

export const setFilter = (
  from: number,
  to: number
): ActionPayload<DateFilter> => {
  return {
    type: ActionTypes.SET_FILTER,
    data: { from, to }
  };
};
