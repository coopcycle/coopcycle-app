import { Box, Text } from 'native-base';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, InteractionManager, View } from 'react-native';
import { connect, useDispatch, useSelector } from 'react-redux';

import TapToRefresh from '../../components/TapToRefresh';
import TaskList from '../../components/TaskList';
import {
  selectSelectedDate,
  selectTasksWithColor,
  selectUnassignedTasks,
} from '../../coopcycle-frontend-js/logistics/redux';
import { useFetchAllUnassignedTasks } from '../../hooks/useFetchAllUnassignedTasks';
import { navigateToTask } from '../../navigation/utils';
import {
  assignTask,
  bulkAssignmentTasks,
  initialize,
  /*   loadUnassignedTasks, */
  setUnassignedTasks,
} from '../../redux/Dispatch/actions';
import { selectUnassignedTasksNotCancelled } from '../../redux/Dispatch/selectors';
import { tasksSort } from '../../shared/src/logistics/redux/taskUtils';
import AddButton from './components/AddButton';


function UnassignedTasks({
  /* refreshTasks,,
  initialize,
  assignTask,
  bulkAssignmentTasks,
  unassignedTasks, */
  date,
  navigation,
  tasksWithColor,
  route,
}) {
  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      initialize();
    });
  }, [/* initialize */]);

  const {
    unassignedTasks: backendUnassignedTasks,
    error,
    isLoading,
    refreshTasks
  } = useFetchAllUnassignedTasks(date, { enabled: true})


  const dispatch = useDispatch()

  useEffect(() => {
    if (backendUnassignedTasks && backendUnassignedTasks.length > 0) {
      dispatch(setUnassignedTasks(backendUnassignedTasks))
    }
  }, [backendUnassignedTasks, dispatch])

  const { t } = useTranslation()
  // check selectUnassignedTasks, shoud we create a new one on Dispatch/selectors ?
  const unassignedTasks = useSelector(selectUnassignedTasks)
  console.log('unassignedTasks:', unassignedTasks);


  const _assignTask = (task, user) => {
    navigation.navigate('DispatchUnassignedTasks');
    assignTask(task, user.username);
  }

  const assignSelectedTasks = (selectedTasks) => {
    navigation.navigate('DispatchPickUser', {
      onItemPress: user => _bulkAssign(user, selectedTasks),
    });
  }

  const _bulkAssign = (user, tasks) => {
    navigation.navigate('DispatchUnassignedTasks');
    bulkAssignmentTasks(tasks, user.username);
  }

  const allowToSelect = (task) => {
    return task.status !== 'DONE';
  }

  const { navigate } = navigation;
  const isEmpty = unassignedTasks?.length === 0;

  return (
    <View style={{ flex: 1 }}>
      <View>
        <AddButton
          testID="dispatchNewDelivery"
          onPress={() => navigation.navigate('DispatchNewDelivery')}>
          <Text style={{ fontWeight: '700' }}>
            {date.format('ll')}
          </Text>
        </AddButton>
      </View>
      <View style={{ flex: 1 }}>
        {isLoading &&
          <Box flex={1} justifyContent="center" alignItems="center">
            <ActivityIndicator animating={true} size="large" />
          </Box>}
        {error && <Text style={{ textAlign: 'center' }}>{t('AN_ERROR_OCCURRED')}</Text>}
        {isEmpty && <TapToRefresh onPress={refreshTasks} />}
        {!isEmpty && (
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
          />
        )}
      </View>
    </View>
  );
}

function mapStateToProps(state) {
  return {
    unassignedTasks: selectUnassignedTasksNotCancelled(state).sort(tasksSort),
    tasksWithColor: selectTasksWithColor(state),
    date: selectSelectedDate(state),
    user: state.app.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    assignTask: (task, username) => dispatch(assignTask(task, username)),
    initialize: () => dispatch(initialize()),
/*     loadUnassignedTasks: () => dispatch(loadUnassignedTas()), */
    bulkAssignmentTasks: (tasks, username) =>
      dispatch(bulkAssignmentTasks(tasks, username)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UnassignedTasks);
