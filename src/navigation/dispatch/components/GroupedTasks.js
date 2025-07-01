import { useNavigation } from '@react-navigation/native';
import { Icon, Text, View } from 'native-base';
import {
  SectionList,
  TouchableOpacity,
} from 'react-native';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';

import {
  addOrder,
  addTask,
  clearSelectedTasks,
  removeOrder,
  removeTask
} from '../../../redux/Dispatch/updateSelectedTasksSlice';
import { assignOrderIconName, assignTaskIconName } from '../../task/styles/common';
import {
  darkGreyColor,
  darkRedColor,
  whiteColor
} from '../../../styles/common';
import { getTaskListTasks, getTasksListIdsToEdit, getUserTaskList } from '../../../shared/src/logistics/redux/taskListUtils';
import { navigateToTask } from '../../../navigation/utils';
import { selectTaskLists, selectTasksEntities, selectTasksWithColor, selectUnassignedTasksNotCancelled } from '../../../shared/logistics/redux';
import { UNASSIGNED_TASKS_LIST_ID } from '../../../shared/src/constants';
import { useBackgroundHighlightColor } from '../../../styles/theme';
import BulkEditTasksFloatingButton from './BulkEditTasksFloatingButton';
import TaskListItem from '../../../components/TaskListItem';
import useSetTaskListItems from '../../../shared/src/logistics/redux/hooks/useSetTaskListItems';

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
  const tasksEntities = useSelector(selectTasksEntities);
  const allUnassignedTasks = useSelector(selectUnassignedTasksNotCancelled);
  const allTaskLists = useSelector(selectTaskLists);

  // Combine unassigned tasks and task lists to use in SectionList
  const sections = useMemo(() => [
    {
      backgroundColor: whiteColor,
      count: unassignedTasks.length,
      data: unassignedTasks,
      id: UNASSIGNED_TASKS_LIST_ID,
      isUnassignedTaskList: true,
      taskListId: UNASSIGNED_TASKS_LIST_ID,
      textColor: darkGreyColor,
      title: t('DISPATCH_UNASSIGNED_TASKS'),
    },
    ...taskLists.map(taskList => ({
      backgroundColor: taskList.color ? taskList.color : darkGreyColor,
      count: taskList.tasksIds.length,
      data: getTaskListTasks(taskList, tasksEntities),
      id: `${taskList.username.toLowerCase()}TasksList`,
      isUnassignedTaskList: false,
      taskListId: taskList['@id'],
      textColor: whiteColor,
      title: taskList.username,
    })),
  ], [t, taskLists, tasksEntities, unassignedTasks]);

  const filteredSections = hideEmptyTaskLists
    ? sections.filter(section => section.data.length > 0)
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

  const onTaskClick = useCallback((isUnassignedTaskList, task) => {
    // If task is unassigned, related tasks are unassigned tasks
    // If task is assigned, related tasks are task's task list's tasks
    if (isUnassignedTaskList) {
      navigateToTask(navigation, route, task, allUnassignedTasks);
    } else {
      const username = task.assignedTo;
      const taskList = getUserTaskList(username, allTaskLists)
      const relatedTasks = getTaskListTasks(taskList, tasksEntities);
      navigateToTask(navigation, route, task, relatedTasks);
    }
  }, [allTaskLists, allUnassignedTasks, navigation, route, tasksEntities]);

  const assignTaskWithRelatedTasksHandler = useCallback(isUnassignedTaskList => task => {
    const onItemPress = user => _onSelectNewAssignation(
      () => (isUnassignedTaskList ? assignTaskWithRelatedTasks : reassignTaskWithRelatedTasks)(task, user),
    );

    const onUnassignButtonPress = () => _onSelectNewAssignation(
      () => unassignTaskWithRelatedTasks(task),
    );

    navigation.navigate('DispatchPickUser', {
      onItemPress,
      onUnassignButtonPress,
      showUnassignButton: !isUnassignedTaskList,
    });
  }, [_onSelectNewAssignation, assignTaskWithRelatedTasks, navigation, reassignTaskWithRelatedTasks, unassignTaskWithRelatedTasks]);

  const assignTaskHandler = useCallback(isUnassignedTaskList => task => {
    const onItemPress = user => _onSelectNewAssignation(
      () => (isUnassignedTaskList ? assignTask : reassignTask)(task, user),
    );

    const onUnassignButtonPress = () => _onSelectNewAssignation(
      () => unassignTask(task),
    );

    navigation.navigate('DispatchPickUser', {
      onItemPress,
      showUnassignButton: !isUnassignedTaskList,
      onUnassignButtonPress,
    });
  }, [_onSelectNewAssignation, assignTask, navigation, reassignTask, unassignTask]);

  const _onSelectNewAssignation = useCallback((callback) => {
    navigation.navigate('DispatchAllTasks');
    callback();
  }, [navigation]);

  const handleOnSwipeToLeft = useCallback((task, taskListId) => {
    const tasksByTaskList = getLinkedTasks(task, taskListId);

    Object.entries(tasksByTaskList).forEach(([listId, tasks]) => {
      tasks.forEach(taskToAdd => {
        dispatch(addOrder({ task: taskToAdd, taskListId: listId }));
      });
    });
  }, [dispatch, getLinkedTasks]);

  const handleOnSwipeToRight = useCallback((task, taskListId) => {
    dispatch(addTask({ task, taskListId }));
  }, [dispatch]);

  const handleOnSwipeClose = useCallback((section, task) => {
    const taskListId = section.taskListId;
    const tasksByTaskList = getLinkedTasks(task, taskListId);

    Object.entries(tasksByTaskList).forEach(([listId, tasks]) => {
      tasks.forEach(taskToRemove => {
        const taskId = taskToRemove['@id'];
        dispatch(removeOrder({ taskId, taskListId: listId }));
        dispatch(removeTask({ taskId, taskListId: listId }));
      });
    });
  }, [dispatch, getLinkedTasks]);

  const handleBulkAssignButtonPress = (selectedTasks) => {
    const tasksListIdsToEdit = getTasksListIdsToEdit(selectedTasks);
    const showUnassignButton = (
      tasksListIdsToEdit.length > 0 &&
      tasksListIdsToEdit.some(id => id !== UNASSIGNED_TASKS_LIST_ID)
    );

    navigation.navigate('DispatchPickUser', {
      onItemPress: user => {
        _onSelectNewAssignation(async () => {
          await bulkEditTasks(selectedTasks, user);
          dispatch(clearSelectedTasks());
        })
      },
      showUnassignButton,
      onUnassignButtonPress: () => {
        _onSelectNewAssignation(async () => {
          await bulkEditTasks(selectedTasks);
          dispatch(clearSelectedTasks());
        })
      },
    });
  };

  const allowToSelect = task => {
    return task.status !== 'DONE';
  };

  const swipeLeftConfiguration = useCallback((section, task) => ({
    disableLeftSwipe: !allowToSelect(task),
    onPressLeft: () => assignTaskWithRelatedTasksHandler(section.isUnassignedTaskList),
    onSwipedToLeft: () => handleOnSwipeToLeft(task, section.taskListId),
    onSwipeClosed: () => handleOnSwipeClose(section, task),
    swipeOutLeftBackgroundColor: darkRedColor,
    swipeOutLeftIconName: assignOrderIconName,
  }), [assignTaskWithRelatedTasksHandler, handleOnSwipeClose, handleOnSwipeToLeft]);

  const swipeRightConfiguration = useCallback((section, task) => ({
    disableRightSwipe: !allowToSelect(task),
    onPressRight: () => assignTaskHandler(section.isUnassignedTaskList),
    onSwipeClosed: () => handleOnSwipeClose(section, task),
    onSwipedToRight: () => handleOnSwipeToRight(task, section.taskListId),
    swipeOutRightBackgroundColor: darkRedColor,
    swipeOutRightIconName: assignTaskIconName,
  }), [assignTaskHandler, handleOnSwipeClose, handleOnSwipeToRight]);

  const taskColor = (task) => {
    let tasksWithColorSafe = tasksWithColor ?? [];
    return Object.prototype.hasOwnProperty.call(tasksWithColorSafe, task['@id'])
      ? tasksWithColor[task['@id']]
      : '#ffffff';
  };

  const renderSectionHeader = ({ section }) => (
    <SectionHeader
      section={section}
      collapsedSections={collapsedSections}
      setCollapsedSections={setCollapsedSections}
    />
  )

  const renderItem = ({ section, item, index }) => {
    console.log({index, item: item.id, section: section.id})
    if (!isFetching && !collapsedSections.has(section.title)) {
      return (
        <TaskListItem
          task={item}
          index={index}
          color={taskColor(item)}
          taskListId={section.id}
          onPress={() => onTaskClick(section.isUnassignedTaskList, item)}
          {...swipeLeftConfiguration(section, item)}
          {...swipeRightConfiguration(section, item)}
        />
      );
    }
    return null;
  };

  return (
    <>
      <SectionList
        sections={filteredSections}
        stickySectionHeadersEnabled={true}
        keyboardShouldPersistTaps="handled"
        initialNumToRender={2}
        maxToRenderPerBatch={25}
        windowSize={5}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item, index) => item.id}
        renderItem={renderItem}
        refreshing={!!isFetching}
        onRefresh={() => refetch && refetch()}
      />
      <BulkEditTasksFloatingButton
        onPress={handleBulkAssignButtonPress}
        iconName="user-circle"
        //ref={bulkEditTasksFloatingButtonRef}
      />
    </>
  );
}

function SectionHeader({ section, collapsedSections, setCollapsedSections }) {
  const bgHighlightColor = useBackgroundHighlightColor();

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
          <Text>{section.count}</Text>
        </View>
        {section.count === 0 ? null :
        <Icon
          as={FontAwesome}
          testID={`${section.id}:toggler`}
          name={
            collapsedSections.has(section.title)
              ? 'angle-down'
              : 'angle-up'
          }
        />}
      </TouchableOpacity>
    </View>
  );
}
