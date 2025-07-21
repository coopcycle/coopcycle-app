import moment from 'moment';
import i18n from '../../i18n';

export function isSameDayTask(task, date) {
  return moment(task.doneBefore).isSame(date, 'day');
}

export function isSameDayTaskList(taskList, date) {
  return moment(taskList.date).isSame(date, 'day');
}

export function isSameDayTour(tour, date) {
  return moment(tour.date).isSame(date, 'day');
}

export function getTaskTitle(task) {
  return task.orgName
    ? task.metadata.order_number
      ? task.orgName
      : `${task.orgName} - ${i18n.t('TASK_WITH_ID', { id: task.id })}`
    : i18n.t('TASK_WITH_ID', { id: task.id });
}
