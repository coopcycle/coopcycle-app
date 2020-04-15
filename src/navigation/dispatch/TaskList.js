import React, { Component } from 'react'
import { View } from 'react-native';
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { Text } from 'native-base'
import _ from 'lodash'

import TaskList from '../../components/TaskList'
import AddButton from './components/AddButton'
import { unassignTask } from '../../redux/Dispatch/actions'
import { selectTasksNotCancelled } from '../../redux/Dispatch/selectors'
import { navigateToTask } from '../../navigation'

class TaskListScreen extends Component {

  componentDidUpdate(prevProps) {
    if (this.props.taskLists !== prevProps.taskLists) {
      const { taskList } = this.props.navigation.state.params
      const thisTaskList = _.find(this.props.taskLists, aTaskList => aTaskList.username === taskList.username)
      if (thisTaskList) {
        this.props.navigation.setParams({ taskList: thisTaskList })
      }
    }
  }

  render() {

    const taskList = this.props.navigation.getParam('taskList')
    const { navigate } = this.props.navigation

    const tasks = selectTasksNotCancelled({ tasks: taskList.items })

    return (
      <View style={{ flex: 1 }}>
        <View>
          <AddButton
            onPress={ () => navigate('DispatchAssignTask', { username: taskList.username }) }>
            <Text>{ this.props.t('DISPATCH_ASSIGN_TASK') }</Text>
          </AddButton>
        </View>
        <View style={{ flex: 1 }}>
          <TaskList
            tasks={ tasks }
            onSwipeRight={ task => this.props.unassignTask(task) }
            swipeOutRightEnabled={ task => task.status !== 'DONE' }
            swipeOutRightIconName="close"
            onTaskClick={ task => navigateToTask(this.props.navigation, task, tasks) } />
        </View>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    taskLists: state.dispatch.taskLists,
  }
}

function mapDispatchToProps(dispatch) {

  return {
    unassignTask: task => dispatch(unassignTask(task)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(TaskListScreen))
