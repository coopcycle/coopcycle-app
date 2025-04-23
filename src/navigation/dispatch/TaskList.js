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
import { unassignTask } from '../../redux/Dispatch/actions';
import { selectTasksNotCancelled } from '../../redux/Dispatch/selectors';
import AddButton from './components/AddButton';

import { navigateToTask } from '../../navigation/utils';
import { useDispatch, useSelector } from 'react-redux';
import { withUnassignedLinkedTasks } from '../../shared/src/logistics/redux/taskUtils';
import { useSetTaskListsItemsMutation } from '../../redux/api/slice';

function TaskListScreen({
  navigation,
  route,
}) {
  const { t } = useTranslation();
  const { navigate } = navigation;
  const dispatch = useDispatch()

  const tasksWithColor = useSelector(selectTasksWithColor)
  const taskLists = useSelector(selectTaskLists)
  // const unassignTaskHandler = task => dispatch(unassignTask(task))

  // USING SLICE
    const [setTaskListsItems] = useSetTaskListsItemsMutation();
    const allTasks = useSelector(selectAllTasks); 
    const selectedDate = useSelector(selectSelectedDate);

  const unassignTaskHandler = (task) => {
      const taskIdToUnassign = withUnassignedLinkedTasks(task, allTasks)
        .map(item => item['@id']);
        setTaskListsItems({
        tasks: taskIdToUnassign,
        username: taskList.username,
        date: selectedDate
      })
    }

  const [taskList, setTaskList] = useState(route.params?.taskList);
  const tasks = selectTasksNotCancelled({ tasks: taskList.items });

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
