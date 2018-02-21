import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { Container, Content, Icon, Text, Thumbnail } from 'native-base'
import { connect } from 'react-redux'
import _ from 'lodash'
import moment from 'moment/min/moment-with-locales'

import TaskList from '../../components/TaskList'
import DateSelectHeader from '../../components/DateSelectHeader'
import { Settings } from '../../Settings'
import { whiteColor } from '../../styles/common'
import {changedTasks} from "../../store/actions"

moment.locale('fr')

const taskComparator = (taskA, taskB) => taskA['@id'] === taskB['@id']

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: whiteColor
  },
  wrapper: {
    paddingHorizontal: 15,
    backgroundColor: whiteColor
  },
  noTask: {
    paddingVertical: 30,
    textAlign: 'center'
  }
})

class TaskListPage extends Component {

  constructor(props) {
    super(props)

    this.state = {
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

  componentWillReceiveProps(nextProps) {
    const nextTasks = nextProps.tasks
    const { tasks } = this.props

    // Tasks have been added
    if (nextTasks.length > tasks.length) {
      const addedTasks = _.differenceWith(nextTasks, tasks, taskComparator)
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
      this.props.taskChanged(data.tasks)
    }
  }

  render() {

    const { tasks, selectedDate } = this.props
    const { addedTasks } = this.state
    const { navigate } = this.props.navigation
    const { client, geolocationTracker } = this.props.navigation.state.params

    return (
      <Container style={ styles.container }>
        <DateSelectHeader
          toPastDate={() => {}}
          toFutureDate={() => {}}
          selectedDate={ selectedDate }
        />
        <Content>
          <View style={ styles.wrapper }>
          {
            tasks.length > 0 &&
            <TaskList
              ref="taskList"
              tasks={ tasks }
              tasksToHighlight={ addedTasks }
              onTaskClick={ task => navigate('CourierTask', { client, task, geolocationTracker }) }
            />
          }
          {
            tasks.length === 0 &&
            <Text style={ styles.noTask }>Pas de tâches prévues aujourd'hui !</Text>
          }
          </View>
        </Content>
      </Container>
    )
  }
}

function mapStateToProps (state) {
  return {
    tasks: state.tasks,
    selectedDate: state.selectedDate
  }
}

function mapDispatchToProps (dispatch) {
  return {
    taskChanged: (tasks) => { dispatch(changedTasks(tasks))}
    // loadTasks: (client, selectedDate) => { dispatch(loadTasksRequest(client, selectedDate)) },
    // assignTask: (task) => { dispatch(assignTask(task)) },
    // unassignTask: (task) => { dispatch(unassignTask(task)) }
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(TaskListPage)