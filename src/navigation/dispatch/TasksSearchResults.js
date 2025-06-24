import { StyleSheet } from 'react-native';
import { Text, View } from 'native-base';
import { useSelector } from 'react-redux';

import { filterTasksByKeyword } from '../../shared/src/logistics/redux/taskUtils';
import { mediumGreyColor } from '../../styles/common';
import {
  selectTaskLists,
  selectUnassignedTasksNotCancelled,
} from '../../shared/logistics/redux';
import BasicSafeAreaView from '../../components/BasicSafeAreaView';
import GroupedTasks from './components/GroupedTasks';


export default function TasksSearchResults({
  route,
}) {
  const unassignedTasks = useSelector(selectUnassignedTasksNotCancelled);
  const taskLists = useSelector(selectTaskLists);

  const filteredUnassignedTasks = filterTasksByKeyword(unassignedTasks, route.params.searchQuery);
  const filteredTasksLists = taskLists
    .map(taskList => {
      const filteredTaskList = {...taskList};
      filteredTaskList.items = filterTasksByKeyword(taskList.items, route.params.searchQuery);

      return filteredTaskList;
    })
    .filter(taskList => taskList.items.length > 0);

  return (
    <BasicSafeAreaView>
      <View style={styles.view}>
        <Text style={styles.text}>Search results for '{route.params.searchQuery}'</Text>
      </View>
      <GroupedTasks
        route={route}
        taskLists={filteredTasksLists}
        unassignedTasks={filteredUnassignedTasks}
      />
    </BasicSafeAreaView>
  )
}

const styles = StyleSheet.create({
  view: {
    alignItems: 'center',
    backgroundColor: mediumGreyColor,
    borderTopColor: '#ddd',
    borderTopWidth: 1,
    flexDirection: 'row',
    height: 68,
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  text: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
