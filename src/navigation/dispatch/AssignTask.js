import { Text } from 'native-base';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import React from 'react';

import { selectTasksWithColor } from '../../coopcycle-frontend-js/logistics/redux';
import { selectUnassignedTasksNotCancelled } from '../../redux/Dispatch/selectors';
import TaskList from '../../components/TaskList';
import useSetTaskListsItems from '../../shared/src/logistics/redux/hooks/useSetTaskListItems';


export default function AssignTask({ route }) {
  const { t } = useTranslation()
  const unassignedTasks = useSelector(selectUnassignedTasksNotCancelled);
  const isEmpty = unassignedTasks.length === 0;
  const tasksWithColor = useSelector(selectTasksWithColor);

  let contentProps = {};
  if (isEmpty) {
    contentProps = {
      flex: 1,
      justifyContent: 'center',
    };
  }

  const {
    assignTaskWithRelatedTasks,
  } = useSetTaskListsItems();

  const assignTask = (task) => {
    const user = {username: route.params.username};
    assignTaskWithRelatedTasks(task, user);
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
  )
}
