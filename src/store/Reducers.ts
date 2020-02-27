import { StoreState } from './Types';
import { ActionPayload, ActionTypes } from './Actions';
import { Reducer } from 'redux';
import nanoid from 'nanoid';

export const reducer: Reducer<StoreState, ActionPayload<any>> = (state: StoreState = { data: {}, total: 0} , action: ActionPayload<any>): StoreState => {
  let id;
  let data;

  switch (action.type) {
    case ActionTypes.ADD_ITEM:
      data = Object.assign({}, state.data);
      id = nanoid(16);

      data[id] = Object.assign({}, action.data, {
        createdAt: new Date().getTime(),
        id
      });

      return {
        ...state,
        data,
        total: Object.keys(data).length
      };

    case ActionTypes.UPDATE_ITEM:
      id = action.data.id;

      if (!state.data[id]) {
        return state;
      }

      data = Object.assign({}, state.data);
      data[id] = Object.assign({}, data[id], action.data);

      return {
        ...state,
        data
      };

    case ActionTypes.REMOVE_ITEM:
      id = action.data.id;

      if (!state.data[id]) {
        return state;
      }

      data = Object.assign({}, state.data);
      delete data[id];

      return {
        ...state,
        data
      };

    default:
      return state;
  }
};