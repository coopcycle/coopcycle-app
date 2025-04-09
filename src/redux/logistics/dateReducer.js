import { moment } from '../../coopcycle-frontend-js';

import { DEP_CHANGE_DATE, changeDate } from '../Dispatch/actions';
import { actionMatchCreator } from '../util';

const initialState = moment();

export default (state = initialState, action) => {
  if (actionMatchCreator(action, [
    changeDate,
  ])) {
    return action.payload;
  }

  switch (action.type) {
    case DEP_CHANGE_DATE:
      return action.payload;
    default:
      return state;
  }
};
