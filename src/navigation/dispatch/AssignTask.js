import { Text } from 'native-base';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { selectTasksWithColor } from '../../coopcycle-frontend-js/logistics/redux';
import { selectUnassignedTasksNotCancelled } from '../../redux/Dispatch/selectors';
import TaskList from '../../components/TaskList';
import useSetTaskListItems from '../../shared/src/logistics/redux/hooks/useSetTaskListItems';


export default function AssignTask({ route }) {
  const { t } = useTranslation()
  const unassignedTasks = useSelector(selectUnassignedTasksNotCancelled);
  const isEmpty = useMemo(() => unassignedTasks.length === 0, [unassignedTasks.length]);
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
  } = useSetTaskListItems();

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
