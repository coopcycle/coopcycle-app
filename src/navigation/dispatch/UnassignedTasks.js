import { connect } from 'react-redux';
import { InteractionManager, View } from 'react-native';
import { Text } from 'native-base';
import { withTranslation } from 'react-i18next';
import moment from 'moment';
import React, { useEffect } from 'react';

import {
  assignTask,
  bulkAssignmentTasks,
  initialize,
  loadUnassignedTasks,
} from '../../redux/Dispatch/actions';
import {
  selectSelectedDate,
  selectTasksWithColor,
} from '../../coopcycle-frontend-js/logistics/redux';
import { navigateToTask } from '../../navigation/utils';
import { selectUnassignedTasksNotCancelled } from '../../redux/Dispatch/selectors';
import { tasksSort } from '../../shared/src/logistics/redux/taskUtils';
import { useFetchAllTasks } from '../../hooks/useFetchAllTasks';
import AddButton from './components/AddButton';
import TapToRefresh from '../../components/TapToRefresh';
import TaskList from '../../components/TaskList';


// hight order component that uses the hook
function withTasksLoader(WrappedWithTasksComponent) {
  return function WithTasksLoader(props) {
    const date = props.date || moment()
    const {
      tasks,
      error,
      isLoading,
      refreshTasks
    } = useFetchAllTasks(date, { enabled: true})

    return (
      <WrappedWithTasksComponent
        {...props}
        tasksFromHook={tasks}
        tasksError={error}
        tasksLoading={isLoading}
        refreshTasks={refreshTasks}
      />
    )
  }
}

function UnassignedTasks({
  initialize,
  navigation,
  assignTask,
  bulkAssignmentTasks,
  unassignedTasks,
  date,
  refreshTasks,
  tasksWithColor,
  route,
}) {
  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      initialize();
    });
  }, [initialize]);

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
  const isEmpty = unassignedTasks.length === 0;

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
    /* loadUnassignedTasks: () => dispatch(loadUnassignedTasks()), */
    bulkAssignmentTasks: (tasks, username) =>
      dispatch(bulkAssignmentTasks(tasks, username)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTasksLoader(withTranslation()(UnassignedTasks)));
