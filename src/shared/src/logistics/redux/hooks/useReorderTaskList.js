import { useCallback, useRef } from 'react';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';

import { updateTaskListsSuccess } from '../actions';
import { getUserTaskList, isServerTaskList } from '../taskListUtils';
import { useSetTaskListOrderMutation } from '../../../../../redux/api/slice';
import i18n from '../../../../../i18n';

export const MOVE_UP = -1;
export const MOVE_DOWN = 1;

/**
 * Where a task sits in its courier's list, and whether it can be moved.
 *
 * A task list holds tasks and tours, and the board flattens a tour into the
 * tasks it carries — so a row on screen is not always an item of the list.
 * One that is not cannot be moved from here: its item is the tour, and
 * shifting that would move every task in it at once, which is not what
 * tapping an arrow on one row looks like it should do.
 *
 * @param {Object} task
 * @param {Array} allTaskLists
 *
 * @returns {{taskList: Object, items: Array.string, index: number}|null}
 */
export function locateInTaskList(task, allTaskLists) {
  if (!task?.assignedTo) {
    return null;
  }

  const taskList = getUserTaskList(task.assignedTo, allTaskLists ?? []);

  if (!isServerTaskList(taskList)) {
    return null;
  }

  const items = taskList.itemIds ?? [];
  const index = items.indexOf(task['@id']);

  if (index === -1) {
    return null;
  }

  return { taskList, items, index };
}

export function canMove(task, allTaskLists, direction) {
  const at = locateInTaskList(task, allTaskLists);

  if (!at) {
    return false;
  }

  const to = at.index + direction;

  return to >= 0 && to < at.items.length;
}

/**
 * Move one task up or down its courier's list.
 *
 * Ordering is sent as a whole — it is the one write that has to be, since a
 * position only means anything relative to everything else — so it goes to
 * `PUT /api/task_lists/{id}/order`, which refuses a payload that would change
 * which items are on the list and requires the version it was built from.
 *
 * @see https://github.com/coopcycle/coopcycle-web/issues/5372
 */
export default function useReorderTaskList({ allTaskLists }) {
  const dispatch = useDispatch();
  const [setTaskListOrder, { isLoading }] = useSetTaskListOrderMutation();

  // Read through this rather than off the prop: these callbacks are handed to
  // memoized rows, and the board re-renders under them constantly.
  const allTaskListsRef = useRef(allTaskLists);
  allTaskListsRef.current = allTaskLists;

  const moveTask = useCallback(
    async (task, direction) => {
      const at = locateInTaskList(task, allTaskListsRef.current);

      if (!at) {
        return;
      }

      const to = at.index + direction;

      if (to < 0 || to >= at.items.length) {
        return;
      }

      const { taskList, items, index } = at;

      const reordered = [...items];
      reordered[index] = items[to];
      reordered[to] = items[index];

      // Move the row now. A reorder is judged by the list jumping under the
      // finger, and waiting for the round trip makes every tap feel broken.
      dispatch(updateTaskListsSuccess({ ...taskList, items: reordered }));

      const { data, error } = await setTaskListOrder({
        taskListUrl: taskList['@id'],
        items: reordered,
        version: taskList.version,
      });

      if (error) {
        // Put back what we know was real. A 409 means somebody else reordered
        // or reassigned this list while we were looking at it, so our order
        // was built against a list that no longer exists — replaying it would
        // undo their change.
        dispatch(updateTaskListsSuccess({ ...taskList, items }));
        Alert.alert(
          i18n.t('DISPATCH_REORDER_FAILED_TITLE'),
          i18n.t('DISPATCH_REORDER_FAILED_MESSAGE'),
        );

        return;
      }

      dispatch(updateTaskListsSuccess(data));
    },
    [dispatch, setTaskListOrder],
  );

  return { moveTask, isLoading };
}
