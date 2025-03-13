import { InteractionManager, View } from 'react-native';
import { Text } from 'native-base';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import React, { useEffect } from 'react';

import {
  assignTask,
  bulkAssignmentTasks,
  initialize,
  loadTaskListsSuccess,
  loadUnassignedTasksRequest,
  loadUsersSuccess,
} from '../../redux/Dispatch/actions';
import { navigateToTask } from '../../navigation/utils';
import {
  selectSelectedDate,
  selectTasksWithColor,
} from '../../coopcycle-frontend-js/logistics/redux';
import { useGetCourierUsersQuery } from '../../redux/api/slice';
import { useLoadAllTasks } from '../../hooks/useLoadAllTasks';
import AddButton from './components/AddButton';
import TapToRefresh from '../../components/TapToRefresh';
import TaskList from '../../components/TaskList';


function UnassignedTasks({
  navigation,
  route,
}) {
  const { t } = useTranslation();
  const { navigate } = navigation;

  const tasksWithColor = useSelector(selectTasksWithColor);

  const dispatch = useDispatch();
  const selectedDate = useSelector(selectSelectedDate);
  const {
    unassignedTasks,
    taskLists,
    isLoading,
    isError,
    refetch
  } = useLoadAllTasks(selectedDate);

  const {
    data: tours,
  } = useGetToursQuery(selectedDate);

  const {
    data: courierUsers,
  } = useGetCourierUsersQuery();

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      dispatch(initialize());
    });
  }, [dispatch]);

  useEffect(() => {
    if(isLoading) {
      dispatch(loadUnassignedTasksRequest());
    }
  }, [dispatch, isLoading]);

  useEffect(() => {
    if (taskLists) {
      dispatch(loadTaskListsSuccess(taskLists))
    }
  }, [dispatch, taskLists]);

  useEffect(() => {
    if(courierUsers) {
      dispatch(loadUsersSuccess(courierUsers))
    }
  }, [courierUsers, dispatch]);

  const _assignTask = (task, user) => {
    navigation.navigate('DispatchUnassignedTasks');
    dispatch(assignTask(task, user.username));
  }

  const assignSelectedTasks = (selectedTasks) => {
    navigation.navigate('DispatchPickUser', {
      onItemPress: user => _bulkAssign(user, selectedTasks),
    });
  }

  const _bulkAssign = (user, tasks) => {
    navigation.navigate('DispatchUnassignedTasks');
    dispatch(bulkAssignmentTasks(tasks, user.username));
  }

  const allowToSelect = (task) => {
    return task.status !== 'DONE';
  }

  return (
    <View style={{ flex: 1 }}>
      <View>
        <AddButton
          testID="dispatchNewDelivery"
          onPress={() => navigation.navigate('DispatchNewDelivery')}>
          <Text style={{ fontWeight: '700' }}>
            {selectedDate.format('ll')}
          </Text>
        </AddButton>
      </View>
      <View style={{ flex: 1 }}>
        {isError && <Text style={{ textAlign: 'center' }}>{t('AN_ERROR_OCCURRED')}</Text>}
        {!unassignedTasks && <TapToRefresh onPress={refetch} />}
        {unassignedTasks && (
          <TaskList
            tasks={unassignedTasks}
            tasksWithColor={tasksWithColor}
            swipeOutLeftEnabled={task => !task.isAssigned}
            onSwipeLeft={task =>
              navigate('DispatchPickUser', {
                onItemPress: user => _assignTask(task, user),
              })
            }
            swipeOutLeftIconName="user"
            onTaskClick={task =>
              navigateToTask(
                navigation,
                route,
                task,
                unassignedTasks,
              )
            }
            allowMultipleSelection={task => allowToSelect(task)}
            multipleSelectionIcon="user"
            onMultipleSelectionAction={selectedTasks =>
              assignSelectedTasks(selectedTasks)
            }
            refresh={refetch}
          />
        )}
      </View>
    </View>
  );
}

export default UnassignedTasks;
