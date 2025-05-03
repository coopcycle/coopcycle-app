import _ from 'lodash';
import { Text } from 'native-base';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { InteractionManager, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import {
  initialize,
  loadTasksRequest,
} from '../../redux/Dispatch/actions';
import { navigateToTask } from '../../navigation/utils';
import {
  selectSelectedDate,
  selectTasksWithColor,
} from '../../coopcycle-frontend-js/logistics/redux';
import { selectUnassignedTasksNotCancelled } from '../../redux/Dispatch/selectors';
import { useAllTasks } from './useAllTasks';
import AddButton from './components/AddButton';
import TapToRefresh from '../../components/TapToRefresh';
import TaskList from '../../components/TaskList';
import useSetTaskListItems from '../../shared/src/logistics/redux/hooks/useSetTaskListItems';


function UnassignedTasks({
  navigation,
  route,
}) {
  const { t } = useTranslation();
  const { navigate } = navigation;

  const selectedDate = useSelector(selectSelectedDate);
  const tasksWithColor = useSelector(selectTasksWithColor);
  const unassignedTasks = useSelector(selectUnassignedTasksNotCancelled);

  const dispatch = useDispatch();

  const {
    isFetching,
    isError,
    refetch
  } = useAllTasks(selectedDate);

  const {
    assignTaskWithRelatedTasks,
    bulkAssignTasksWithRelatedTasks,
  } = useSetTaskListItems();

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
    assignTaskWithRelatedTasks(task, user);
  }

  const assignSelectedTasks = (selectedTasks) => {
    navigation.navigate('DispatchPickUser', {
      onItemPress: user => _bulkAssign(user, selectedTasks),
    });
  }

  const _bulkAssign = (user, tasks) => {
    navigation.navigate('DispatchUnassignedTasks');
    bulkAssignTasksWithRelatedTasks(tasks, user);
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
