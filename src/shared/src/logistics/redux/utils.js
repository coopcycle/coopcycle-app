import moment from 'moment';

export function isSameDayTask(task, date) {
  return moment(task.doneBefore).isSame(date, 'day');
}

export function isSameDayTaskList(taskList, date) {
  return moment(taskList.date).isSame(date, 'day');
}

export function isSameDayTour(tour, date) {
  return moment(tour.date).isSame(date, 'day');
}
