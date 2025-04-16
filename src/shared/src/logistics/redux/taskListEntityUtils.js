import _ from 'lodash';


export function findTaskListByUsername(taskListsById, username) {
  return _.find(Object.values(taskListsById), t => t.username == username);
}

export function findTaskListByTask(taskListsById, task) {
  return _.find(Object.values(taskListsById), taskList => {
    return _.includes(taskList.itemIds, task['@id']);
  });
}

export function addAssignedTask(taskListsById, task) {
  const taskListsToUpdate = [];

  let currentTaskList = findTaskListByTask(taskListsById, task);
  let targetTaskList = findTaskListByUsername(taskListsById, task.assignedTo);

  if (currentTaskList) {
    if (targetTaskList.username !== currentTaskList.username) {
      //unassign
      taskListsToUpdate.push({
        ...currentTaskList,
        itemIds: removeTaskId(currentTaskList.itemIds, task['@id']),
      });
    } else {
      return [];
    }
  }

  //assign
  if (targetTaskList) {
    taskListsToUpdate.push({
      ...targetTaskList,
      itemIds: addTaskIdIfMissing(targetTaskList.itemIds, task['@id']),
    });
  } else {
    let newTaskList = createTempTaskList(task.assignedTo, [task['@id']]);
    newTaskList = replaceTasksWithIds(newTaskList);

    taskListsToUpdate.push(newTaskList);
  }

  return taskListsToUpdate;
}

export function addAssignedTasks(taskListsById, tasks) {
  let taskList = addAssignedTask(taskListsById, tasks[0])[0];

  taskList = tasks.slice(1).reduce(
    (res, task) => {
      taskList = {
        ...res,
        itemIds: addTaskIdIfMissing(res.itemIds, task['@id']),
      };
      return taskList;
    },
    taskList,
  );

  return taskList;
}

export function removeUnassignedTask(taskListsById, task) {
  const taskListsToUpdate = [];

  let taskList = findTaskListByTask(taskListsById, task);

  if (taskList) {
    //unassign
    taskListsToUpdate.push({
      ...taskList,
      itemIds: removeTaskId(taskList.itemIds, task['@id']),
    });
  }

  return taskListsToUpdate;
}
