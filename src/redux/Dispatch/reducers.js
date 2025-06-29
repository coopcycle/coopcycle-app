import _ from 'lodash';

import { filterByKeyword } from '../logistics/filters';
import { actionMatchCreator } from '../util';
import {
  addKeywordFilter,
  initialized,
  loadUsersSuccess,
  removeKeywordFilter,
} from './actions';

const initialState = {
  initialized: false,
  users: [],
  ui: {
    keywordFilters: [],
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
    addKeywordFilter,
  ])) {
    const newKeywordFilters = _.uniqBy(
      [...state.ui.keywordFilters, filterByKeyword(action.payload)],
      'keyword',
    );

    return {
      ...state,
      ui: {
        ...state.ui,
        keywordFilters: newKeywordFilters
      },
    };
  }

  if (actionMatchCreator(action, [
    removeKeywordFilter,
  ])) {
    return {
      ...state,
      ui: {
        ...state.ui,
        keywordFilters: state.ui.keywordFilters.filter(f => f.keyword !== action.payload)
      },
    };
  }

  return state;
};
