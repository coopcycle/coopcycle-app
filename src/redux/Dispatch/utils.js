import moment from 'moment';

export function isSameDateTask(task, date) {
  return moment(task.doneBefore).isSame(date, 'day');
}

export function isSameDateTaskList(taskList, date) {
  return moment(taskList.date).isSame(date, 'day');
}
