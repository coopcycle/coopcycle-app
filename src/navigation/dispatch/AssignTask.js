import { Text } from 'native-base';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { View } from 'react-native';
import { connect } from 'react-redux';

import TaskList from '../../components/TaskList';
import { selectTasksWithColor } from '../../coopcycle-frontend-js/logistics/redux';
import { assignTask } from '../../redux/Dispatch/actions';
import { selectUnassignedTasksNotCancelled } from '../../redux/Dispatch/selectors';

class AssignTask extends Component {
  render() {
    const { username } = this.props.route.params;
    const isEmpty = this.props.unassignedTasks.length === 0;

    let contentProps = {};
    if (isEmpty) {
      contentProps = {
        flex: 1,
        justifyContent: 'center',
      };
    }

    return (
      <View style={contentProps}>
        {isEmpty && (
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text note>{this.props.t('DISPATCH_NO_TASKS')}</Text>
          </View>
        )}
        {!isEmpty && (
          <TaskList
            tasks={this.props.unassignedTasks}
            tasksWithColor={this.props.tasksWithColor}
            onTaskClick={task => this.props.assignTask(task, username)}
          />
        )}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    unassignedTasks: selectUnassignedTasksNotCancelled(state),
    tasksWithColor: selectTasksWithColor(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    assignTask: (task, username) => dispatch(assignTask(task, username)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(AssignTask));
