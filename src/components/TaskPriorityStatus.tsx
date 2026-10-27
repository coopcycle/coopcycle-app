import moment from 'moment';
import Task from '../types/task';
import { View } from 'react-native';
import { minutes } from '../utils/dates';

export const TASK_PRIORITY_STRIPE_WIDTH = 6;

const OVERDUE = '#B42205';
const DUE_SOON = '#FFC300';

/**
 * The colour this task's time window calls for, or null when it calls for
 * none — a finished task, or one not due for a while yet.
 */
function priorityColor(task: Task): string | null {
  if (task.status === 'DONE' || task.status === 'FAILED') {
    return null;
  }

  // Positive for a task still to come, negative once it is overdue.
  const timeDifference = moment(task.doneBefore).diff(moment());

  if (timeDifference < 0) {
    return OVERDUE;
  }

  if (timeDifference < minutes(10)) {
    return DUE_SOON;
  }

  return null;
}

/**
 * The stripe down the right edge of a task row: red once it is overdue,
 * amber in the last ten minutes before it is.
 *
 * Always occupies its width, taking the row's own colour when there is
 * nothing to say. Rendering nothing instead would move everything to its
 * left by six pixels, so the reorder arrows on a row with a stripe would sit
 * out of line with those on a row without one.
 *
 * `rowColor` rather than `transparent`, because the row is swipeable: a
 * see-through strip would show the action revealed behind it.
 */
export const TaskPriorityStatus = ({
  task,
  rowColor,
}: {
  task: Task;
  rowColor: string;
}) => (
  <View
    // No corner radius of its own: the row's wrapper clips to the card shape,
    // so rounding here only ever rounded against a corner it sat inside.
    style={{
      width: TASK_PRIORITY_STRIPE_WIDTH,
      height: '100%',
      backgroundColor: priorityColor(task) ?? rowColor,
    }}
  />
);
