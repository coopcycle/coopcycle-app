import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SectionList, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionTitleText,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ChevronDownIcon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import TaskList from '../../../components/TaskList';
import { navigateToOrder, navigateToTask } from '../../../navigation/utils';
import { useRecurrenceRulesGenerateOrdersMutation } from '../../../redux/api/slice';
import {
  addOrder,
  addTask,
  clearSelectedTasks,
  removeTasksAndOrders,
} from '../../../redux/Dispatch/updateSelectedTasksSlice';
import {
  selectSelectedDate,
  selectTaskLists,
  selectTasksEntities,
} from '../../../shared/logistics/redux';
import { UNASSIGNED_TASKS_LIST_ID } from '../../../shared/src/constants';
import useSetTaskListItems from '../../../shared/src/logistics/redux/hooks/useSetTaskListItems';
import {
  createTempTaskList,
  createUnassignedTaskLists,
  getLinkedTasks,
  getTaskListTasks,
  getTasksListIdsToEdit,
  getUserTaskList,
} from '../../../shared/src/logistics/redux/taskListUtils';
import { withLinkedTasks } from '../../../shared/src/logistics/redux/taskUtils';
import {
  darkGreyColor,
  darkRedColor,
  whiteColor,
} from '../../../styles/common';
import { getOrderId } from '../../../utils/tasks';
import { AssignOrderIcon, AssignTaskIcon } from '../../task/styles/common';
import BulkEditTasksFloatingButton from './BulkEditTasksFloatingButton';

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

  const filteredSections = hideEmptyTaskLists
    ? sections.filter(section => section.tasksCount > 0)
    : sections;

  // Let Gluestack handle accordion state internally for animations

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
      const orderId = getOrderId(task);
      navigateToOrder(navigation, orderId);
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

  // old custom accordion
  /* const renderSectionHeader = useCallback(
    ({ section }) => (
      <SectionHeader
        section={section}
        collapsedSections={collapsedSections}
        setCollapsedSections={setCollapsedSections}
      />
    ),
    [collapsedSections],
  ); */

  /* comment for the moment
  /* const renderSectionHeader = ({ section }: { section: AccordionSection }) => (
    <View style={{ backgroundColor: '#f5f5f5', padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333' }}>
        {section.title}
      </Text>
    </View>
  ); */

  const renderItem = useCallback(
    ({ section, item, index }) => {
      //if (!isFetching && !collapsedSections.has(section.title)) {
      const tasks = getTaskListTasks(item, tasksEntities);

      return (
        <>
          <Accordion type="single" isCollapsible={true} isDisabled={false}>
            <AccordionItem value={item['@id'] || item.id}>
              <AccordionHeader>
                <AccordionTrigger
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: 'white',
                    borderBottomWidth: 1,
                    borderBottomColor: '#e0e0e0',
                  }}>
                  <AccordionTitleText
                    style={{
                      fontSize: 16,
                      fontWeight: '500',
                      flex: 1,
                    }}>
                    <View
                      style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View
                        style={{
                          backgroundColor: section.backgroundColor,
                          borderRadius: 4,
                          marginEnd: 8,
                          padding: 4,
                        }}>
                        <Text
                          style={{
                            color: section.textColor,
                          }}>
                          {section.title}
                        </Text>
                      </View>
                      <Text style={{ color: darkGreyColor }}>
                        {section.isUnassignedTaskList
                          ? `${section.ordersCount}   (${section.tasksCount} ${t(
                              'TASKS',
                            ).toLowerCase()})`
                          : section.tasksCount}
                      </Text>
                    </View>
                  </AccordionTitleText>
                  <AccordionIcon
                    as={ChevronDownIcon}
                    className="data-[state=open]:rotate-180"
                  />
                </AccordionTrigger>
              </AccordionHeader>

              <AccordionContent>
                <TaskList
                  id={section.id}
                  tasks={tasks}
                  appendTaskListTestID={section.appendTaskListTestID}
                  onLongPress={() => {
                    console.log('LONG PRESS ACTION');
                  }}
                  onTaskClick={onTaskClick(section.isUnassignedTaskList)}
                  onOrderClick={onOrderClick}
                  onSwipeClosed={task => {
                    handleOnSwipeClose(section, task);
                  }}
                  {...swipeLeftConfiguration(section)}
                  {...swipeRightConfiguration(section)}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </>
      );
    },
    [
      handleOnSwipeClose,
      onTaskClick,
      onOrderClick,
      swipeLeftConfiguration,
      swipeRightConfiguration,
      tasksEntities,
      t,
    ],
  );

  return (
    <>
      <SectionList
        sections={filteredSections}
        stickySectionHeadersEnabled={true}
        keyboardShouldPersistTaps="handled"
        /* comment for the moment, as it breaks the Gluestack accordion     
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        windowSize={3} */
        // renderSectionHeader={renderSectionHeader}
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
