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

export function sortByName(list) {
  return sortByString(list, 'name');
}

export function sortByString(list, key) {
  return sortByKey(list, elem => elem[key].toLowerCase());
}

export function sortByKey(list, key, order='asc') {
  return _.orderBy(list, [key], [order]);
}

export async function fetchAllRecordsUsingFetchWithBQ(fetchWithBQ, url, itemsPerPage, otherParams = null) {
  const fetch = async (page) => {
    const params = new URLSearchParams({
      pagination: true,
      page,
      itemsPerPage,
      ...otherParams,
    });
    const result = await fetchWithBQ(`${url}?${params.toString()}`);
    return result.data;

  };
  const firstRs = await fetch(1);

  if (!Object.hasOwn(firstRs, 'hydra:totalItems') || firstRs['hydra:totalItems'] <= firstRs['hydra:member'].length) {
    // Total items were already returned in the 1st request!
    return firstRs['hydra:member'];
  }

  // OK more pages are needed to be fetched to get all items..!
  const totalItems = firstRs['hydra:totalItems'];
  const maxPage = Math.trunc(totalItems / itemsPerPage) + (totalItems % itemsPerPage === 0 ? 0 : 1);

  return Promise
    .all(
      [...Array(maxPage+1).keys()]
      .slice(2)
      .map(page => fetch(page))
    )
    .then(results => results.reduce((acc, rs) => acc.concat(rs['hydra:member']), firstRs['hydra:member']));
}
