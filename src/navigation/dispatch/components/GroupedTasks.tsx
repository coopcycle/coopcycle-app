import { useNavigation } from '@react-navigation/native';
import { SectionList } from 'react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import {
  addOrder,
  addTask,
  clearSelectedTasks,
  removeTasksAndOrders,
} from '../../../redux/Dispatch/updateSelectedTasksSlice';
import {
  AssignOrderIcon,
  AssignTaskIcon,
} from '../../task/styles/common';
import {
  createTempTaskList,
  createUnassignedTaskLists,
  getLinkedTasks,
  getTaskListTasks,
  getTasksListIdsToEdit,
  getUserTaskList,
} from '../../../shared/src/logistics/redux/taskListUtils';
import {
  darkGreyColor,
  darkRedColor,
  whiteColor,
} from '../../../styles/common';
import { navigateToOrder, navigateToTask } from '../../../navigation/utils';
import { UNASSIGNED_TASKS_LIST_ID } from '../../../shared/src/constants';
import {
  selectSelectedDate,
  selectTaskLists,
  selectTasksEntities,
} from '../../../shared/logistics/redux';
import { withLinkedTasks } from '../../../shared/src/logistics/redux/taskUtils';
import BulkEditTasksFloatingButton from './BulkEditTasksFloatingButton';
import TaskList from '../../../components/TaskList';
import useSetTaskListItems from '../../../shared/src/logistics/redux/hooks/useSetTaskListItems';
import { getOrderNumber } from '../../../utils/tasks';
import { useRecurrenceRulesGenerateOrdersMutation } from '../../../redux/api/slice';
import { SectionHeader } from './SectionHeader';
import { useTaskLongPress } from '../hooks/useTaskLongPress';

export default function GroupedTasks({
  hideEmptyTaskLists,
  isFetching,
  refetch,
  route,
  taskLists,
  unassignedTasks,
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const tasksEntities = useSelector(selectTasksEntities);
  const allTaskLists = useSelector(selectTaskLists);
  const date = useSelector(selectSelectedDate)
  const [generateOrders] = useRecurrenceRulesGenerateOrdersMutation()

  useEffect(() => {generateOrders(date.format('YYYY-MM-DD'))}, [generateOrders, date]);

  const unassignedTaskLists = createUnassignedTaskLists(unassignedTasks);
  // Combine unassigned tasks and task lists to use in SectionList
  const sections = useMemo(
    () => [
      {
        backgroundColor: whiteColor,
        data: [createTempTaskList(UNASSIGNED_TASKS_LIST_ID, unassignedTasks)],
        id: UNASSIGNED_TASKS_LIST_ID,
        isUnassignedTaskList: true,
        ordersCount: unassignedTaskLists.length,
        taskListId: UNASSIGNED_TASKS_LIST_ID,
        tasksCount: unassignedTasks.length,
        textColor: darkGreyColor,
        title: t('DISPATCH_UNASSIGNED_TASKS'),
      },
      ...taskLists.map(taskList => ({
        backgroundColor: taskList.color ? taskList.color : darkGreyColor,
        data: [taskList],
        id: `${taskList.username.toLowerCase()}TasksList`,
        appendTaskListTestID: taskList.appendTaskListTestID,
        isUnassignedTaskList: false,
        ordersCount: 0,
        taskListId: taskList['@id'],
        tasksCount: taskList.tasksIds.length,
        textColor: whiteColor,
        title: taskList.username,
      })),
    ],
    [t, taskLists, unassignedTaskLists.length, unassignedTasks],
  );

  const filteredSections = hideEmptyTaskLists
    ? sections.filter(section => section.tasksCount > 0)
    : sections;

  // collapsable
  const [collapsedSections, setCollapsedSections] = useState(new Set());

  // Update tasks functions
  const {
    assignTask,
    bulkEditTasks,
    assignTaskWithRelatedTasks,
    reassignTask,
    reassignTaskWithRelatedTasks,
    unassignTask,
    unassignTaskWithRelatedTasks,
  } = useSetTaskListItems({
    allTaskLists,
    tasksEntities,
  });

  const onOrderClick = useCallback(
    task => {
      const orderNumber = getOrderNumber(task);
      navigateToOrder(navigation, orderNumber);
    },
    [navigation],
  );

  const onTaskClick = useCallback(
    isUnassignedTaskList => task => {
      // If task is unassigned, related tasks are order's tasks
      // If task is assigned, related tasks are task's task list's tasks
      if (isUnassignedTaskList) {
        const allTasks = Object.values(tasksEntities);
        const allRelatedTasks = withLinkedTasks(task, allTasks);
        navigateToTask(navigation, route, task, allRelatedTasks);
      } else {
        const username = task.assignedTo;
        const taskList = getUserTaskList(username, allTaskLists);
        const relatedTasks = getTaskListTasks(taskList, tasksEntities);
        navigateToTask(navigation, route, task, relatedTasks);
      }
    },
    [allTaskLists, navigation, route, tasksEntities],
  );

  const assignTaskWithRelatedTasksHandler = useCallback(
    isUnassignedTaskList => task => {
      const onItemPress = user =>
        onSelectNewAssignation(() =>
          (isUnassignedTaskList
            ? assignTaskWithRelatedTasks
            : reassignTaskWithRelatedTasks)(task, user),
        );

      const onUnassignButtonPress = () =>
        onSelectNewAssignation(() => unassignTaskWithRelatedTasks(task));

      navigation.navigate('DispatchPickUser', {
        onItemPress,
        onUnassignButtonPress,
        showUnassignButton: !isUnassignedTaskList,
      });
    },
    [
      onSelectNewAssignation,
      assignTaskWithRelatedTasks,
      navigation,
      reassignTaskWithRelatedTasks,
      unassignTaskWithRelatedTasks,
    ],
  );

  const assignTaskHandler = useCallback(
    isUnassignedTaskList => task => {
      const onItemPress = user =>
        onSelectNewAssignation(() =>
          (isUnassignedTaskList ? assignTask : reassignTask)(task, user),
        );

      const onUnassignButtonPress = () =>
        onSelectNewAssignation(() => unassignTask(task));

      navigation.navigate('DispatchPickUser', {
        onItemPress,
        showUnassignButton: !isUnassignedTaskList,
        onUnassignButtonPress,
      });
    },
    [
      onSelectNewAssignation,
      assignTask,
      navigation,
      reassignTask,
      unassignTask,
    ],
  );

  const onSelectNewAssignation = useCallback(
    callback => {
      navigation.navigate('DispatchAllTasks');
      callback();
    },
    [navigation],
  );

  const handleOnSwipeToLeft = useCallback(
    taskListId => task => {
      const allTasks = Object.values(tasksEntities);
      const tasksByTaskList = getLinkedTasks(
        task,
        taskListId,
        allTasks,
        allTaskLists,
      );

      dispatch(addOrder(tasksByTaskList));
    },
    [allTaskLists, dispatch, tasksEntities],
  );

  const handleOnSwipeToRight = useCallback(
    taskListId => task => {
      dispatch(addTask({ task, taskListId }));
    },
    [dispatch],
  );

  const handleOnSwipeClose = useCallback(
    (section, task) => {
      const taskListId = section.taskListId;
      const allTasks = Object.values(tasksEntities);
      const tasksByTaskList = getLinkedTasks(
        task,
        taskListId,
        allTasks,
        allTaskLists,
      );

      dispatch(removeTasksAndOrders(tasksByTaskList));
    },
    [allTaskLists, dispatch, tasksEntities],
  );

  const handleBulkAssignButtonPress = useCallback(
    selectedTasks => {
      const tasksListIdsToEdit = getTasksListIdsToEdit(selectedTasks);
      const showUnassignButton =
        tasksListIdsToEdit.length > 0 &&
        tasksListIdsToEdit.some(id => id !== UNASSIGNED_TASKS_LIST_ID);

      navigation.navigate('DispatchPickUser', {
        onItemPress: user => {
          onSelectNewAssignation(async () => {
            await bulkEditTasks(selectedTasks, user);
            dispatch(clearSelectedTasks());
          });
        },
        showUnassignButton,
        onUnassignButtonPress: () => {
          onSelectNewAssignation(async () => {
            await bulkEditTasks(selectedTasks);
            dispatch(clearSelectedTasks());
          });
        },
      });
    },
    [onSelectNewAssignation, bulkEditTasks, dispatch, navigation],
  );

  const allowToSelect = task => {
    return task.status !== 'DONE';
  };

  const swipeLeftConfiguration = useCallback(
    section => ({
      onPressLeft: assignTaskWithRelatedTasksHandler(
        section.isUnassignedTaskList,
      ),
      onSwipeToLeft: handleOnSwipeToLeft(section.taskListId),
      swipeOutLeftEnabled: allowToSelect,
      swipeOutLeftBackgroundColor: darkRedColor,
      swipeOutLeftIcon: AssignOrderIcon,
    }),
    [assignTaskWithRelatedTasksHandler, handleOnSwipeToLeft],
  );

  const swipeRightConfiguration = useCallback(
    section => ({
      onPressRight: assignTaskHandler(section.isUnassignedTaskList),
      onSwipeToRight: handleOnSwipeToRight(section.taskListId),
      swipeOutRightEnabled: allowToSelect,
      swipeOutRightBackgroundColor: darkRedColor,
      swipeOutRightIcon: AssignTaskIcon,
    }),
    [assignTaskHandler, handleOnSwipeToRight],
  );

  const renderSectionHeader = useCallback(
    ({ section }) => (
      <SectionHeader
        section={section}
        collapsedSections={collapsedSections}
        setCollapsedSections={setCollapsedSections}
      />
    ),
    [collapsedSections],
  );

  const longPressHandler = useTaskLongPress();

  const renderItem = useCallback(
    ({ section, item, index }) => {
      if (!isFetching && !collapsedSections.has(section.title)) {
        const tasks = getTaskListTasks(item, tasksEntities);

        return (
          <TaskList
            id={section.id}
            tasks={tasks}
            appendTaskListTestID={section.appendTaskListTestID}
            onLongPress={(task) => longPressHandler(task)}
            onTaskClick={onTaskClick(section.isUnassignedTaskList)}
            onOrderClick={onOrderClick}
            onSwipeClosed={task => {
              handleOnSwipeClose(section, task);
            }}
            {...swipeLeftConfiguration(section)}
            {...swipeRightConfiguration(section)}
          />
        );
      }

      return null;
    },
    [
      collapsedSections,
      longPressHandler,
      handleOnSwipeClose,
      isFetching,
      onTaskClick,
      onOrderClick,
      swipeLeftConfiguration,
      swipeRightConfiguration,
      tasksEntities,
    ],
  );

  return (
    <>
      <SectionList
        sections={filteredSections}
        stickySectionHeadersEnabled={true}
        keyboardShouldPersistTaps="handled"
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        windowSize={3}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item, index) => item['@id']}
        renderItem={renderItem}
        refreshing={!!isFetching}
        onRefresh={() => refetch && refetch()}
        testID="dispatchTasksSectionList"
      />
      <BulkEditTasksFloatingButton
        onPress={handleBulkAssignButtonPress}
      />
    </>
  );
}
