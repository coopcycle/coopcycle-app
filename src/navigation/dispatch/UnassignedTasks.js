import React, { Component } from 'react';
import { InteractionManager, View } from 'react-native';
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { Text } from 'native-base';

import TaskList from '../../components/TaskList'
import TapToRefresh from '../../components/TapToRefresh'
import AddButton from './components/AddButton'
import { assignTask, initialize, loadUnassignedTasks } from '../../redux/Dispatch/actions'
import { selectUnassignedTasksNotCancelled } from '../../redux/Dispatch/selectors'
import { selectSelectedDate, selectTasksWithColor } from '../../coopcycle-frontend-js/logistics/redux'

import { navigateToTask } from '../../navigation/utils'

class UnassignedTasks extends Component {

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.initialize()
    })
  }

  _assignTask(task, user) {
    this.props.navigation.navigate('DispatchUnassignedTasks')
    this.props.assignTask(task, user.username)
  }

  render() {

    const { navigate } = this.props.navigation
    const isEmpty = this.props.unassignedTasks.length === 0

    return (
      <View style={{ flex: 1 }}>
        <View>
          <AddButton testID="addTask"
            onPress={ () => this.props.navigation.navigate('DispatchAddTask') }>
            <Text style={{ fontWeight: '700' }}>{ this.props.date.format('ll') }</Text>
          </AddButton>
        </View>
        <View style={{ flex: 1 }}>
          { isEmpty && (
            <TapToRefresh onPress={ this.props.loadUnassignedTasks } />
          ) }
          { !isEmpty && (
            <TaskList
              tasks={ this.props.unassignedTasks }
              tasksWithColor={ this.props.tasksWithColor }
              swipeOutLeftEnabled={ task => !task.isAssigned }
              onSwipeLeft={ task => navigate('DispatchPickUser', { onItemPress: user => this._assignTask(task, user) }) }
              swipeOutLeftIconName="user"
              onTaskClick={ task => navigateToTask(this.props.navigation, this.props.route, task, this.props.unassignedTasks) } />
          ) }
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
  }
}

function mapDispatchToProps(dispatch) {
  return {
    assignTask: (task, username) => dispatch(assignTask(task, username)),
    initialize: () => dispatch(initialize()),
    loadUnassignedTasks: () => dispatch(loadUnassignedTasks()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(UnassignedTasks))
