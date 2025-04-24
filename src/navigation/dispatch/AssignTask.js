import { Text } from 'native-base';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useSelector } from 'react-redux';

import TaskList from '../../components/TaskList';
import { selectAllTasks, selectSelectedDate, selectTaskLists, selectTasksWithColor } from '../../coopcycle-frontend-js/logistics/redux';
import { useSetTaskListsItemsMutation } from '../../redux/api/slice';
import { getTasksForUser, withUnassignedLinkedTasks } from '../../shared/src/logistics/redux/taskUtils';
import { selectUnassignedTasksNotCancelled } from '../../redux/Dispatch/selectors';

export default function AssignTask({ route }) {
 const { t }  = useTranslation()
 const unassignedTasks = useSelector(selectUnassignedTasksNotCancelled);
 const isEmpty = unassignedTasks.length === 0;
 const tasksWithColor = useSelector(selectTasksWithColor);
 const selectedDate = useSelector(selectSelectedDate);

 let contentProps = {};
    if (isEmpty) {
      contentProps = {
        flex: 1,
        justifyContent: 'center',
      };
    }

   // USING SLICE
   const [setTaskListsItems] = useSetTaskListsItemsMutation();
   const allTasks = useSelector(selectAllTasks); 
   const allTaskLists = useSelector(selectTaskLists);

 const assignTask = (task) => {
  const username = route.params.username
  const existingTaskIds = getTasksForUser(username, allTaskLists)
  const taskIdsToAssign = withUnassignedLinkedTasks(task, allTasks)
        .map(item => item['@id']);
  const allTaskIds = [...existingTaskIds, ...taskIdsToAssign];
        setTaskListsItems({
        tasks: allTaskIds,
        username: username,
        date: selectedDate
      })
 }

 return (
  <View style={contentProps}>
    {isEmpty && (
      <View
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text note>{t('DISPATCH_NO_TASKS')}</Text>
      </View>
    )}
    {!isEmpty && (
      <TaskList
        tasks={unassignedTasks}
        tasksWithColor={tasksWithColor}
        onTaskClick={task => assignTask(task)}
      />
    )}
  </View>
)}
