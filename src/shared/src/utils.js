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

export function getDropoffPosition(task, tasks) {
  if (!task || !Array.isArray(tasks)) return '';
  
  const validDropoffs = tasks.filter(
    t => t.type === 'DROPOFF' && t.status !== 'CANCELLED',
  );

  const taskCurrentPosition = validDropoffs.findIndex(t => t.id === task.id);

  if (taskCurrentPosition === -1) return '';

  return `(${taskCurrentPosition + 1}/${validDropoffs.length})`;
}

export function getDropoffCount(tasks) {
  const dropoffOrderTasks = tasks.filter(
    t => t.type === 'DROPOFF' && t.status !== 'CANCELLED'
  );
  return dropoffOrderTasks.length;
}
