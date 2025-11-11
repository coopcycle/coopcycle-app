import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator, View } from 'react-native';
import { memo, useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { SwipeListView } from 'react-native-swipe-list-view';

import {
  addOrder,
  addTask,
  clearSelectedTasks,
  removeTasksAndOrders,
} from '../../../redux/Dispatch/updateSelectedTasksSlice';
import { AssignOrderIcon, AssignTaskIcon } from '../../task/styles/common';
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
import { selectIsExpandedSection } from '../../../redux/Dispatch/selectors';
import { withLinkedTasks } from '../../../shared/src/logistics/redux/taskUtils';
import BulkEditTasksFloatingButton from './BulkEditTasksFloatingButton';
import TaskListItem from '../../../components/TaskListItem';
//import ItemSeparatorComponent from '../../../components/ItemSeparator';
import useSetTaskListItems from '../../../shared/src/logistics/redux/hooks/useSetTaskListItems';
import { getOrderNumber } from '../../../utils/tasks';
import { useRecurrenceRulesGenerateOrdersMutation, useSetTaskListItemsMutation } from '../../../redux/api/slice';
import { SectionHeader } from './SectionHeader';
import { useTaskLongPress } from '../hooks/useTaskLongPress';
import { useTaskListsContext } from '../../courier/contexts/TaskListsContext';
import Task from '@/src/types/task';
import { moveAfter } from '../../task/components/utils';

export default function GroupedTasks({
  isFetching,
  refetch,
  route,
  taskLists,
  unassignedTasks,
  hideEmptyTaskLists = false,
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const tasksEntities = useSelector(selectTasksEntities);
  const allTaskLists = useSelector(selectTaskLists);
  const date = useSelector(selectSelectedDate);
  const context = useTaskListsContext();
  const isExpandedSection = useSelector(selectIsExpandedSection);
  const [generateOrders] = useRecurrenceRulesGenerateOrdersMutation();

  useEffect(() => {
    generateOrders(date.format('YYYY-MM-DD'));
  }, [generateOrders, date]);

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

  const unassignedTaskLists = createUnassignedTaskLists(unassignedTasks);
  // Combine unassigned tasks and task lists to use in SectionList
  const sections = useMemo(() => {
    if (isFetching) {
      return [];
    }

    const unassignedTaskList = createTempTaskList(UNASSIGNED_TASKS_LIST_ID, unassignedTasks);

    const sectionsList = [
      {
        id: UNASSIGNED_TASKS_LIST_ID,
        title: t('DISPATCH_UNASSIGNED_TASKS'),
        data: isExpandedSection(t('DISPATCH_UNASSIGNED_TASKS')) ? unassignedTasks : [],
        taskList: unassignedTaskList,
        taskListId: UNASSIGNED_TASKS_LIST_ID,
        isUnassignedTaskList: true,
        ordersCount: unassignedTaskLists.length,
        tasksCount: unassignedTasks.length,
        backgroundColor: whiteColor,
        textColor: darkGreyColor,
        type: 'section'
      },
      ...taskLists.map(taskList => ({
        id: `${taskList.username.toLowerCase()}TasksList`,
        title: taskList.username,
        data: isExpandedSection(taskList.username) ? getTaskListTasks(taskList, tasksEntities) : [],
        taskList,
        taskListId: taskList['@id'],
        isUnassignedTaskList: false,
        ordersCount: 0,
        tasksCount: taskList.tasksIds.length,
        backgroundColor: taskList.color ? taskList.color : darkGreyColor,
        textColor: whiteColor,
        appendTaskListTestID: taskList.appendTaskListTestID,
        type: 'section'
      })),
    ];

    return sectionsList.filter(section => !hideEmptyTaskLists || section.tasksCount > 0);
  }, [t, tasksEntities, taskLists, unassignedTaskLists.length, unassignedTasks, hideEmptyTaskLists, isFetching, isExpandedSection]);

  const onOrderClick = useCallback(
    task => {
      const orderNumber = getOrderNumber(task);
      navigateToOrder(navigation, orderNumber, false, undefined, task.status);
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
    (isUnassignedTaskList, task) => {
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
    (isUnassignedTaskList, task) => {
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
    (taskListId, task) => {
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
    (taskListId, task) => {
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

  const [setTaskListItems, {isLoading}] = useSetTaskListItemsMutation();

  const handleSortBefore = useCallback((tasks: Task[]) => {
    const itemsIDs = [...tasks.map(t => t['@id'])];
    const selectedTask = context?.selectedTasksToEdit[0];
    const selectedTaskID = selectedTask['@id'];

    const filteredIDs = itemsIDs.filter(id => id !== selectedTaskID);

    filteredIDs.unshift(selectedTaskID);

    setTaskListItems({items: filteredIDs, username: selectedTask.assignedTo, date: date.format('YYYY-MM-DD')});
    context?.clearSelectedTasks();
  }, [context, date, setTaskListItems]);

  const handleSort = useCallback((tasks: Task[], index: number) => {
    const itemsIDs = [...tasks.map(t => t['@id'])];
    const selectedTask = context?.selectedTasksToEdit[0];

    const fromIndex = itemsIDs.indexOf(selectedTask['@id']);
    const toIndex = index;

    const reordered = moveAfter(itemsIDs, fromIndex, toIndex);

    setTaskListItems({items: reordered, username: selectedTask.assignedTo, date: date.format('YYYY-MM-DD')});
    context?.clearSelectedTasks();
  }, [context, date, setTaskListItems]);

  const swipeLeftConfiguration = useCallback(
    (section, task) => ({
      onPressLeft: () => assignTaskWithRelatedTasksHandler(section.isUnassignedTaskList, task),
      onSwipedToLeft: () => handleOnSwipeToLeft(section.taskListId, task),
      swipeOutLeftBackgroundColor: darkRedColor,
      swipeOutLeftIcon: AssignOrderIcon,
    }),
    [assignTaskWithRelatedTasksHandler, handleOnSwipeToLeft],
  );

  const swipeRightConfiguration = useCallback(
    (section, task) => ({
      onPressRight: () => assignTaskHandler(section.isUnassignedTaskList, task),
      onSwipedToRight: () => handleOnSwipeToRight(section.taskListId, task),
      onSwipeClosed: () => handleOnSwipeClose(section, task),
      swipeOutRightBackgroundColor: darkRedColor,
      swipeOutRightIcon: AssignTaskIcon,
    }),
    [assignTaskHandler, handleOnSwipeToRight, handleOnSwipeClose],
  );

  const renderSectionHeader = useCallback(
    ({ section }) => (
      <SectionHeader section={section}/>
    ), []
  );

  const longPressHandler = useTaskLongPress();

  const renderItem = useCallback(
    ({ section, item: task, index }) => {
      const tasks = section.data;
      const nextTask = index < tasks.length - 1 ? tasks[index + 1] : null;
      const MemoizedTaskListItem = memo(TaskListItem);

      return (
        <MemoizedTaskListItem
          taskListId={section.id}
          appendTaskListTestID={section.appendTaskListTestID}
          task={task}
          nextTask={nextTask}
          index={index}
          color={task.color}
          onPress={() => onTaskClick(section.isUnassignedTaskList)(task)}
          onLongPress={longPressHandler}
          onSortBefore={() => handleSortBefore(tasks)}
          onSort={() => handleSort(tasks, index)}
          onOrderPress={() => onOrderClick(task)}
          {...(swipeLeftConfiguration(section, task))}
          {...(swipeRightConfiguration(section, task))}
        />
      );
    },
    [
      longPressHandler,
      onTaskClick,
      onOrderClick,
      handleSort,
      handleSortBefore,
      swipeLeftConfiguration,
      swipeRightConfiguration,
    ],
  );

  return (
    <>
      {isLoading && (
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(102, 102, 102, 0.2)',
          zIndex: 999,
        }}>
          <ActivityIndicator animating={true} size="large" />
        </View>
      )}
      <SwipeListView
        useSectionList={true}
        sections={sections}
        stickySectionHeadersEnabled={true}
        keyExtractor={(item, index) => `${item['@id']}-${index}`}
        renderSectionHeader={renderSectionHeader}
        renderItem={renderItem}
        // ItemSeparatorComponent={ItemSeparatorComponent}
        refreshing={!!isFetching}
        onRefresh={() => refetch && refetch()}
        testID="dispatchTaskLists"
        // Change the ones below to adjust performance / memory consumption
        initialNumToRender={20}
        maxToRenderPerBatch={10}
        windowSize={11}
      />
      <BulkEditTasksFloatingButton onPress={handleBulkAssignButtonPress} />
    </>
  );
}
