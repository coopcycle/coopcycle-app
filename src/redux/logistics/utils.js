import _ from 'lodash';


/**
 * @param   {Task[]}    tasks   List of tasks to be filtered
 * @param   {Object[]}  filters List of exclusion filters, e.g. [{ status: 'done' }]
 * @returns {Task[]}            List of tasks not excluded by filters
 */
export function filterTasks(tasks, filters) {
    return _.reject(
      tasks,
      task => filters.some(filter => doesFilterMatch(filter, task))
    );
}

/**
 * @param   {Object} filter Exclusion filter, e.g. { status: 'done' }
 * @param   {Task}   task   Plain object describing task (see taskEntityReducer for structure)
 * @returns {Boolean}       Does the filter match the given task?
 */
function doesFilterMatch(filter, task) {
  return Object.keys(filter).reduce(
    (acc, filterKey) =>
      acc || filterKey === 'tags'
        ? task.tags.map(t => t.name).includes(filter[filterKey])
        : task[filterKey] === filter[filterKey],
    false,
  );
}
