import React, { Component } from 'react'
import { StyleSheet, View, ActivityIndicator } from 'react-native'
import { Container, Content, Icon, Text, Thumbnail } from 'native-base'
import { connect } from 'react-redux'
import _ from 'lodash'
import moment from 'moment/min/moment-with-locales'

import TaskList from '../../components/TaskList'
import DateSelectHeader from '../../components/DateSelectHeader'
import { whiteColor } from '../../styles/common'
import { translate } from 'react-i18next'
import { localeDetector } from '../../i18n'
import {
  loadTasks, markTaskDone, markTaskFailed,
  selectTasksList, selectTaskSelectedDate, selectIsTasksLoading,
} from '../../redux/Courier'

moment.locale(localeDetector())

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
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.4)',
    zIndex: 20
  }
})

class TaskListPage extends Component {

  taskList = null

  constructor(props) {
    super(props)

    this.state = {
      addedTasks: [],
    }

    this.refreshTasks = this.refreshTasks.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    const nextTasks = nextProps.tasks
    const { tasks } = this.props


    if (nextTasks !== tasks) {
      // Tasks have been added
      if (nextTasks.length > tasks.length) {
        const addedTasks = _.differenceWith(nextTasks, tasks, taskComparator)
        const firstAddedTask = _.first(addedTasks)

        this.setState({ addedTasks })

        setTimeout(() => {
          this.taskList.getWrappedInstance().scrollToTask(firstAddedTask)
          this.taskList.getWrappedInstance().animate()
        }, 500)
      }
    }

  }

  refreshTasks (selectedDate) {
    const { client } = this.props.navigation.state.params
    this.props.loadTasks(client, selectedDate)
  }

  renderLoader() {

    const { isLoadingTasks } = this.props

    if (isLoadingTasks) {
      return (
        <View style={ styles.loader }>
          <ActivityIndicator
            animating={ true }
            size="large"
            color="#fff"
          />
          <Text style={{ color: '#fff' }}>{this.props.t('LOADING')}</Text>
        </View>
      )
    }

    return (
      <View />
    )
  }

  render() {

    const { tasks, selectedDate } = this.props
    const { addedTasks } = this.state
    const { navigate } = this.props.navigation
    const { client, geolocationTracker } = this.props.navigation.state.params

    return (
      <Container style={ styles.container }>
        <DateSelectHeader
          buttonsEnabled={true}
          toDate={this.refreshTasks}
          selectedDate={selectedDate}
        />
        <Content>
          <View style={ styles.wrapper }>
          {
            tasks.length > 0 &&
            <TaskList
              ref={ (e) => {this.taskList = e} }
              tasks={ tasks }
              tasksToHighlight={ addedTasks }
              onTaskClick={ task => navigate('CourierTask', { client, task, geolocationTracker }) }
            />
          }
          {
            tasks.length === 0 &&
            <Text style={ styles.noTask }>{`${this.props.t('NO_TASKS')} !`}</Text>
          }
          </View>
        </Content>
        { this.renderLoader() }
      </Container>
    )
  }
}

function mapStateToProps (state) {
  return {
    tasks: selectTasksList(state),
    selectedDate: selectTaskSelectedDate(state),
    isLoadingTasks: selectIsTasksLoading(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    loadTasks: (client, selectedDate) => dispatch(loadTasks(client, selectedDate)),
    markTaskFailed: (client, task, notes) => dispatch(markTaskFailed(client, task, notes)),
    markTaskDone: (client, task, notes) => dispatch(markTaskDone(client, task, notes))
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(translate()(TaskListPage))
