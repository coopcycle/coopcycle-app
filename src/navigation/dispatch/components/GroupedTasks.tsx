import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator, SectionList, View } from 'react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

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
import { withLinkedTasks } from '../../../shared/src/logistics/redux/taskUtils';
import BulkEditTasksFloatingButton from './BulkEditTasksFloatingButton';
import TaskList from '../../../components/TaskList';
import useSetTaskListItems from '../../../shared/src/logistics/redux/hooks/useSetTaskListItems';
import { getOrderNumber } from '../../../utils/tasks';
import { useRecurrenceRulesGenerateOrdersMutation, useSetTaskListItemsMutation } from '../../../redux/api/slice';
import { SectionHeader } from './SectionHeader';
import { useTaskLongPress } from '../hooks/useTaskLongPress';
import { useAllowTaskSelection } from '../hooks/useAllowTaskSelection';
import { useTaskListsContext } from '../../courier/contexts/TaskListsContext';
import Task from '@/src/types/task';
import Spinner from '@/src/components/Spinner';

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
  const date = useSelector(selectSelectedDate);
  const [generateOrders] = useRecurrenceRulesGenerateOrdersMutation();

  useEffect(() => {
    generateOrders(date.format('YYYY-MM-DD'));
  }, [generateOrders, date]);

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

  const context = useTaskListsContext();

  const filteredSections = hideEmptyTaskLists
    ? sections.filter(section => section.tasksCount > 0)
    : sections;

  const [collapsedSections, setCollapsedSections] = useState(new Set());
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize all sections as collapsed only on first load
  useEffect(() => {
    if (
      !isInitialized &&
      !isFetching &&
      filteredSections.length > 0 &&
      taskLists.length > 0
    ) {
      const allSectionTitles = new Set(
        filteredSections.map(section => section.title),
      );
      setCollapsedSections(allSectionTitles);
      setIsInitialized(true);
    }
  }, [filteredSections, isInitialized, isFetching, taskLists.length]);

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

  const allowToSelect = useAllowTaskSelection();
  
  const [setTaskListItems, {isLoading}] = useSetTaskListItemsMutation();

  const handleSort = useCallback((task: Task, tasklist: Task[], index: number) => {
    const itemsIDs = [...tasklist.map(t => t['@id'])];
    const selectedTaskID = context?.selectedTasksToEdit[0]['@id'];
  
    const filteredIDs = itemsIDs.filter(id => id !== selectedTaskID);
    
    filteredIDs.splice(index, 0, selectedTaskID);
    
    setTaskListItems({items: filteredIDs, username: task.assignedTo, date: date.format('YYYY-MM-DD')});
    context?.clearSelectedTasks();
  }, [context, date, setTaskListItems]);

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
    [assignTaskWithRelatedTasksHandler, handleOnSwipeToLeft, allowToSelect],
  );

  const swipeRightConfiguration = useCallback(
    section => ({
      onPressRight: assignTaskHandler(section.isUnassignedTaskList),
      onSwipeToRight: handleOnSwipeToRight(section.taskListId),
      swipeOutRightEnabled: allowToSelect,
      swipeOutRightBackgroundColor: darkRedColor,
      swipeOutRightIcon: AssignTaskIcon,
    }),
    [assignTaskHandler, handleOnSwipeToRight, allowToSelect],
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
      console.log(
        `Rendering section: ${section.title}, collapsed: ${collapsedSections.has(section.title)}, isFetching: ${isFetching}`,
      );
      if (!isFetching && !collapsedSections.has(section.title)) {
        const tasks = getTaskListTasks(item, tasksEntities);

        return (
          <TaskList
            id={section.id}
            tasks={tasks}
            appendTaskListTestID={section.appendTaskListTestID}
            onLongPress={longPressHandler}
            onTaskClick={onTaskClick(section.isUnassignedTaskList)}
            onOrderClick={onOrderClick}
            onSort={handleSort}
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
      handleSort,
      swipeLeftConfiguration,
      swipeRightConfiguration,
      tasksEntities,
    ],
  );

  return (
    <>
      {isLoading && (
        <View style={{
          position: 'absolute',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(102, 102, 102, 0.2)',
          zIndex: 999,
         }}>
          <ActivityIndicator animating={true} size="large" />
        </View>
      )}
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
      <BulkEditTasksFloatingButton onPress={handleBulkAssignButtonPress} />
    </>
  );
}
