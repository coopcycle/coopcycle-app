import React, { Component } from 'react'
import TaskList from '../../components/TaskList'
import { Settings } from '../../Settings'
import _ from 'lodash'

const taskComparator = (taskA, taskB) => taskA['@id'] === taskB['@id']

class TaskListPage extends Component {

  constructor(props) {
    super(props)

    const { tasks } = this.props.navigation.state.params

    this.state = {
      tasks,
      addedTasks: []
    }
  }

  componentDidMount() {
    this.onMessageHandler = this.onWebSocketMessage.bind(this)
    Settings.addListener('websocket:message', this.onMessageHandler)
  }

  componentWillUnmount() {
    Settings.removeListener('websocket:message', this.onMessageHandler)
  }

  componentDidUpdate(prevProps, prevState) {
    const prevTasks = prevState.tasks
    const { tasks } = this.state

    // Tasks have been added
    if (tasks.length > prevTasks.length) {
      const addedTasks = _.differenceWith(tasks, prevTasks, taskComparator)
      const firstAddedTask = _.first(addedTasks)

      this.setState({ addedTasks })

      setTimeout(() => {
        this.refs.taskList.scrollToTask(firstAddedTask)
        this.refs.taskList.animate()
      }, 500)
    }

  }

  onWebSocketMessage (event) {
    let data = JSON.parse(event.data)
    if (data.type === 'tasks:changed') {
      this.setState({ tasks: data.tasks })
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

    const { tasks, addedTasks } = this.state
    const { navigate } = this.props.navigation
    const { client, geolocationTracker } = this.props.navigation.state.params

    return (
      <TaskList
        ref="taskList"
        tasks={ tasks }
        tasksToHighlight={ addedTasks }
        onTaskClick={ task => navigate('CourierTask', { client, task, geolocationTracker, onTaskChange: this.onTaskChange.bind(this) }) }
      />
    )
  }
}

module.exports = TaskListPage;