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
    unassignTaskWithRelatedTasks,
    assignTaskWithRelatedTasks,
    bulkAssignTasksWithRelatedTasks,
  } = useSetTaskListsItems();

  const onTaskClick = task => {
    navigateToTask(navigation, route, task, unassignedTasks);
  };

  const assignTaskHandler = task => {
    navigation.navigate('DispatchPickUser', {
      onItemPress: user => _assignTask(task, user),
    });
  };

  const unassignTaskHandler = task => {
    unassignTaskWithRelatedTasks(task);
  };

  const _assignTask = (task, user) => {
    navigation.navigate('DispatchAllTasks');
    assignTaskWithRelatedTasks(task, user);
  };

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

  const swipeLeftConfiguration = {
    onSwipeLeft: assignTaskHandler,
    swipeOutLeftBackgroundColor: darkRedColor,
    swipeOutLeftEnabled: allowToSelect,
    swipeOutLeftIconName: 'cube',
  }

  const swipeRightConfiguration = {
    onSwipeRight: unassignTaskHandler,
    swipeOutRightBackgroundColor: darkRedColor,
    swipeOutRightEnabled: allowToSelect,
    swipeOutRightIconName: 'user',
  }

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
                tasksType={section.tasksType}
                tasksWithColor={tasksWithColor}
                onTaskClick={onTaskClick}
                {...swipeLeftConfiguration}
                {...swipeRightConfiguration}
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
