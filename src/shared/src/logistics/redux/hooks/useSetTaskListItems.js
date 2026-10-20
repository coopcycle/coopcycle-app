import _ from 'lodash';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import {
  assignTasksFailure,
  assignTasksRequest,
  assignTasksSuccess,
  assignTasksWithUiUpdateSuccess,
  disableCentrifugoUpdateForTasksIds,
  disableCentrifugoUpdateForUsers,
  restoreCentrifugoUpdate,
  unassignTasksWithUiUpdateSuccess,
  updateTaskListsSuccess,
  updateTourSuccess,
} from '../actions';
import { buildSelectedTasks, getTasksListsToEdit } from '../taskListUtils';
import {
  findItemsNotDoableOn,
  getAssignedTask,
  getTaskListItemIds,
  getToursToUpdate,
} from '../taskUtils';
import {
  selectAllTours,
  selectSelectedDate,
  selectToursTasksIndex,
} from '../selectors';
import { UNASSIGNED_TASKS_LIST_ID } from '../../../constants';
import {
  useSetTaskListItemsMutation,
  useSetTourItemsMutation,
} from '../../../../../redux/api/slice';
import { selectTimezone } from '../../../../../utils/timezone';
import { isSameDayTaskList } from '../../../utils';
import i18n from '../../../../../i18n';

export default function useSetTaskListItems({ allTaskLists, tasksEntities }) {
  const allTasksRef = useRef([]);
  const tasksEntitiesRef = useRef({});
  const allTours = useSelector(selectAllTours);
  const timezone = useSelector(selectTimezone);
  const toursTasksIndex = useSelector(selectToursTasksIndex);
  const selectedDate = useSelector(selectSelectedDate);
  const dispatch = useDispatch();

  const [
    setTaskListItems,
    {
      isError: isErrorSetTaskListItems,
      isLoading: isLoadingSetTaskListItems,
      isSuccess: isSuccessSetTaskListItems,
    },
  ] = useSetTaskListItemsMutation();

  const [
    setTourItems,
    {
      isError: isErrorSetTourItems,
      isLoading: isLoadingSetTourItems,
      isSuccess: isSuccessSetTourItems,
    },
  ] = useSetTourItemsMutation();

  const isLoading = useMemo(
    () => isLoadingSetTaskListItems || isLoadingSetTourItems,
    [isLoadingSetTaskListItems, isLoadingSetTourItems],
  );

  const isSuccess = useMemo(
    () => isSuccessSetTaskListItems && isSuccessSetTourItems,
    [isSuccessSetTaskListItems, isSuccessSetTourItems],
  );

  const isError = useMemo(
    () => isErrorSetTaskListItems || isErrorSetTourItems,
    [isErrorSetTaskListItems, isErrorSetTourItems],
  );

  useEffect(() => {
    allTasksRef.current = Object.values(tasksEntities);
    tasksEntitiesRef.current = tasksEntities;
  }, [tasksEntities]);

  useEffect(() => {
    if (isLoading) {
      dispatch(assignTasksRequest());
    }
  }, [dispatch, isLoading]);

  useEffect(() => {
    if (isError) {
      dispatch(assignTasksFailure());
    }
  }, [dispatch, isError]);

  /**
   * Unassign just one task
   * @param {Task} task - Task to be unassigned
   */
  const unassignTask = useCallback(
    async task => {
      const selectedTasks = buildSelectedTasks([], [task], allTaskLists);
      return bulkEditTasks(selectedTasks);
    },
    [allTaskLists, bulkEditTasks],
  );

  /**
   * Unassign a task and its related tasks to rider
   * @param {Task} task - Task to be unassigned
   */
  const unassignTaskWithRelatedTasks = useCallback(
    async task => {
      const selectedTasks = buildSelectedTasks([task], [], allTaskLists);
      return bulkEditTasks(selectedTasks);
    },
    [allTaskLists, bulkEditTasks],
  );

  /**
   * Assign just one task to rider
   * @param {Task} task - Task to be assigned
   * @param {User} user - User of the rider to which we assign
   */
  const assignTask = useCallback(
    async (task, user) => {
      const selectedTasks = buildSelectedTasks([], [task], allTaskLists);
      return bulkEditTasks(selectedTasks, user);
    },
    [allTaskLists, bulkEditTasks],
  );

  /**
   * Assign a task and its related tasks to rider
   * @param {Task} task - Task to be assigned
   * @param {User} user - User of the rider to which we assign
   */
  const assignTaskWithRelatedTasks = useCallback(
    async (task, user) => {
      const selectedTasks = buildSelectedTasks([task], [], allTaskLists);
      return bulkEditTasks(selectedTasks, user);
    },
    [allTaskLists, bulkEditTasks],
  );

  /**
   * Reassign just one task to rider (remove it from previous rider)
   * @param {Task} task - Task to be reassigned
   * @param {User} user - User of the rider to which we assign
   */
  const reassignTask = useCallback(
    async (task, user) => {
      const selectedTasks = buildSelectedTasks([], [task], allTaskLists);
      return bulkEditTasks(selectedTasks, user);
    },
    [allTaskLists, bulkEditTasks],
  );

  /**
   * Reassign a task and its related tasks to rider(remove them from previous rider)
   * @param {Task} task - Task to be reassigned
   * @param {User} user - User of the rider to which we assign
   */
  const reassignTaskWithRelatedTasks = useCallback(
    async (task, user) => {
      const selectedTasks = buildSelectedTasks([task], [], allTaskLists);
      return bulkEditTasks(selectedTasks, user);
    },
    [allTaskLists, bulkEditTasks],
  );

  /**
   * Edit several tasks at once (and also their linked tasks)
   * @param {Array.Objects} tasks - Task to be un/assigned
   * @param {User} user - User of the rider to which we assign
   */
  const bulkEditTasks = useCallback(
    async (selectedTasks, user) => {
      const isJustUnassign = !user;
      const taskListToEdit = getTasksListsToEdit(
        selectedTasks,
        allTasksRef.current,
        allTaskLists,
      );
      const taskListToUnassign = { ...taskListToEdit };

      if (user) {
        // Skip unassigning the user that is going to be assigned later
        const userTaskList = allTaskLists.find(
          taskList => taskList.username === user.username,
        );
        if (userTaskList) {
          delete taskListToUnassign[userTaskList['@id']];
        }
      }
      delete taskListToUnassign[UNASSIGNED_TASKS_LIST_ID];

      try {
        const unassignResolve = await Promise.all(
          Object.values(taskListToUnassign).map(tasks =>
            _unassignTasks(tasks, isJustUnassign),
          ),
        );

        if (isJustUnassign) {
          return unassignResolve;
        }

        const tasksToAssign = _.flatten(Object.values(taskListToEdit));

        return await _assignTasks(tasksToAssign, user);
      } catch (e) {
        // `_updateAssignedItems` rejects rather than send a request that would
        // unassign a whole day (see the guards there). Tell the dispatcher,
        // otherwise the assignment just appears not to have happened.
        console.warn(e);
        dispatch(assignTasksFailure());
        Alert.alert(
          i18n.t('DISPATCH_ASSIGN_FAILED_TITLE'),
          i18n.t('DISPATCH_ASSIGN_FAILED_MESSAGE'),
        );
      } finally {
        // Must run on the failure path too: leaving Centrifugo updates disabled
        // freezes the board on every other dispatcher's screen as well.
        setTimeout(() => dispatch(restoreCentrifugoUpdate()), 500);
      }
    },
    [_assignTasks, _unassignTasks, allTaskLists, dispatch],
  );

  /**
   * Unassign tasks from a single/same courier
   * @param {Array} tasks - Tasks to be unassigned
   */
  const _unassignTasks = useCallback(
    (tasks, isJustUnassign) => {
      if (tasks.length === 0) {
        return Promise.resolve();
      }

      // DANGER: We are assuming that all tasks are assigned to the same user..!!!
      const user = { username: tasks[0].assignedTo };
      const userItemIds = getTaskListItemIds(user.username, allTaskLists);
      const itemsToUnassignIds = tasks.map(task => task['@id']);
      const itemsToUnassignIdsSet = new Set(itemsToUnassignIds);
      const allItemIdsToAssign = userItemIds.filter(
        itemId => !itemsToUnassignIdsSet.has(itemId),
      );

      dispatch(disableCentrifugoUpdateForTasksIds(itemsToUnassignIds));
      dispatch(disableCentrifugoUpdateForUsers(user.username));

      return _updateUnassigningItems(
        allItemIdsToAssign,
        user,
        itemsToUnassignIds,
        isJustUnassign,
      );
    },
    [_updateUnassigningItems, allTaskLists, dispatch],
  );

  const _assignTasks = useCallback(
    (tasks, user) => {
      const userItemIds = getTaskListItemIds(user.username, allTaskLists);
      const itemsToAssignIds = tasks.map(task => task['@id']);
      const allItemsToAssign = _.uniq([...userItemIds, ...itemsToAssignIds]);

      dispatch(disableCentrifugoUpdateForTasksIds(itemsToAssignIds));
      dispatch(disableCentrifugoUpdateForUsers(user.username));

      return _updateAssigningItems(allItemsToAssign, user, itemsToAssignIds);
    },
    [_updateAssigningItems, allTaskLists, dispatch],
  );

  const _updateUnassigningItems = useCallback(
    (newItemIds, user, removedItemIds, isJustUnassign) => {
      const previousToursTasksIndex = _.cloneDeep(toursTasksIndex);

      return _updateAssignedItems(newItemIds, user)
        .then(res =>
          _maybeRemoveTourTasks(removedItemIds, previousToursTasksIndex).then(
            _res => res,
          ),
        )
        .then(({ data: taskList }) => _updateTaskList(taskList))
        .then(() => _updateTasks(newItemIds, user, false))
        .then(() => isJustUnassign && _updateRemovedTasks(removedItemIds));
    },
    [
      _maybeRemoveTourTasks,
      _updateAssignedItems,
      _updateRemovedTasks,
      _updateTaskList,
      _updateTasks,
      toursTasksIndex,
    ],
  );

  const _updateAssigningItems = useCallback(
    (itemIds, user, addedItemIds) => {
      const previousToursTasksIndex = _.cloneDeep(toursTasksIndex);

      return _updateAssignedItems(itemIds, user, addedItemIds)
        .then(res =>
          _maybeRemoveTourTasks(itemIds, previousToursTasksIndex).then(
            _res => res,
          ),
        )
        .then(({ data: taskList }) => _updateTaskList(taskList))
        .then(() => _updateTasks(itemIds, user, true));
    },
    [
      _maybeRemoveTourTasks,
      _updateAssignedItems,
      _updateTaskList,
      _updateTasks,
      toursTasksIndex,
    ],
  );

  const _updateAssignedItems = useCallback(
    (itemIds, user, addedItemIds = []) => {
      const date = selectedDate.format('YYYY-MM-DD');

      // `set_items` is a PUT: the server unassigns every task on that day's
      // list that the payload omits, and it drops the items whose day does not
      // match before applying it. A payload that disagrees with the date in the
      // URL is therefore not a no-op — it empties somebody's day. Two local
      // inconsistencies used to do exactly that:
      //
      //  - the screen we were opened from had moved to another date while
      //    `selectedDate` had not, so the base we append to came from another
      //    day's lists and the PUT wiped the real one.
      //  - for the same reason the payload carried another day's tasks. The
      //    server dropped those and unassigned everything else on the list.
      //
      // Neither can be repaired server-side without guessing what the
      // dispatcher meant, so refuse to send the request. Aborting loses one
      // assignment the dispatcher can retry; sending it loses a whole day of
      // somebody else's.
      //
      // Holding no list at all is not a symptom: a courier has none until the
      // first assignment of the day, and `set_items` creates it.
      //
      // Neither is holding a list we cannot date. Only a list that states a
      // day is evidence of which day we are looking at, so undated ones are
      // left out of the question entirely rather than counted as a mismatch —
      // otherwise a payload the server dates perfectly well would be refused
      // here over a field the client happens not to have.
      const datedTaskLists = allTaskLists.filter(taskList => !!taskList.date);

      const holdsAnotherDay =
        datedTaskLists.length > 0 &&
        !datedTaskLists.some(taskList =>
          isSameDayTaskList(taskList, date, timezone),
        );

      if (holdsAnotherDay) {
        return Promise.reject(
          new Error(
            `Refusing to set the items of ${user.username}'s task list for ${date}: the task lists we hold are for another day, the request would unassign everything already on it`,
          ),
        );
      }

      // Only what we are adding: a list may still hold a task from another day
      // filed by an older client, and the server unassigns just that one when
      // it drops it. Refusing here would leave the dispatcher unable to touch
      // the list at all until the data is repaired.
      const notDoableOnDate = findItemsNotDoableOn(
        addedItemIds,
        tasksEntitiesRef.current,
        date,
        timezone,
      );

      if (notDoableOnDate.length > 0) {
        return Promise.reject(
          new Error(
            `Refusing to set the items of ${user.username}'s task list for ${date}: ${notDoableOnDate.join(', ')} cannot be carried out that day`,
          ),
        );
      }

      return setTaskListItems({
        items: itemIds,
        username: user.username,
        date,
      });
    },
    [allTaskLists, selectedDate, setTaskListItems, timezone],
  );

  const _maybeRemoveTourTasks = useCallback(
    (itemIds, previousToursIndexes) => {
      const toursToUpdate = getToursToUpdate(itemIds, previousToursIndexes);

      return Promise.all(
        Object.entries(toursToUpdate).map(([tourUrl, tourTasks]) =>
          setTourItems({ tourUrl, tourTasks }),
        ),
      ).then(() => {
        Object.entries(toursToUpdate).forEach(([tourId, tourTasks]) => {
          const tour = allTours.find(_tour => _tour['@id'] === tourId);
          const updatedTour = {
            ...tour,
            items: tourTasks,
          };
          dispatch(updateTourSuccess(updatedTour));
        });
      });
    },
    [allTours, dispatch, setTourItems],
  );

  const _updateTaskList = useCallback(
    taskList => {
      dispatch(updateTaskListsSuccess(taskList));
    },
    [dispatch],
  );

  const _updateTasks = useCallback(
    (itemIds, user, updateUi) => {
      const itemIdsSet = new Set(itemIds);
      const tasks = allTasksRef.current.filter(task =>
        itemIdsSet.has(task['@id']),
      );
      const newUserTasks = tasks.map(task =>
        getAssignedTask(task, user.username),
      );

      if (updateUi) {
        dispatch(assignTasksWithUiUpdateSuccess(newUserTasks));
      } else {
        dispatch(assignTasksSuccess(newUserTasks));
      }
    },
    [dispatch],
  );

  const _updateRemovedTasks = useCallback(
    removedTasks => {
      const itemIdsSet = new Set(removedTasks);
      const tasks = allTasksRef.current.filter(task =>
        itemIdsSet.has(task['@id']),
      );
      const newUnassignedTasks = tasks.map(task => getAssignedTask(task));
      dispatch(unassignTasksWithUiUpdateSuccess(newUnassignedTasks));
    },
    [dispatch],
  );

  return {
    assignTask,
    bulkEditTasks,
    assignTaskWithRelatedTasks,
    isError,
    isLoading,
    isSuccess,
    reassignTask,
    reassignTaskWithRelatedTasks,
    unassignTask,
    unassignTaskWithRelatedTasks,
  };
}
