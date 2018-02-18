import React, { Component } from 'react'
import { Container, Content } from 'native-base'
import TaskList from '../../components/TaskList'
import { Settings } from '../../Settings'
import _ from 'lodash'

class TaskListPage extends Component {

  constructor(props) {
    super(props)

    const { tasks } = this.props.navigation.state.params

    this.state = {
      tasks
    }
  }

  componentDidMount() {
    this.onMessageHandler = this.onWebSocketMessage.bind(this)
    Settings.addListener('websocket:message', this.onMessageHandler)
  }

  componentWillUnmount() {
    Settings.removeListener('websocket:message', this.onMessageHandler)
  }

  onWebSocketMessage (event) {
    let data = JSON.parse(event.data),
      { tasks } = this.state,
      newTasks = tasks.slice()

    if (data.type === 'task:unassign') {
      _.remove(newTasks, (task) => data.task['@id'] === task['@id'])
      this.setState({ tasks: newTasks })
    } else if (data.type === 'task:assign') {
      let position = data.task.position
      newTasks = Array.prototype.concat(newTasks.slice(0, position), [data.task], newTasks.slice(position + 1))
      this.setState({ tasks: newTasks })
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