import _ from 'lodash';

import { taskIncludesKeyword } from '../../shared/src/logistics/redux/taskUtils';

/**
 * @param   {Task[]}    tasks   List of tasks to be filtered
 * @param   {Object[]}  filters List of exclusion filters, e.g. [{ status: 'done' }]
 * @returns {Task[]}            List of tasks not excluded by filters
 */
export function filterTasks(tasks, filters) {
  // Tag rules are applied as a group rather than one by one: a task carrying
  // several tags would otherwise be dropped as soon as any one of them was
  // hidden, even while another of its tags was still shown.
  const hiddenTags = filters
    .filter(filter => filter.tags !== undefined)
    .map(filter => filter.tags);
  const isUntaggedHidden = filters.some(filter => filter.untagged);
  const otherFilters = filters.filter(
    filter => filter.tags === undefined && !filter.untagged,
  );

  return _.reject(
    tasks,
    task =>
      otherFilters.some(filter => doesFilterMatch(filter, task)) ||
      isHiddenByTags(task, hiddenTags, isUntaggedHidden),
  );
}

/**
 * @param   {Task}     task             Plain object describing task
 * @param   {String[]} hiddenTags       Names of the tags being filtered out
 * @param   {Boolean}  isUntaggedHidden Are the tasks carrying no tag excluded?
 * @returns {Boolean}                   Is the task hidden by the tag filters?
 */
function isHiddenByTags(task, hiddenTags, isUntaggedHidden) {
  const taskTags = (task.tags || []).map(tag => tag.name);

  // A task with no tags at all is only hidden by the untagged rule, and one
  // shown tag is enough to keep a tagged task.
  if (taskTags.length === 0) {
    return isUntaggedHidden;
  }

  return taskTags.every(name => hiddenTags.includes(name));
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
