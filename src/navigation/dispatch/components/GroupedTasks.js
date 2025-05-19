import { Icon, Text, View } from 'native-base';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';

import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import {
  //LayoutAnimation,
  //Platform,
  Pressable,
  SectionList,
  //UIManager,
} from 'react-native';
import TaskList from '../../../components/TaskList';
import { navigateToTask } from '../../../navigation/utils';
import { selectUnassignedTasksNotCancelled } from '../../../redux/Dispatch/selectors';
import { selectTasksWithColor } from '../../../shared/logistics/redux';
import useSetTaskListsItems from '../../../shared/src/logistics/redux/hooks/useSetTaskListItems';
import { whiteColor } from '../../../styles/common';

export default function GroupedTasks({ sections, route, isFetching, refetch }) {
  const navigation = useNavigation();
  const tasksWithColor = useSelector(selectTasksWithColor);
  const unassignedTasks = useSelector(selectUnassignedTasksNotCancelled);

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

  // collapsable
  const [collapsedSections, setCollapsedSections] = useState(new Set());
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
        keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
        renderItem={({ section, index }) => {
          // TODO check why lists are repeating, is this necessary?
          // TODO handle isCollapsed without null
          if (index === 0 && !isFetching) {
            const isCollapsed = collapsedSections.has(section.title);
            return (
              //<View height={isCollapsed ? 0 : 'auto'}>
              //<View opacity={isCollapsed ? 0.0 : 1.0}>
              <View style={{display: isCollapsed ? 'none' : 'flex'}}>
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
              </View>
            );
          }
          return null;
        }}
        renderSectionHeader={({ section }) => (
          <Pressable onPress={() => handleToggle(section.title)}>
            <View
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
                <Text>
                  {section.count}
                </Text>
              </View>
              <Icon
                as={FontAwesome}
                name={
                  collapsedSections.has(section.title)
                    ? 'angle-down'
                    : 'angle-up'
                }
              />
            </View>
          </Pressable>
        )}
        stickySectionHeadersEnabled={true}
        refreshing={isFetching}
        onRefresh={refetch}
      />
    </>
  );
}
