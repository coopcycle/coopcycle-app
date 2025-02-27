import { Text } from 'native-base';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { InteractionManager, View } from 'react-native';
import { connect } from 'react-redux';

import TapToRefresh from '../../components/TapToRefresh';
import TaskList from '../../components/TaskList';
import {
  selectSelectedDate,
  selectTasksWithColor,
} from '../../coopcycle-frontend-js/logistics/redux';
import {
  assignTask,
  bulkAssignmentTasks,
  initialize,
  loadUnassignedTasks,
} from '../../redux/Dispatch/actions';
import { selectUnassignedTasksNotCancelled } from '../../redux/Dispatch/selectors';
import AddButton from './components/AddButton';

import { navigateToTask } from '../../navigation/utils';
import moment from 'moment';
import { tasksSort } from '../../shared/src/logistics/redux/taskUtils';
import { useFetchAllTasks } from '../../hooks/useFetchAllTasks';


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

class UnassignedTasks extends Component {
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.initialize();
    });
  }

  _assignTask(task, user) {
    this.props.navigation.navigate('DispatchUnassignedTasks');
    this.props.assignTask(task, user.username);
  }

  assignSelectedTasks(selectedTasks) {
    this.props.navigation.navigate('DispatchPickUser', {
      onItemPress: user => this._bulkAssign(user, selectedTasks),
    });
  }

  _bulkAssign(user, tasks) {
    this.props.navigation.navigate('DispatchUnassignedTasks');
    this.props.bulkAssignmentTasks(tasks, user.username);
  }

  allowToSelect(task) {
    return task.status !== 'DONE';
  }

  render() {
    const { navigate } = this.props.navigation;
    const isEmpty = this.props.unassignedTasks.length === 0;

    const unassignedTasks = this.props.tasksFromHook?.sort(tasksSort)
    console.log('unassignedTasks', unassignedTasks)

    return (
      <View style={{ flex: 1 }}>
        <View>
          <AddButton
            testID="dispatchNewDelivery"
            onPress={() => this.props.navigation.navigate('DispatchNewDelivery')}>
            <Text style={{ fontWeight: '700' }}>
              {this.props.date.format('ll')}
            </Text>
          </AddButton>
        </View>
        <View style={{ flex: 1 }}>
          {isEmpty && <TapToRefresh onPress={this.props.refreshTasks} />}
          {!isEmpty && (
            <TaskList
              tasks={unassignedTasks}
              tasksWithColor={this.props.tasksWithColor}
              swipeOutLeftEnabled={task => !task.isAssigned}
              onSwipeLeft={task =>
                navigate('DispatchPickUser', {
                  onItemPress: user => this._assignTask(task, user),
                })
              }
              swipeOutLeftIconName="user"
              onTaskClick={task =>
                navigateToTask(
                  this.props.navigation,
                  this.props.route,
                  task,
                  this.props.unassignedTasks,
                )
              }
              allowMultipleSelection={task => this.allowToSelect(task)}
              multipleSelectionIcon="user"
              onMultipleSelectionAction={selectedTasks =>
                this.assignSelectedTasks(selectedTasks)
              }
            />
          )}
        </View>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    unassignedTasks: selectUnassignedTasksNotCancelled(state),
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
