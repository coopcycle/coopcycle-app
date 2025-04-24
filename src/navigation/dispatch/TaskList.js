import _ from 'lodash';
import { Text } from 'native-base';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import TaskList from '../../components/TaskList';
import {
  selectAllTasks,
  selectSelectedDate,
  selectTaskLists,
  selectTasksWithColor,
} from '../../coopcycle-frontend-js/logistics/redux';
import { selectTasksNotCancelled } from '../../redux/Dispatch/selectors';
import AddButton from './components/AddButton';

import { useSelector } from 'react-redux';
import { navigateToTask } from '../../navigation/utils';
import { useSetTaskListsItemsMutation } from '../../redux/api/slice';
import { getTasksForUser, withAssignedLinkedTasks } from '../../shared/src/logistics/redux/taskUtils';

function TaskListScreen({
  navigation,
  route,
}) {
  const { t } = useTranslation();
  const { navigate } = navigation;

  const tasksWithColor = useSelector(selectTasksWithColor)
  const taskLists = useSelector(selectTaskLists)

  // USING SLICE
    const [setTaskListsItems] = useSetTaskListsItemsMutation();
    const allTasks = useSelector(selectAllTasks); 
    const allTaskLists = useSelector(selectTaskLists);
    const selectedDate = useSelector(selectSelectedDate);

    const [taskList, setTaskList] = useState(route.params?.taskList);
  const tasks = selectTasksNotCancelled({ tasks: taskList.items });

  const unassignTaskHandler = (task) => {
    const user = taskList.username
    const existingTaskIds = getTasksForUser(user, allTaskLists)
      const taskIdsToUnassign = withAssignedLinkedTasks(task, allTasks)
        .map(item => item['@id']);
      const updatedTaskIds = existingTaskIds.filter(id => !taskIdsToUnassign.includes(id));   
    setTaskListsItems({
        tasks: updatedTaskIds,
        username: taskList.username,
        date: selectedDate
      })
    }

  // TODO check
   useEffect(() => {
    if (taskLists) {
      const thisTaskList = _.find(
        taskLists,
        aTaskList => aTaskList.username === taskList.username,
      );
      if (thisTaskList) {
        navigation.setParams({ taskList: thisTaskList });
        setTaskList(thisTaskList);
      }
    }
  }, [taskLists, taskList?.username, navigation])

  return (
      <View style={{ flex: 1 }}>
        <View>
          <AddButton
            onPress={() =>
              navigate('DispatchAssignTask', { username: taskList.username })
            }>
            <Text>{t('DISPATCH_ASSIGN_TASK')}</Text>
          </AddButton>
        </View>
        <View style={{ flex: 1 }}>
          <TaskList
            tasks={tasks}
            tasksWithColor={tasksWithColor}
            onSwipeRight={unassignTaskHandler}
            swipeOutRightEnabled={task => task.status !== 'DONE'}
            swipeOutRightIconName="close"
            onTaskClick={task =>
              navigateToTask(
                navigation,
                route,
                task,
                tasks,
              )
            }
          />
        </View>
      </View>
    );
  }

export default TaskListScreen
