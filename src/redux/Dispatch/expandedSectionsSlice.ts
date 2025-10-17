import { createSlice } from '@reduxjs/toolkit';

const expandedSectionsSlice = createSlice({
  name: 'expandedSections',
  initialState: {},
  reducers: {
    toggleSection: (state, { payload: sectionTitle }) => {
      if (state[sectionTitle]) {
        delete state[sectionTitle];
      } else {
        state[sectionTitle] = true;
      }
      return state;
    }
  },
});

export const { toggleSection } = expandedSectionsSlice.actions;

export default expandedSectionsSlice.reducer;
