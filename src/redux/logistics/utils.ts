import _ from 'lodash';

import { taskIncludesKeyword } from '../../shared/src/logistics/redux/taskUtils';

/**
 * @param   {Task[]}    tasks   List of tasks to be filtered
 * @param   {Object[]}  filters List of exclusion filters, e.g. [{ status: 'done' }]
 * @returns {Task[]}            List of tasks not excluded by filters
 */
export function filterTasks(tasks, filters) {
  return _.reject(tasks, task =>
    filters.some(filter => doesFilterMatch(filter, task)),
  );
}

/**
 * @param   {Object} filter Exclusion filter, e.g. { status: 'done' }
 * @param   {Task}   task   Plain object describing task (see taskEntityReducer for structure)
 * @returns {Boolean}       Does the filter match the given task?
 */
function doesFilterMatch(filter, task) {
  return Object.keys(filter).reduce((acc, filterKey) => {
    if (acc) {
      return acc;
    }

    if (filterKey === 'tags') {
      return task.tags.map(t => t.name).includes(filter.tags);
    }

    if (filterKey === 'keyword') {
      if (isKeywordFilterNegative(filter)) {
        const keyword = getKeywordFromNegativeFilter(filter);
        return taskIncludesKeyword(task, keyword);
      } else {
        return !taskIncludesKeyword(task, filter.keyword);
      }
    }

    return task[filterKey] === filter[filterKey];
  }, false);
}

export function isKeywordFilterNegative(filter) {
  return filter.keyword.slice(0, 1) === '-';
}

function getKeywordFromNegativeFilter(filter) {
  return filter.keyword.slice(1);
}

/**
 * Groups tasks by their order number, keeping the order they appear in.
 *
 * Tasks with no order number are grouped under the `undefined` key, which is
 * what `getOrderNumber()` returns for them.
 *
 * @param   {Task[]}                 tasks List of tasks
 * @returns {Map<string|undefined, Task[]>}
 */
export function indexTasksByOrder(tasks) {
  const index = new Map();

  for (const task of tasks) {
    const orderNumber = task.metadata?.order_number;
    const bucket = index.get(orderNumber);

    if (bucket) {
      bucket.push(task);
    } else {
      index.set(orderNumber, [task]);
    }
  }

  return index;
}
