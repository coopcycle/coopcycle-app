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
import {
  buildSelectedTasks,
  getTasksListsToEdit,
  getUserTaskList,
  isServerTaskList,
  supportsTaskListItemsApi,
} from '../taskListUtils';
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
  useAddTaskListItemsMutation,
  useCreateTaskListMutation,
  useRemoveTaskListItemsMutation,
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
  // The couriers as /api/users returned them, which is the only place an IRI
  // for one can be had — see `_openTaskList`.
  const courierUsers = useSelector(state => state.dispatch.users);
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

  const [createTaskList, { isError: isErrorCreateTaskList }] =
    useCreateTaskListMutation();

  const [
    addTaskListItems,
    {
      isError: isErrorAddItems,
      isLoading: isLoadingAddItems,
      isSuccess: isSuccessAddItems,
    },
  ] = useAddTaskListItemsMutation();

  const [
    removeTaskListItems,
    {
      isError: isErrorRemoveItems,
      isLoading: isLoadingRemoveItems,
      isSuccess: isSuccessRemoveItems,
    },
  ] = useRemoveTaskListItemsMutation();

  /**
   * Whether this instance serves the items endpoints. Decided from the lists
   * on the board rather than configured, because the app meets instances on
   * either side of the upgrade.
   */
  const useItemsApi = useMemo(
    () => supportsTaskListItemsApi(allTaskLists),
    [allTaskLists],
  );

  const isLoading = useMemo(
    () =>
      isLoadingSetTaskListItems ||
      isLoadingSetTourItems ||
      isLoadingAddItems ||
      isLoadingRemoveItems,
    [
      isLoadingAddItems,
      isLoadingRemoveItems,
      isLoadingSetTaskListItems,
      isLoadingSetTourItems,
    ],
  );

  const isSuccess = useMemo(
    () =>
      (useItemsApi
        ? isSuccessAddItems || isSuccessRemoveItems
        : isSuccessSetTaskListItems) && isSuccessSetTourItems,
    [
      isSuccessAddItems,
      isSuccessRemoveItems,
      isSuccessSetTaskListItems,
      isSuccessSetTourItems,
      useItemsApi,
    ],
  );

  const isError = useMemo(
    () =>
      isErrorSetTaskListItems ||
      isErrorSetTourItems ||
      isErrorAddItems ||
      isErrorRemoveItems ||
      isErrorCreateTaskList,
    [
      isErrorAddItems,
      isErrorCreateTaskList,
      isErrorRemoveItems,
      isErrorSetTaskListItems,
      isErrorSetTourItems,
    ],
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
      const itemsToUnassignIds = tasks.map(task => task['@id']);

      dispatch(disableCentrifugoUpdateForTasksIds(itemsToUnassignIds));
      dispatch(disableCentrifugoUpdateForUsers(user.username));

      return _updateUnassigningItems(user, itemsToUnassignIds, isJustUnassign);
    },
    [_updateUnassigningItems, dispatch],
  );

  const _assignTasks = useCallback(
    (tasks, user) => {
      const itemsToAssignIds = tasks.map(task => task['@id']);

      dispatch(disableCentrifugoUpdateForTasksIds(itemsToAssignIds));
      dispatch(disableCentrifugoUpdateForUsers(user.username));

      return _updateAssigningItems(itemsToAssignIds, user);
    },
    [_updateAssigningItems, dispatch],
  );

  const _updateUnassigningItems = useCallback(
    (user, removedItemIds, isJustUnassign) => {
      const previousToursTasksIndex = _.cloneDeep(toursTasksIndex);

      return _writeUnassignment(removedItemIds, user)
        .then(res =>
          _maybeRemoveTourTasks(removedItemIds, previousToursTasksIndex).then(
            _res => res,
          ),
        )
        .then(taskList => {
          _updateTaskList(taskList);

          // What the list still holds, as the server just reported it, rather
          // than a complement worked out here. On the items path we never
          // compute one, and taking the server's answer means the board shows
          // what was actually written either way.
          _updateTasks(taskList?.items ?? [], user, false);
        })
        .then(() => isJustUnassign && _updateRemovedTasks(removedItemIds));
    },
    [
      _maybeRemoveTourTasks,
      _updateRemovedTasks,
      _updateTaskList,
      _updateTasks,
      _writeUnassignment,
      toursTasksIndex,
    ],
  );

  const _updateAssigningItems = useCallback(
    (addedItemIds, user) => {
      const previousToursTasksIndex = _.cloneDeep(toursTasksIndex);

      return _writeAssignment(addedItemIds, user)
        .then(res =>
          // Only what is joining the list. The whole list used to be passed
          // here, but a task already on it has already left its tour, so
          // `getToursToUpdate` found nothing for it anyway.
          _maybeRemoveTourTasks(addedItemIds, previousToursTasksIndex).then(
            _res => res,
          ),
        )
        .then(taskList => _updateTaskList(taskList))
        .then(() => _updateTasks(addedItemIds, user, true));
    },
    [
      _maybeRemoveTourTasks,
      _updateTaskList,
      _updateTasks,
      _writeAssignment,
      toursTasksIndex,
    ],
  );

  /**
   * The task list a mutation answered with, or a rejection carrying `reason`.
   *
   * RTK Query resolves to `{ error }` rather than throwing, and the chain that
   * follows used to read `data` off that without looking: a failed write
   * reached the board as an undefined task list, and an unassignment went on
   * to mark the tasks unassigned in the UI as though it had worked. Refusing
   * here puts those on the failure path, where the dispatcher is told.
   */
  const _requireTaskList = useCallback(({ data, error }, reason) => {
    if (error || !data) {
      throw new Error(reason);
    }

    return data;
  }, []);

  /**
   * The task list to write to, opening one if the courier holds none yet.
   *
   * The items endpoints are keyed by task list id, where `set_items` was
   * keyed by date and username and created the list on the way. Creating it
   * is idempotent server-side, so there is nothing to remember between calls.
   */
  const _openTaskList = useCallback(
    async (user, date) => {
      const existing = getUserTaskList(user.username, allTaskLists);

      if (isServerTaskList(existing)) {
        return existing['@id'];
      }

      // `user` reaches us from two places, and only one of them carries an
      // IRI: self-assignment passes the logged-in `AppUser`, which is built
      // from a username and a token. The dispatch users are the ones read
      // from /api/users, so look the courier up there.
      const courier =
        user['@id'] ??
        courierUsers.find(({ username }) => username === user.username)?.[
          '@id'
        ];

      if (!courier) {
        throw new Error(
          `Cannot open a task list for ${user.username}: no IRI known for that courier`,
        );
      }

      const { data, error } = await createTaskList({ courier, date });

      if (error || !data?.['@id']) {
        throw new Error(
          `Could not open a task list for ${user.username} on ${date}`,
        );
      }

      return data['@id'];
    },
    [allTaskLists, courierUsers, createTaskList],
  );

  /**
   * Put items on a courier's list, naming only what is being added.
   *
   * On an instance that has the items endpoints this is a delta, so a board
   * that has not heard of a task can no longer unassign it by staying silent
   * about it. On an older one it still has to be expressed as the whole list,
   * with the guards in `_updateAssignedItems`.
   *
   * @see https://github.com/coopcycle/coopcycle-web/issues/5372
   */
  const _writeAssignment = useCallback(
    async (addedItemIds, user) => {
      const date = selectedDate.format('YYYY-MM-DD');

      if (!useItemsApi) {
        const userItemIds = getTaskListItemIds(user.username, allTaskLists);

        return _requireTaskList(
          await _updateAssignedItems(
            _.uniq([...userItemIds, ...addedItemIds]),
            user,
            addedItemIds,
          ),
          `Could not put ${addedItemIds.join(', ')} on ${user.username}'s task list`,
        );
      }

      _assertItemsBelongOn(addedItemIds, user, date);

      const taskListUrl = await _openTaskList(user, date);

      // No position: the app has no way to order a list, so it should not
      // claim a place in one. The server appends.
      return _requireTaskList(
        await addTaskListItems({ taskListUrl, items: addedItemIds }),
        `Could not put ${addedItemIds.join(', ')} on ${user.username}'s task list`,
      );
    },
    [
      _assertItemsBelongOn,
      _openTaskList,
      _requireTaskList,
      _updateAssignedItems,
      addTaskListItems,
      allTaskLists,
      selectedDate,
      useItemsApi,
    ],
  );

  /**
   * Take items off a courier's list, naming them.
   *
   * One request for the batch. Removing an item renumbers the ones that
   * remain, so taking several off one request at a time had them all
   * rewriting the same rows and deadlocking against each other.
   */
  const _writeUnassignment = useCallback(
    async (removedItemIds, user) => {
      if (!useItemsApi) {
        const userItemIds = getTaskListItemIds(user.username, allTaskLists);
        const removed = new Set(removedItemIds);

        return _requireTaskList(
          await _updateAssignedItems(
            userItemIds.filter(itemId => !removed.has(itemId)),
            user,
          ),
          `Could not take ${removedItemIds.join(', ')} off ${user.username}'s task list`,
        );
      }

      const taskList = getUserTaskList(user.username, allTaskLists);

      if (!isServerTaskList(taskList)) {
        // Nothing was ever written for this courier, so there is nothing to
        // take off. Opening a list here only to empty it would be noise.
        return undefined;
      }

      return _requireTaskList(
        await removeTaskListItems({
          taskListUrl: taskList['@id'],
          items: removedItemIds,
        }),
        `Could not take ${removedItemIds.join(', ')} off ${user.username}'s task list`,
      );
    },
    [
      _requireTaskList,
      _updateAssignedItems,
      allTaskLists,
      removeTaskListItems,
      useItemsApi,
    ],
  );

  /**
   * Refuse a write whose items do not belong on `date`, before sending it.
   *
   * The server drops items it cannot carry out on the day of the list before
   * applying anything. What that costs depends on the endpoint:
   *
   *  - on `set_items`, a PUT, the surviving payload is still taken as the
   *    whole list, so dropping items unassigns everything else on it. A
   *    payload that disagrees with the date in the URL empties somebody's
   *    day. Two local inconsistencies used to do exactly that: the screen we
   *    were opened from had moved to another date while `selectedDate` had
   *    not, so both the base we appended to and the tasks we sent came from
   *    another day.
   *  - on the items endpoints nothing is replaced, so the same mistake is a
   *    silent no-op instead. Still worth refusing — a drag that quietly does
   *    nothing is its own kind of bug — but it is no longer destructive.
   *
   * Holding no list at all is not a symptom: a courier has none until the
   * first assignment of the day. Neither is holding a list we cannot date.
   * Only a list that states a day is evidence of which day we are looking at,
   * so undated ones are left out of the question entirely rather than counted
   * as a mismatch — otherwise a payload the server dates perfectly well would
   * be refused here over a field the client happens not to have.
   */
  const _assertItemsBelongOn = useCallback(
    (addedItemIds, user, date) => {
      const datedTaskLists = allTaskLists.filter(taskList => !!taskList.date);

      const holdsAnotherDay =
        datedTaskLists.length > 0 &&
        !datedTaskLists.some(taskList =>
          isSameDayTaskList(taskList, date, timezone),
        );

      if (holdsAnotherDay) {
        throw new Error(
          `Refusing to write ${user.username}'s task list for ${date}: the task lists we hold are for another day`,
        );
      }

      // Only what we are adding: a list may still hold a task from another day
      // filed by an older client, and refusing over it would leave the
      // dispatcher unable to touch the list at all until the data is repaired.
      const notDoableOnDate = findItemsNotDoableOn(
        addedItemIds,
        tasksEntitiesRef.current,
        date,
        timezone,
      );

      if (notDoableOnDate.length > 0) {
        throw new Error(
          `Refusing to write ${user.username}'s task list for ${date}: ${notDoableOnDate.join(', ')} cannot be carried out that day`,
        );
      }
    },
    [allTaskLists, timezone],
  );

  /**
   * @deprecated The whole-list PUT. Only reached on instances that predate the
   *   items endpoints — see `supportsTaskListItemsApi`.
   */
  const _updateAssignedItems = useCallback(
    async (itemIds, user, addedItemIds = []) => {
      const date = selectedDate.format('YYYY-MM-DD');

      _assertItemsBelongOn(addedItemIds, user, date);

      return setTaskListItems({
        items: itemIds,
        username: user.username,
        date,
      });
    },
    [_assertItemsBelongOn, selectedDate, setTaskListItems],
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
      // Nothing was written — the courier held no list to take items off.
      // Upserting an undefined list here would empty the board's entry for
      // whoever it landed under.
      if (!taskList) {
        return;
      }

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
