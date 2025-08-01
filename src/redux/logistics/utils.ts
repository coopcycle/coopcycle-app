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
