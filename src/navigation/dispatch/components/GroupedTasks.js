import { Text } from 'native-base';
import { useSelector } from 'react-redux';

import { useNavigation } from '@react-navigation/native';
import { RefreshControl, SectionList } from 'react-native';
import TaskList from '../../../components/TaskList';
import { navigateToTask } from '../../../navigation/utils';
import { selectUnassignedTasksNotCancelled } from '../../../redux/Dispatch/selectors';
import { selectTasksWithColor } from '../../../shared/logistics/redux';
import useSetTaskListsItems from '../../../shared/src/logistics/redux/hooks/useSetTaskListItems';

export default function GroupedTasks({
  sections,
  route,
  refetch,
  isFetching,
}) {
  const navigation = useNavigation();

  const tasksWithColor = useSelector(selectTasksWithColor);
  const unassignedTasks = useSelector(selectUnassignedTasksNotCancelled);

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
          // TODO check why lists are repeating, is this necessary?
          if (index === 0) {
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
              />
            );
          }
          return null; // Avoid rendering per item
        }}
        renderSectionHeader={({ section }) => (
          <Text
            style={{
              backgroundColor: section.backgroundColor,
              color: section.textColor,
              padding: 20,
              fontWeight: 700
            }}>
            {section.title}
          </Text>
        )}
        onRefresh={refetch}
        refreshing={isFetching}
        // TODO loader disappears
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} />
        } 
        stickySectionHeadersEnabled={true}
      />
    </>
  );
}
