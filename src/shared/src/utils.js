import {
  isDayWithinRangeInTimezone,
  isSameDayInTimezone,
} from '../../utils/timezone';

// `timezone` comes from the server settings (see selectTimezone). It must be
// passed explicitly: relying on the device timezone puts a task in the wrong
// day whenever the user is not in the same timezone as the store.
export function isSameDayTask(task, date, timezone) {
  return isSameDayInTimezone(task.doneBefore, date, timezone);
}

/**
 * Whether `task` can be carried out on `date`, i.e. whether `date` falls inside
 * the task's [doneAfter, doneBefore] window.
 *
 * Deliberately wider than `isSameDayTask`, which only looks at `doneBefore`: a
 * multi-day task legitimately belongs to the list of any day of its window, and
 * that is the rule the API enforces when it accepts items on a task list.
 *
 * A task we cannot date (no window on the local copy) is let through, so that a
 * missing field never blocks a dispatcher; the server has the last word.
 */
export function canTaskBeDoneOn(task, date, timezone) {
  const after = task.doneAfter || task.after;
  const before = task.doneBefore || task.before;

  if (!after || !before) {
    return true;
  }

  return isDayWithinRangeInTimezone(date, after, before, timezone);
}

/**
 * Whether `taskList` is the list of `date`.
 *
 * A list that carries no date answers `false`, never "today": `moment.tz`
 * reads a missing input as *now*, which silently turned every caller into a
 * "is the selected date today?" test. That is how the cross-day guard in
 * `useSetTaskListItems` came to refuse every assignment made from a board
 * showing any day but the current one.
 */
export function isSameDayTaskList(taskList, date, timezone) {
  if (!taskList?.date) {
    return false;
  }

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
