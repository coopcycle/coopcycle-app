import _ from 'lodash';


export function findTaskListByUsername(taskListsById, username) {
  return _.find(Object.values(taskListsById), t => t.username == username);
}

export function findTaskListByTask(taskListsById, task) {
  return _.find(Object.values(taskListsById), taskList => {
    return _.includes(taskList.itemIds, task['@id']);
  });
}
