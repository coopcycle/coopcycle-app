import { Pressable, SectionList } from 'react-native';
import { Text } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useState } from 'react';

import { darkRedColor } from '../../../styles/common';
import { navigateToTask } from '../../../navigation/utils';
import { selectTasksWithColor } from '../../../shared/logistics/redux';
import { selectUnassignedTasksNotCancelled } from '../../../redux/Dispatch/selectors';
import TaskList from '../../../components/TaskList';
import useSetTaskListsItems from '../../../shared/src/logistics/redux/hooks/useSetTaskListItems';


export default function GroupedTasks({
  sections,
  route,
  isFetching,
  refetch
}) {
  const navigation = useNavigation();
  const tasksWithColor = useSelector(selectTasksWithColor);
  const unassignedTasks = useSelector(selectUnassignedTasksNotCancelled);

  // collapsable
  const [collapsedSections, setCollapsedSections] = useState(new Set());

  const handleToggle = (title) => {
    setCollapsedSections(() => {
      const next = new Set(collapsedSections);
      if (next.has(title)) {
        next.delete(title);
      } else {
        next.add(title);
      }
      return next;
    });
  };

  // data
  const {
    assignTask,
    assignTaskWithRelatedTasks,
    bulkAssignTasksWithRelatedTasks,
    reassignTask,
    reassignTaskWithRelatedTasks,
    unassignTask,
    unassignTaskWithRelatedTasks,
  } = useSetTaskListsItems();

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

  const assignSelectedTasks = selectedTasks => {
    navigation.navigate('DispatchPickUser', {
      onItemPress: user => _bulkAssign(user, selectedTasks),
    });
  };

  const _bulkAssign = (user, selectedTasks) => {
    navigation.navigate('DispatchAllTasks');
    bulkAssignTasksWithRelatedTasks(selectedTasks, user);
  };

  const allowToSelect = task => {
    return task.status !== 'DONE';
  };

  const swipeLeftConfiguration = section => ({
    onSwipeLeft: assignTaskWithRelatedTasksHandler(section.isUnassignedTaskList),
    swipeOutLeftBackgroundColor: darkRedColor,
    swipeOutLeftEnabled: allowToSelect,
    swipeOutLeftIconName: 'cube',
  });

  const swipeRightConfiguration = section => ({
    onSwipeRight: assignTaskHandler(section.isUnassignedTaskList),
    swipeOutRightBackgroundColor: darkRedColor,
    swipeOutRightEnabled: allowToSelect,
    swipeOutRightIconName: 'user',
  });

  return (
    <>
      <SectionList
        sections={sections}
        renderSectionHeader={({ section }) => (
          <Pressable onPress={() => handleToggle(section.title)}>
            <Text
              style={{
                backgroundColor: section.backgroundColor,
                color: section.textColor,
                padding: 20,
                fontWeight: 700
              }}>
              {section.title}
            </Text>
          </Pressable>
        )}
        stickySectionHeadersEnabled={true}
        keyExtractor={(item, index) => item.id}
        renderItem={({ section, index }) => {
          const isCollapsed = collapsedSections.has(section.title);
          // TODO check why lists are repeating, is this necessary?
          if (index === 0 && !isFetching && !isCollapsed) {
            return (
              <TaskList
                id={section.id}
                tasks={section.data}
                tasksWithColor={tasksWithColor}
                onTaskClick={onTaskClick}
                {...swipeLeftConfiguration(section)}
                {...swipeRightConfiguration(section)}
                allowMultipleSelection={allowToSelect}
                multipleSelectionIcon="user"
                onMultipleSelectionAction={assignSelectedTasks}
              />
            );
          }
          return null; // Avoid rendering per item
        }}
        refreshing={isFetching}
        onRefresh={refetch}
      />
    </>
  );
}
