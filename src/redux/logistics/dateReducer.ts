import { moment } from '../../coopcycle-frontend-js';

import { actionMatchCreator } from '../util';
import { changeDate } from '../Dispatch/actions';
import { DEP_CHANGE_DATE } from '../../shared/logistics/redux';
import { DateISOString } from '../../utils/date-types';

type DateState = DateISOString;

const initialState: DateState = moment().toISOString() as DateISOString;

export default (state = initialState, action) => {
  if (actionMatchCreator(action, [changeDate])) {
    return action.payload;
  }

  switch (action.type) {
    case DEP_CHANGE_DATE:
      return action.payload;
    default:
      return state;
  }
};
