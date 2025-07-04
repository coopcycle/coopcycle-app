import { useNavigation } from '@react-navigation/native';
import { Icon, Text, View } from 'native-base';
import {
  SectionList,
  TouchableOpacity,
} from 'react-native';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {
  addOrder,
  addTask,
  clearSelectedTasks,
  removeTasksAndOrders,
} from '../../../redux/Dispatch/updateSelectedTasksSlice';
import { assignOrderIconName, assignTaskIconName } from '../../task/styles/common';
import {
  darkGreyColor,
  darkRedColor,
  whiteColor
} from '../../../styles/common';
import {
  createTempTaskList,
  getLinkedTasks,
  getTaskListTasks,
  getTasksListIdsToEdit,
} from '../../../shared/src/logistics/redux/taskListUtils';
import { selectTaskLists, selectTasksEntities, selectTasksWithColor } from '../../../shared/logistics/redux';
import { UNASSIGNED_TASKS_LIST_ID } from '../../../shared/src/constants';
import { useBackgroundHighlightColor } from '../../../styles/theme';
import BulkEditTasksFloatingButton from './BulkEditTasksFloatingButton';
import TaskList from '../../../components/TaskList';
import useSetTaskListItems from '../../../shared/src/logistics/redux/hooks/useSetTaskListItems';
import useNavigateToTask from '../useNavigateToTask';


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
  const allTaskLists = useSelector(selectTaskLists);
  const navigateToTask = useNavigateToTask({
    allTaskLists,
    navigation,
    route,
    tasksEntities,
  });

  // Combine unassigned tasks and task lists to use in SectionList
  const sections = useMemo(() => [
    {
      backgroundColor: whiteColor,
      count: unassignedTasks.length,
      data: [createTempTaskList(UNASSIGNED_TASKS_LIST_ID, unassignedTasks)],
      id: UNASSIGNED_TASKS_LIST_ID,
      isUnassignedTaskList: true,
      taskListId: UNASSIGNED_TASKS_LIST_ID,
      textColor: darkGreyColor,
      title: t('DISPATCH_UNASSIGNED_TASKS'),
    },
    ...taskLists.map(taskList => ({
      backgroundColor: taskList.color ? taskList.color : darkGreyColor,
      count: taskList.tasksIds.length,
      data: [taskList],
      id: `${taskList.username.toLowerCase()}TasksList`,
      isUnassignedTaskList: false,
      taskListId: taskList['@id'],
      textColor: whiteColor,
      title: taskList.username,
    })),
  ], [t, taskLists, unassignedTasks]);

  const filteredSections = hideEmptyTaskLists
    ? sections.filter(section => section.data.length > 0)
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

  const onTaskClick = useCallback(isUnassignedTaskList => task => {
    navigateToTask(isUnassignedTaskList, task);
  }, [navigateToTask]);

  const assignTaskWithRelatedTasksHandler = useCallback(isUnassignedTaskList => task => {
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
  }, [onSelectNewAssignation, assignTaskWithRelatedTasks, navigation, reassignTaskWithRelatedTasks, unassignTaskWithRelatedTasks]);

  const assignTaskHandler = useCallback(isUnassignedTaskList => task => {
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
  }, [onSelectNewAssignation, assignTask, navigation, reassignTask, unassignTask]);

  const onSelectNewAssignation = useCallback((callback) => {
    navigation.navigate('DispatchAllTasks');
    callback();
  }, [navigation]);

  const handleOnSwipeToLeft = useCallback(taskListId => task => {
    const tasksByTaskList = getLinkedTasks(task, taskListId);
    dispatch(addOrder(tasksByTaskList));
  }, [dispatch]);

  const handleOnSwipeToRight = useCallback(taskListId => task => {
    dispatch(addTask({ task, taskListId }));
  }, [dispatch]);

  const handleOnSwipeClose = useCallback((section, task) => {
    const taskListId = section.taskListId;
    const tasksByTaskList = getLinkedTasks(task, taskListId);

    dispatch(removeTasksAndOrders(tasksByTaskList));
  }, [dispatch]);

  const handleBulkAssignButtonPress = useCallback((selectedTasks) => {
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
  }, [onSelectNewAssignation, bulkEditTasks, dispatch, navigation]);

  const allowToSelect = task => {
    return task.status !== 'DONE';
  };

  const swipeLeftConfiguration = useCallback(section => ({
    onPressLeft: assignTaskWithRelatedTasksHandler(section.isUnassignedTaskList),
    onSwipeToLeft: handleOnSwipeToLeft(section.taskListId),
    swipeOutLeftEnabled: allowToSelect,
    swipeOutLeftBackgroundColor: darkRedColor,
    swipeOutLeftIconName: assignOrderIconName,
  }), [assignTaskWithRelatedTasksHandler, handleOnSwipeToLeft]);

  const swipeRightConfiguration = useCallback(section => ({
    onPressRight: assignTaskHandler(section.isUnassignedTaskList),
    onSwipeToRight: handleOnSwipeToRight(section.taskListId),
    swipeOutRightBackgroundColor: darkRedColor,
    swipeOutRightEnabled: allowToSelect,
    swipeOutRightIconName: assignTaskIconName,
  }), [assignTaskHandler, handleOnSwipeToRight]);

  const renderSectionHeader = useCallback(({ section }) => (
    <SectionHeader
      section={section}
      collapsedSections={collapsedSections}
      setCollapsedSections={setCollapsedSections}
    />
  ), [collapsedSections]);

  const renderItem = useCallback(({ section, item, index }) => {
    if (!isFetching && !collapsedSections.has(section.title)) {
      const tasks = getTaskListTasks(item, tasksEntities);

      return (
        <TaskList
          id={section.id}
          onTaskClick={onTaskClick(section.isUnassignedTaskList)}
          tasks={tasks}
          tasksWithColor={tasksWithColor}
          onSwipeClosed={(task) =>{handleOnSwipeClose(section, task)}}
          {...swipeLeftConfiguration(section)}
          {...swipeRightConfiguration(section)}
        />
      );
    }

    return null;
  }, [collapsedSections, handleOnSwipeClose, isFetching, onTaskClick, swipeLeftConfiguration, swipeRightConfiguration, tasksEntities, tasksWithColor]);

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
  const { t } = useTranslation();
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
            {section.isUnassignedTaskList
              ? <Text style={{ color: section.textColor }}>
                ({section.data.length} {t('TASKS')})
              </Text>
              : <Text style={{ color: darkGreyColor }} >
                {section.data.length}
              </Text>
            }
        </View>
        {section.data.length === 0 ? null : (
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
  );
}
