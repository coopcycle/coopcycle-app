import { moment } from '../../coopcycle-frontend-js'
import { CHANGE_DATE } from "../Dispatch/actions";

const initialState = moment()

export default (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_DATE:
      return action.payload
    default:
      return state
  }
}
