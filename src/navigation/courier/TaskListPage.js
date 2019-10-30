import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { Container, Content, Button, Icon, Text, Thumbnail, CheckBox, Header, Left, Right, Grid, Row, Col, Body, Title } from 'native-base'

import { connect } from 'react-redux'
import _ from 'lodash'
import moment from 'moment'
import { NavigationActions } from 'react-navigation'

import TaskList from '../../components/TaskList'
import DateSelectHeader from '../../components/DateSelectHeader'
import { whiteColor, dateSelectHeaderHeight } from '../../styles/common'
import { withTranslation } from 'react-i18next'
import {
  loadTasks,
  selectTasksList,
  selectTaskSelectedDate,
  selectIsTasksLoading,
  selectFilteredTasks,
  selectTagNames,
} from '../../redux/Courier'

const taskComparator = (taskA, taskB) => taskA['@id'] === taskB['@id']

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: whiteColor,
    paddingTop: dateSelectHeaderHeight
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

    this.refreshTasks = this.refreshTasks.bind(this)
  }

  refreshTasks (selectedDate) {
    this.props.loadTasks(this.props.httpClient, selectedDate)
  }

  render() {

    const { tasks, selectedDate } = this.props
    const { navigate } = this.props.navigation

    return (
      <Container style={ styles.container }>
        <Content enableAutomaticScroll={ false }>
          {
            tasks.length > 0 &&
            <TaskList
              ref={ (e) => {this.taskList = e} }
              tasks={ tasks }
              onSwipeLeft={ task => navigate(
                'Task',
                { task },
                NavigationActions.navigate({ routeName: 'TaskComplete', params: { task, markTaskDone: true } })
              ) }
              onSwipeRight={ task => navigate(
                'Task',
                { task },
                NavigationActions.navigate({ routeName: 'TaskComplete', params: { task, markTaskFailed: true } })
              ) }
              swipeOutLeftEnabled={ task => task.status !== 'DONE' }
              swipeOutRightEnabled={ task => task.status !== 'DONE' }
              onTaskClick={ task => navigate('Task', { task }) }
            />
          }
          {
            tasks.length === 0 &&
            <Text style={ styles.noTask }>{`${this.props.t('NO_TASKS')} !`}</Text>
          }
        </Content>
        <DateSelectHeader
          buttonsEnabled={true}
          toDate={this.refreshTasks}
          selectedDate={selectedDate}/>
      </Container>
    )
  }
}

function mapStateToProps (state) {
  return {
    httpClient: state.app.httpClient,
    tasks: selectFilteredTasks(state),
    selectedDate: selectTaskSelectedDate(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    loadTasks: (client, selectedDate) => dispatch(loadTasks(client, selectedDate)),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(TaskListPage))
