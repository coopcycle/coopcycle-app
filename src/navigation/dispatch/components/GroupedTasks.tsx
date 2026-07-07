import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator, View } from 'react-native';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FlashList } from '@shopify/flash-list';

import { AssignOrderIcon, AssignTaskIcon } from '../../task/styles/common';
import {
  createTempTaskList,
  createUnassignedTaskLists,
  getTaskListByTask,
  getTaskListTasks,
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
import TaskListItemBase from '../../../components/TaskListItem';

const TaskListItem = memo(TaskListItemBase);
import useSetTaskListItems from '../../../shared/src/logistics/redux/hooks/useSetTaskListItems';
import { getOrderNumber } from '../../../utils/tasks';
import { useRecurrenceRulesGenerateOrdersMutation, useSetTaskListItemsMutation } from '../../../redux/api/slice';
import { SectionHeader } from './SectionHeader';
import { useTaskLongPress } from '../hooks/useTaskLongPress';
import { useTaskListsContext } from '../../courier/contexts/TaskListsContext';
import Task from '@/src/types/task';
import { moveAfter } from '../../task/components/utils';

type SectionData = {
  id: string;
  title: string;
  data: Task[];
  taskList: ReturnType<typeof createTempTaskList>;
  taskListId: string;
  isUnassignedTaskList: boolean;
  ordersCount: number;
  tasksCount: number;
  backgroundColor: string;
  textColor: string;
  appendTaskListTestID?: string;
  type: 'section';
};

type FlatItem =
  | { type: 'header'; section: SectionData }
  | { type: 'task'; task: Task; section: SectionData; index: number };

const HEADER_HEIGHT = 52;
const TASK_HEIGHT = 88;

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

  // Section expansion — local UI state, default all expanded
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const isExpandedSection = useCallback(
    (title: string) => expandedSections[title] !== false,
    [expandedSections],
  );
  const toggleSection = useCallback((title: string) => {
    setExpandedSections(prev => ({ ...prev, [title]: prev[title] === false ? true : false }));
  }, []);

  const unassignedTaskLists = useMemo(
    () => createUnassignedTaskLists(unassignedTasks),
    [unassignedTasks],
  );

  // Section metadata (always includes full task data; expansion controlled separately)
  const sections = useMemo<SectionData[]>(() => {
    const unassignedTaskList = createTempTaskList(UNASSIGNED_TASKS_LIST_ID, unassignedTasks);

    const sectionsList: SectionData[] = [
      {
        id: UNASSIGNED_TASKS_LIST_ID,
        title: t('DISPATCH_UNASSIGNED_TASKS'),
        data: unassignedTasks,
        taskList: unassignedTaskList,
        taskListId: UNASSIGNED_TASKS_LIST_ID,
        isUnassignedTaskList: true,
        ordersCount: unassignedTaskLists.length,
        tasksCount: unassignedTasks.length,
        backgroundColor: whiteColor,
        textColor: darkGreyColor,
        type: 'section',
      },
      ...taskLists.map(taskList => ({
        id: `${taskList.username.toLowerCase()}TasksList`,
        title: taskList.username,
        data: getTaskListTasks(taskList, tasksEntities),
        taskList,
        taskListId: taskList['@id'],
        isUnassignedTaskList: false,
        ordersCount: 0,
        tasksCount: taskList.tasksIds.length,
        backgroundColor: taskList.color ? taskList.color : darkGreyColor,
        textColor: whiteColor,
        appendTaskListTestID: taskList.appendTaskListTestID,
        type: 'section' as const,
      })),
    ];

    return sectionsList.filter(section => !hideEmptyTaskLists || section.tasksCount > 0);
  }, [t, tasksEntities, taskLists, unassignedTaskLists.length, unassignedTasks, hideEmptyTaskLists]);

  // Flat data for FlashList
  const flatData = useMemo<FlatItem[]>(() => {
    return sections.flatMap(section => {
      const header: FlatItem = { type: 'header', section };
      if (!isExpandedSection(section.title)) return [header];
      return [
        header,
        ...section.data.map((task, i) => ({ type: 'task' as const, task, section, index: i })),
      ];
    });
  }, [sections, isExpandedSection]);

  const stickyHeaderIndices = useMemo(
    () =>
      flatData.reduce<number[]>((acc, item, i) => {
        if (item.type === 'header') acc.push(i);
        return acc;
      }, []),
    [flatData],
  );

  const onOrderClick = useCallback(
    task => {
      navigateToOrder(navigation, getOrderNumber(task), false, task.status);
    },
    [navigation],
  );

  const onTaskClick = useCallback(
    isUnassignedTaskList => task => {
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

  const onSelectNewAssignation = useCallback(
    callback => {
      navigation.navigate('DispatchAllTasks');
      callback();
    },
    [navigation],
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

  const handleBulkAssignButtonPress = useCallback(
    (tasks: Task[]) => {
      const tasksByList: Record<string, Task[]> = {};
      for (const task of tasks) {
        const taskList = getTaskListByTask(task, allTaskLists);
        const key = taskList ? taskList['@id'] : UNASSIGNED_TASKS_LIST_ID;
        if (!tasksByList[key]) tasksByList[key] = [];
        tasksByList[key].push(task);
      }
      // Bucket the long-tap selection into the `orders` slot so linked tasks
      // are assigned/unassigned together — matching the left-swipe behavior
      // (getTasksListsToEdit only expands linked tasks for the `orders` bucket).
      const selectedTasks = { orders: tasksByList, tasks: {} };
      const showUnassignButton = Object.keys(tasksByList).some(
        id => id !== UNASSIGNED_TASKS_LIST_ID,
      );

      navigation.navigate('DispatchPickUser', {
        onItemPress: user => {
          onSelectNewAssignation(async () => {
            await bulkEditTasks(selectedTasks, user);
            context?.clearSelectedTasks();
          });
        },
        showUnassignButton,
        onUnassignButtonPress: () => {
          onSelectNewAssignation(async () => {
            await bulkEditTasks(selectedTasks);
            context?.clearSelectedTasks();
          });
        },
      });
    },
    [onSelectNewAssignation, bulkEditTasks, context, allTaskLists, navigation],
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
      swipeOutLeftBackgroundColor: darkRedColor,
      swipeOutLeftIcon: AssignOrderIcon,
    }),
    [assignTaskWithRelatedTasksHandler],
  );

  const swipeRightConfiguration = useCallback(
    (section, task) => ({
      onPressRight: () => assignTaskHandler(section.isUnassignedTaskList, task),
      swipeOutRightBackgroundColor: darkRedColor,
      swipeOutRightIcon: AssignTaskIcon,
    }),
    [assignTaskHandler],
  );

  const longPressHandler = useTaskLongPress();

  const renderItem = useCallback(
    ({ item }: { item: FlatItem }) => {
      if (item.type === 'header') {
        return (
          <SectionHeader
            section={item.section}
            isExpanded={isExpandedSection(item.section.title)}
            onToggle={() => toggleSection(item.section.title)}
          />
        );
      }

      const { task, section, index } = item;
      const tasks = section.data;
      const nextTask = index < tasks.length - 1 ? tasks[index + 1] : null;

      return (
        <TaskListItem
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
      isExpandedSection,
      toggleSection,
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
      <FlashList
        data={flatData}
        getItemType={item => item.type}
        renderItem={renderItem}
        keyExtractor={(item, index) =>
          item.type === 'header'
            ? `header-${item.section.id}`
            : `${item.task['@id']}-${index}`
        }
        stickyHeaderIndices={stickyHeaderIndices}
        estimatedItemSize={TASK_HEIGHT}
        refreshing={!!isFetching}
        onRefresh={() => refetch && refetch()}
        testID="dispatchTaskLists"
      />
      <BulkEditTasksFloatingButton onPress={handleBulkAssignButtonPress} />
    </>
  );
}
