import _ from 'lodash';
import { Text } from 'native-base';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { InteractionManager, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import TapToRefresh from '../../components/TapToRefresh';
import TaskList from '../../components/TaskList';
import {
  selectAllTasks,
  selectSelectedDate,
  selectTasksWithColor,
} from '../../coopcycle-frontend-js/logistics/redux';
import { navigateToTask } from '../../navigation/utils';
import {
  initialize,
  loadTasksRequest,
} from '../../redux/Dispatch/actions';
import { selectUnassignedTasksNotCancelled } from '../../redux/Dispatch/selectors';
import { useBulkAssignTasksMutation } from '../../redux/api/slice';
import AddButton from './components/AddButton';
import { useAllTasks } from './useAllTasks';
import { withUnassignedLinkedTasks } from '../../shared/src/logistics/redux/taskUtils';


function UnassignedTasks({
  navigation,
  route,
}) {
  const { t } = useTranslation();
  const { navigate } = navigation;

  const tasksWithColor = useSelector(selectTasksWithColor);
  const unassignedTasks = useSelector(selectUnassignedTasksNotCancelled);

  const dispatch = useDispatch();
  const selectedDate = useSelector(selectSelectedDate);

  // USING SLICE
  const [bulkAssignTasks] = useBulkAssignTasksMutation();
  const allTasks = useSelector(selectAllTasks); 

  const {
    isFetching,
    isError,
    refetch
  } = useAllTasks(selectedDate);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      dispatch(initialize());
    });
  }, [dispatch]);

  useEffect(() => {
    if (isFetching) {
      dispatch(loadTasksRequest());
    }
  }, [dispatch, isFetching]);

  const _assignTask = (task, user) => {
    navigation.navigate('DispatchUnassignedTasks');
    // dispatch(assignTask(task, user.username));
    const taskIdToAssign = withUnassignedLinkedTasks(task, allTasks)
      .map(item => item['@id']);
    bulkAssignTasks({
      tasks: taskIdToAssign,
      username: user.username,
      date: selectedDate
    })
  }

  const assignSelectedTasks = (selectedTasks) => {
    navigation.navigate('DispatchPickUser', {
      onItemPress: user => _bulkAssign(user, selectedTasks),
    });
  }

  const _bulkAssign = (user, tasks) => {
    navigation.navigate('DispatchUnassignedTasks');
    //  dispatch(bulkAssignmentTasks(tasks, user.username, selectedDate));
    const taskIdsToAssign = _.uniq(
          tasks.reduce((acc, task) => acc.concat(withUnassignedLinkedTasks(task, allTasks)), [])
            .map(task => task['@id'])
        );
    bulkAssignTasks({
      tasks: taskIdsToAssign,
      username: user.username,
      date: selectedDate
    });
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
        {unassignedTasks && !isFetching && (
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
            allowMultipleSelection={allowToSelect}
            multipleSelectionIcon="user"
            onMultipleSelectionAction={assignSelectedTasks}
            onRefresh={refetch}
          />
        )}
      </View>
    </View>
  );
}

export default UnassignedTasks;
