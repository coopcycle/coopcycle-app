import { useNavigation } from '@react-navigation/native';
import { Icon, Text, View } from 'native-base';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SectionList, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';

import TaskList from '../../../components/TaskList';
import { navigateToTask } from '../../../navigation/utils';
import {
  addOrder,
  addTask,
  clearSelectedTasks,
  removeTasksAndOrders,
} from '../../../redux/Dispatch/updateSelectedTasksSlice';
import {
  selectTaskLists,
  selectTasksWithColor,
  selectUnassignedTasksNotCancelled,
} from '../../../shared/logistics/redux';
import { UNASSIGNED_TASKS_LIST_ID } from '../../../shared/src/constants';
import useSetTaskListItems from '../../../shared/src/logistics/redux/hooks/useSetTaskListItems';
import {
  createUnassignedTaskLists,
  getTasksListIdsToEdit,
  getUserTaskList,
} from '../../../shared/src/logistics/redux/taskListUtils';
import {
  darkGreyColor,
  darkRedColor,
  whiteColor,
} from '../../../styles/common';
import { useBackgroundHighlightColor } from '../../../styles/theme';
import {
  assignOrderIconName,
  assignTaskIconName,
} from '../../task/styles/common';
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
  const tasksWithColor = useSelector(selectTasksWithColor);
  const allTaskLists = useSelector(selectTaskLists);
  const allUnassignedTasks = useSelector(selectUnassignedTasksNotCancelled);

  const bgHighlightColor = useBackgroundHighlightColor();

  // Combine unassigned tasks and task lists to use in SectionList
  const unassignedTaskLists = createUnassignedTaskLists(unassignedTasks);
  const sections = [
    {
      id: UNASSIGNED_TASKS_LIST_ID,
      taskListId: UNASSIGNED_TASKS_LIST_ID,
      data: unassignedTasks,
      tasksCount: unassignedTasks.length,
      ordersCount: unassignedTaskLists.length,
      isUnassignedTaskList: true,
      backgroundColor: whiteColor,
      textColor: darkGreyColor,
      title: t('DISPATCH_UNASSIGNED_TASKS'),
    },
    ...taskLists.map(taskList => ({
      id: `${taskList.username.toLowerCase()}TasksList`,
      taskListId: taskList['@id'],
      data: taskList.items,
      tasksCount: taskList.items.length,
      ordersCount: 0,
      isUnassignedTaskList: false,
      backgroundColor: taskList.color ? taskList.color : darkGreyColor,
      textColor: whiteColor,
      title: taskList.username,
    })),
  ];

  const filteredSections = hideEmptyTaskLists
    ? sections.filter(section => section.tasksCount > 0)
    : sections;

  // collapsable
  const [collapsedSections, setCollapsedSections] = useState(new Set());

  // Update tasks functions
  const {
    assignTask,
    getLinkedTasks,
    bulkEditTasks,
    assignTaskWithRelatedTasks,
    reassignTask,
    reassignTaskWithRelatedTasks,
    unassignTask,
    unassignTaskWithRelatedTasks,
  } = useSetTaskListItems();

  const onTaskClick = isUnassignedTaskList => task => {
    // If task is unassigned, related tasks are unassigned tasks
    // If task is assigned, related tasks are task's task list's tasks
    if (isUnassignedTaskList) {
      navigateToTask(navigation, route, task, allUnassignedTasks);
    } else {
      const username = task.assignedTo;
      const taskList = getUserTaskList(username, allTaskLists);
      const relatedTasks = taskList.items;
      navigateToTask(navigation, route, task, relatedTasks);
    }
  };
  const assignTaskWithRelatedTasksHandler = isUnassignedTaskList => task => {
    const onItemPress = user =>
      _onSelectNewAssignation(() =>
        (isUnassignedTaskList
          ? assignTaskWithRelatedTasks
          : reassignTaskWithRelatedTasks)(task, user),
      );

    const onUnassignButtonPress = () =>
      _onSelectNewAssignation(() => unassignTaskWithRelatedTasks(task));

    navigation.navigate('DispatchPickUser', {
      onItemPress,
      showUnassignButton: !isUnassignedTaskList,
      onUnassignButtonPress,
    });
  };

  const assignTaskHandler = isUnassignedTaskList => task => {
    const onItemPress = user =>
      _onSelectNewAssignation(() =>
        (isUnassignedTaskList ? assignTask : reassignTask)(task, user),
      );

    const onUnassignButtonPress = () =>
      _onSelectNewAssignation(() => unassignTask(task));

    navigation.navigate('DispatchPickUser', {
      onItemPress,
      showUnassignButton: !isUnassignedTaskList,
      onUnassignButtonPress,
    });
  };

  const _onSelectNewAssignation = callback => {
    navigation.navigate('DispatchAllTasks');
    callback();
  };

  const handleOnSwipeToLeft = (task, taskListId) => {
    const tasksByTaskList = getLinkedTasks(task, taskListId);
    dispatch(addOrder(tasksByTaskList));
  };

  const handleOnSwipeToRight = (task, taskListId) => {
    dispatch(addTask({ task, taskListId }));
  };

  const handleOnSwipeClose = (section, task) => {
    const taskListId = section.taskListId;
    const tasksByTaskList = getLinkedTasks(task, taskListId);

    dispatch(removeTasksAndOrders(tasksByTaskList));
  };

  const handleBulkAssignButtonPress = selectedTasks => {
    const tasksListIdsToEdit = getTasksListIdsToEdit(selectedTasks);
    const showUnassignButton =
      tasksListIdsToEdit.length > 0 &&
      tasksListIdsToEdit.some(id => id !== UNASSIGNED_TASKS_LIST_ID);

    navigation.navigate('DispatchPickUser', {
      onItemPress: user => {
        _onSelectNewAssignation(async () => {
          await bulkEditTasks(selectedTasks, user);
          dispatch(clearSelectedTasks());
        });
      },
      showUnassignButton,
      onUnassignButtonPress: () => {
        _onSelectNewAssignation(async () => {
          await bulkEditTasks(selectedTasks);
          dispatch(clearSelectedTasks());
        });
      },
    });
  };

  const swipeLeftConfiguration = section => ({
    onPressLeft: assignTaskWithRelatedTasksHandler(
      section.isUnassignedTaskList,
    ),
    onSwipeToLeft: task => handleOnSwipeToLeft(task, section.taskListId),
    swipeOutLeftBackgroundColor: darkRedColor,
    swipeOutLeftIconName: assignOrderIconName,
  });

  const swipeRightConfiguration = section => ({
    onPressRight: assignTaskHandler(section.isUnassignedTaskList),
    onSwipeToRight: task => handleOnSwipeToRight(task, section.taskListId),
    swipeOutRightBackgroundColor: darkRedColor,
    swipeOutRightIconName: assignTaskIconName,
  });

  // Disabled animation for now..!
  // if (Platform.OS === 'android') {
  //   UIManager.setLayoutAnimationEnabledExperimental(true);
  // }
  const handleToggle = title => {
    // Disabled animation for now..!
    // LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCollapsedSections(() => {
      const next = new Set(collapsedSections);
      next[next.has(title) ? 'delete' : 'add'](title);
      return next;
    });
  };

  return (
    <>
      <SectionList
        sections={filteredSections}
        stickySectionHeadersEnabled={true}
        keyboardShouldPersistTaps="handled"
        renderSectionHeader={({ section }) => (
          <View style={{ backgroundColor: bgHighlightColor }}>
            <TouchableOpacity
              onPress={() => handleToggle(section.title)}
              activeOpacity={0.5}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 8,
                paddingVertical: 4,
                backgroundColor: whiteColor,
                margin: 4,
                borderRadius: 5,
              }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
              {section.tasksCount === 0 ? null : (
                <Icon
                  as={FontAwesome}
                  testID={`${section.id}:toggler`}
                  name={
                    collapsedSections.has(section.title)
                      ? 'angle-down'
                      : 'angle-up'
                  }
                />
              )}
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item, index) => item.id}
        renderItem={({ section, index }) => {
          // TODO check why lists are repeating, is this necessary?
          if (
            index === 0 &&
            !isFetching &&
            !collapsedSections.has(section.title)
          ) {
            return (
              <TaskList
                id={section.id}
                onTaskClick={onTaskClick(section.isUnassignedTaskList)}
                tasks={section.data}
                tasksWithColor={tasksWithColor}
                onSwipeClosed={task => {
                  handleOnSwipeClose(section, task);
                }}
                {...swipeLeftConfiguration(section)}
                {...swipeRightConfiguration(section)}
              />
            );
          }
          return null;
        }}
        // We pass those 2 to SectionList instead of TaskList
        refreshing={!!isFetching}
        onRefresh={() => refetch && refetch()}
      />
      <BulkEditTasksFloatingButton
        onPress={handleBulkAssignButtonPress}
        iconName="user-circle"
      />
    </>
  );
}
