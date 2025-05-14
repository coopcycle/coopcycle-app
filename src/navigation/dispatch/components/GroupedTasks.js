import { Text } from 'native-base';
import { useSelector } from 'react-redux';

import { useNavigation } from '@react-navigation/native';
import { Pressable, SectionList } from 'react-native';
import TaskList from '../../../components/TaskList';
import { navigateToTask } from '../../../navigation/utils';
import { selectUnassignedTasksNotCancelled } from '../../../redux/Dispatch/selectors';
import { selectTasksWithColor } from '../../../shared/logistics/redux';
import useSetTaskListsItems from '../../../shared/src/logistics/redux/hooks/useSetTaskListItems';
import { useState } from 'react';

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

  const unassignTaskHandler = task => unassignTaskWithRelatedTasks(task);

  const allowToSelect = task => {
    return task.status !== 'DONE';
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

  return (
    <>
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
        renderItem={({ section, index }) => {
          const isCollapsed = collapsedSections.has(section.title);
          // TODO check why lists are repeating, is this necessary?
          if (index === 0 && !isFetching && !isCollapsed) {
            return (
              <TaskList
                tasks={section.data}
                tasksType={section.tasksType}
                tasksWithColor={tasksWithColor}
                onSwipeRight={unassignTaskHandler}
                swipeOutRightEnabled={task => task.status !== 'DONE'}
                swipeOutRightIconName="close"
                swipeOutLeftEnabled={task => !task.isAssigned}
                onSwipeLeft={task =>
                  navigation.navigate('DispatchPickUser', {
                    onItemPress: user => _assignTask(task, user),
                  })
                }
                swipeOutLeftIconName="user"
                onTaskClick={task =>
                  navigateToTask(navigation, route, task, unassignedTasks)
                }
                allowMultipleSelection={allowToSelect}
                multipleSelectionIcon="user"
                onMultipleSelectionAction={assignSelectedTasks}
                id={section.id}
              />
            );
          }
          return null; // Avoid rendering per item
        }}
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
        refreshing={isFetching}
        onRefresh={refetch}
      />
    </>
  );
}
