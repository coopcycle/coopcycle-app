import { isSameDayInTimezone } from '../../utils/timezone';

// `timezone` comes from the server settings (see selectTimezone). It must be
// passed explicitly: relying on the device timezone puts a task in the wrong
// day whenever the user is not in the same timezone as the store.
export function isSameDayTask(task, date, timezone) {
  return isSameDayInTimezone(task.doneBefore, date, timezone);
}

export function isSameDayTaskList(taskList, date, timezone) {
  return isSameDayInTimezone(taskList.date, date, timezone);
}

export function isSameDayTour(tour, date, timezone) {
  return isSameDayInTimezone(tour.date, date, timezone);
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
