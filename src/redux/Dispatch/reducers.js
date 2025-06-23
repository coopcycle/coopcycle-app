import { actionMatchCreator } from '../util';
import {
  addStringFilter,
  initialized,
  loadUsersSuccess,
  removeStringFilter,
} from './actions';

const initialState = {
  initialized: false,
  users: [],
  ui: {
    stringFilters: [],
  },
};

export default (state = initialState, action = {}) => {
  if (actionMatchCreator(action, [
    initialized,
  ])) {
    return {
      ...state,
      initialized: true,
    };
  }

  if (actionMatchCreator(action, [
    loadUsersSuccess,
  ])) {
    return {
      ...state,
      users: action.payload,
    };
  }

  if (actionMatchCreator(action, [
    addStringFilter,
  ])) {
    return {
      ...state,
      ui: {
        ...state.ui,
        stringFilters: [...state.ui.stringFilters, action.payload]
      },
    };
  }

  if (actionMatchCreator(action, [
    removeStringFilter,
  ])) {
    return {
      ...state,
      ui: {
        ...state.ui,
        stringFilters: state.ui.stringFilters.filter(f => f !== action.payload)
      },
    };
  }

  return state;
};
