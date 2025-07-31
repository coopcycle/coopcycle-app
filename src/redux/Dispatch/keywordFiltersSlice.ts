import _ from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import { filterByKeyword } from '../logistics/filters';

const initialState = [];

const keywordFiltersSlice = createSlice({
  name: 'keywordFilters',
  initialState,
  reducers: {
    addKeywordFilter: (state, { payload: filter }) => {
      return _.uniqBy(
        [...state, filterByKeyword(filter)],
        'keyword',
      );
    },
    removeKeywordFilter: (state, { payload: filter }) => {
      return state.filter(f => f.keyword !== filter)
    },
  }
})


export const {
  addKeywordFilter,
  removeKeywordFilter,
} = keywordFiltersSlice.actions;

export default keywordFiltersSlice.reducer;
