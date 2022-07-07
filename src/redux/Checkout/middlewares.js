import {LOAD_RESTAURANTS_SUCCESS} from './actions';
import SearchEngine from '../../utils/searchEngine';

export const restaurantsSearchIndex = () => {
  return (next) => (action) => {

    if (action.type !== LOAD_RESTAURANTS_SUCCESS) {
      return next(action)
    }

    SearchEngine.setRestaurants(action.payload)

    return next(action)
  }
}
