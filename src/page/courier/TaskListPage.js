import React, { Component } from 'react'
import { Container, Content } from 'native-base'
import TaskList from '../../components/TaskList'
import _ from 'lodash'

class TaskListPage extends Component {

  constructor(props) {
    super(props)

    const { tasks } = this.props.navigation.state.params

    this.state = {
      tasks
    }
  }

  onTaskChange(newTask) {
    const { onTaskChange } = this.props.navigation.state.params
    const { tasks } = this.state
    const newTasks = tasks.slice()
    const taskIndex = _.findIndex(tasks, task => task['@id'] === newTask['@id'])
    newTasks[taskIndex] = newTask

    this.setState({ tasks: newTasks })
    onTaskChange(newTask)
  }

  render() {

    const { tasks } = this.state
    const { navigate } = this.props.navigation
    const { client, geolocationTracker } = this.props.navigation.state.params

    return (
      <Container>
        <Content>
          <TaskList
            tasks={ tasks }
            onTaskClick={ task => navigate('CourierTask', { client, task, geolocationTracker, onTaskChange: this.onTaskChange.bind(this) }) } />
        </Content>
      </Container>
    )
  }
}

module.exports = TaskListPage;