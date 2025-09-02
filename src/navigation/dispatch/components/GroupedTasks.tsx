import { SectionList } from 'react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import {
  removeTasksAndOrders,
} from '../../../redux/Dispatch/updateSelectedTasksSlice';
import {
  assignOrderIconName,
  assignTaskIconName,
} from '../../task/styles/common';
import {
  createTempTaskList,
  createUnassignedTaskLists,
  getLinkedTasks,
  getTaskListTasks,
} from '../../../shared/src/logistics/redux/taskListUtils';
import {
  darkGreyColor,
  darkRedColor,
  whiteColor,
} from '../../../styles/common';
import { UNASSIGNED_TASKS_LIST_ID } from '../../../shared/src/constants';
import {
  selectSelectedDate,
  selectTaskLists,
  selectTasksEntities,
} from '../../../shared/logistics/redux';
import BulkEditTasksFloatingButton from './BulkEditTasksFloatingButton';
import TaskList from '../../../components/TaskList';
import { useRecurrenceRulesGenerateOrdersMutation } from '../../../redux/api/slice';
import { SectionHeader } from './SectionHeader';
import { useSwipeConfigurations } from './useSwipeConfigurations';
import { useTaskManagement } from './useTaskManagement';

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
    onOrderClick,
    onTaskClick,
    assignTaskHandler,
    assignTaskWithRelatedTasksHandler,
    handleBulkAssignButtonPress,
  } = useTaskManagement(route);

  const { handleOnSwipeToLeft, handleOnSwipeToRight} = useSwipeConfigurations();
  
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
      swipeOutLeftIconName: assignOrderIconName,
    }),
    [assignTaskWithRelatedTasksHandler, handleOnSwipeToLeft],
  );

  const swipeRightConfiguration = useCallback(
    section => ({
      onPressRight: assignTaskHandler(section.isUnassignedTaskList),
      onSwipeToRight: handleOnSwipeToRight(section.taskListId),
      swipeOutRightEnabled: allowToSelect,
      swipeOutRightBackgroundColor: darkRedColor,
      swipeOutRightIconName: assignTaskIconName,
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

  const renderItem = useCallback(
    ({ section, item, index }) => {
      if (!isFetching && !collapsedSections.has(section.title)) {
        const tasks = getTaskListTasks(item, tasksEntities);

        return (
          <TaskList
            id={section.id}
            tasks={tasks}
            appendTaskListTestID={section.appendTaskListTestID}
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
        iconName="user-circle"
      />
    </>
  );
}
