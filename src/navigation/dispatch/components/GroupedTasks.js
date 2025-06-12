import { useNavigation } from '@react-navigation/native';
import { Icon, Text, View } from 'native-base';
import { useRef, useState } from 'react';
import {
  SectionList,
  TouchableOpacity,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';

import { assignOrderIconName, assignTaskIconName } from '../../task/styles/common';
import {
  darkRedColor,
  lightGreyColor,
  whiteColor
} from '../../../styles/common';
import { getTasksListIdsToEdit } from '../../../shared/src/logistics/redux/taskListUtils';
import { navigateToTask } from '../../../navigation/utils';
import { selectTasksWithColor } from '../../../shared/logistics/redux';
import { selectUnassignedTasksNotCancelled } from '../../../redux/Dispatch/selectors';
import { UNASSIGNED_TASKS_LIST_ID } from '../../../shared/src/constants';
import BulkEditTasksFloatingButton from './BulkEditTasksFloatingButton';
import TaskList from '../../../components/TaskList';
import useSetTaskListItems from '../../../shared/src/logistics/redux/hooks/useSetTaskListItems';

export default function GroupedTasks({
  sections,
  route,
  isFetching,
  refetch
}) {
  const navigation = useNavigation();
  const tasksWithColor = useSelector(selectTasksWithColor);
  const unassignedTasks = useSelector(selectUnassignedTasksNotCancelled);
  const bulkEditTasksFloatingButtonRef = useRef(null);

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
  } = useSetTaskListItems();

  const onTaskClick = task => {
    navigateToTask(navigation, route, task, unassignedTasks);
  };

  const assignTaskWithRelatedTasksHandler = isUnassignedTaskList => task => {
    const onItemPress = user => _onSelectNewAssignation(
      () => (isUnassignedTaskList ? assignTaskWithRelatedTasks : reassignTaskWithRelatedTasks)(task, user),
    );

    const onUnassignButtonPress = () => _onSelectNewAssignation(
      () => unassignTaskWithRelatedTasks(task),
    );

    navigation.navigate('DispatchPickUser', {
      onItemPress,
      showUnassignButton: !isUnassignedTaskList,
      onUnassignButtonPress,
    });
  };

  const assignTaskHandler = isUnassignedTaskList => task => {
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
  };

  const _onSelectNewAssignation = (callback) => {
    navigation.navigate('DispatchAllTasks');
    callback();
  }

  const handleOnSwipeToLeft = (task, taskListId) => {
    bulkEditTasksFloatingButtonRef.current?.addOrder(task, taskListId);
  }

  const handleOnSwipeToRight = (task, taskListId) => {
    bulkEditTasksFloatingButtonRef.current?.addTask(task, taskListId);
  }

  const handleOnSwipeClose = (section) => (task) => {
    bulkEditTasksFloatingButtonRef.current?.removeOrder(task, section.taskListId);
    bulkEditTasksFloatingButtonRef.current?.removeTask(task, section.taskListId);
  };

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
          bulkEditTasksFloatingButtonRef.current?.clearSelectedTasks();
        })
      },
      showUnassignButton,
      onUnassignButtonPress: () => {
        _onSelectNewAssignation(async () => {
          await bulkEditTasks(selectedTasks);
          bulkEditTasksFloatingButtonRef.current?.clearSelectedTasks();
        })
      },
    });
  };

  const allowToSelect = task => {
    return task.status !== 'DONE';
  };

  const swipeLeftConfiguration = section => ({
    onPressLeft: assignTaskWithRelatedTasksHandler(section.isUnassignedTaskList),
    onSwipeToLeft: (task) => handleOnSwipeToLeft(task, section.taskListId),
    swipeOutLeftBackgroundColor: darkRedColor,
    swipeOutLeftEnabled: allowToSelect,
    swipeOutLeftIconName: assignOrderIconName,
  });

  const swipeRightConfiguration = section => ({
    onPressRight: assignTaskHandler(section.isUnassignedTaskList),
    onSwipeToRight: (task) => handleOnSwipeToRight(task, section.taskListId),
    swipeOutRightBackgroundColor: darkRedColor,
    swipeOutRightEnabled: allowToSelect,
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
        sections={sections}
        stickySectionHeadersEnabled={true}
        renderSectionHeader={({ section }) => (
          <View style={{ backgroundColor: lightGreyColor }}>
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
        )}
        keyExtractor={(item, index) => item.id}
        renderItem={({ section, index }) => {
          // TODO check why lists are repeating, is this necessary?
          if (index === 0 && !isFetching) {
            const isCollapsed = collapsedSections.has(section.title);
            return (
              <View style={{ overflow: 'hidden', height: isCollapsed ? 0 : 'auto' }}>
                <TaskList
                  id={section.id}
                  onTaskClick={onTaskClick}
                  tasks={section.data}
                  tasksWithColor={tasksWithColor}
                  onSwipeClosed={handleOnSwipeClose(section)}
                  {...swipeLeftConfiguration(section)}
                  {...swipeRightConfiguration(section)}
                />
              </View>
            );
          }
          return null;
        }}
        // We pass those 2 to SectionList instead of TaskList
        refreshing={isFetching}
        onRefresh={refetch}
      />
      <BulkEditTasksFloatingButton
        onPress={handleBulkAssignButtonPress}
        iconName="user-circle"
        ref={bulkEditTasksFloatingButtonRef}
      />
    </>
  );
}
