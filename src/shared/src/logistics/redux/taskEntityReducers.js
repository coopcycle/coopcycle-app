import { taskAdapter } from './adapters';

const initialState = taskAdapter.getInitialState();

export default (state = initialState, action) => {
  switch (action.type) {
  }

  return state;
};
