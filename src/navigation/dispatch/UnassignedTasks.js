import React, { Component } from 'react';
import { InteractionManager, View } from 'react-native';
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { Fab, Icon, Text } from 'native-base';
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import TaskList from '../../components/TaskList'
import TapToRefresh from '../../components/TapToRefresh'
import AddButton from './components/AddButton'
import { assignTask, bulkAssignmentTasks, initialize, loadUnassignedTasks } from '../../redux/Dispatch/actions'
import { selectUnassignedTasksNotCancelled } from '../../redux/Dispatch/selectors'
import { selectSelectedDate, selectTasksWithColor } from '../../coopcycle-frontend-js/logistics/redux'

import { navigateToTask } from '../../navigation/utils'
import { greenColor } from '../../styles/common';

class UnassignedTasks extends Component {

  constructor(props) {
    super(props)

    this.state = {
      selectedTasks: [],
    }
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.initialize()
    })
  }

  _assignTask(task, user) {
    this.props.navigation.navigate('DispatchUnassignedTasks')
    this.props.assignTask(task, user.username)
  }

  _toggleTaskSelection(task, isSelected) {
    if (isSelected) {
      this.setState({
        selectedTasks: [ ...this.state.selectedTasks, task ],
      })
    } else {
      this.setState({
        selectedTasks: this.state.selectedTasks.filter((t) => t.id !== task.id),
      })
    }
  }

  assignSelectedTasks() {
    this.props.navigation.navigate('DispatchPickUser',
      { onItemPress: user => this._bulkAssign(user) })
  }

  _bulkAssign(user) {
    this.props.navigation.navigate('DispatchUnassignedTasks')
    this.props.bulkAssignmentTasks(this.state.selectedTasks, user.username)
      .then(() => {
        this.setState({ selectedTasks: [] })
      })
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
              onTaskClick={ task => navigateToTask(this.props.navigation, this.props.route, task, this.props.unassignedTasks) }
              allowTaskSelection={ true }
              toggleTaskSelection={ (task, isSelected) =>  this._toggleTaskSelection(task, isSelected) } />
          ) }
          {
            this.state.selectedTasks.length ?
            <Fab renderInPortal={false} shadow={2} size="sm" backgroundColor={ greenColor }
              icon={<Icon color="white" as={FontAwesome} name="user" size="sm" paddingLeft={1}
              onPress={ () => this.assignSelectedTasks() } />} /> : null
          }
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
    bulkAssignmentTasks: (tasks, username) => dispatch(bulkAssignmentTasks(tasks, username)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(UnassignedTasks))
