import _ from 'lodash';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import { createTransform } from 'redux-persist';

const moment = extendMoment(Moment);

export const insertAt = (x, idx, xs) =>
  xs.slice(0, idx).concat(x).concat(xs.slice(idx));

/**
 * @see https://github.com/rt2zz/redux-persist#transforms
 */
export function createTaskItemsTransform(now) {
  now = now || moment();

  const range = moment.range(
    moment(now).subtract(3, 'days'),
    moment(now).add(3, 'days'),
  );
  const days = Array.from(range.by('day'));
  const keys = days.map(m => m.format('YYYY-MM-DD'));

  return createTransform(
    // transform state on its way to being serialized and persisted.
    (inboundState, key) => _.pick(inboundState, keys),
    // transform state being rehydrated
    (outboundState, key) => _.pick(outboundState, keys),
    { whitelist: ['items'] },
  );
}

export function sortByName<T extends { name: string }>(list: T[]): T[] {
  return sortByString(list, 'name');
}

export function sortByString<T>(list: T[], key: keyof T): T[] {
  return sortByKey(list, elem => String(elem[key]).toLowerCase());
}

export function sortByKey<T>(
  list: T[],
  key: ((item: T) => unknown) | keyof T,
  order: 'asc' | 'desc' = 'asc',
): T[] {
  return _.orderBy(list, [key], [order]);
}

export function actionMatchCreator(action, actionCreators) {
  return actionCreators.some(actionCreator => actionCreator.match(action));
}

export function idfromUrl(elementUrl) {
  return (elementUrl.match(/(\d+)/g) || [])[0] || null;
}
