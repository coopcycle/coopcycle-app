import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Alert, SafeAreaView, StyleSheet, View } from 'react-native'
import { Container, Text } from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid'
import { withTranslation } from 'react-i18next'
import _ from 'lodash'

import { selectTasks, startTask } from '../../redux/Courier'

import TaskDetails from './components/Details'
import TaskMiniMap from './components/MiniMap'
import TaskNav from './components/Nav'
import TaskCompleteButton from './components/CompleteButton'

const OfflineNotice = ({ message }) => (
  <View>
    <View style={ styles.offlineNotice }>
      <Text style={ styles.offlineNoticeText }>{ message }</Text>
    </View>
  </View>
)

class Task extends Component {

  constructor(props) {
    super(props)

    this.state = {
      mapDimensions: [],
      canRenderMap: false,
    }
    this.swipeRow = React.createRef()
  }

  componentDidMount() {
    this.didFocusListener = this.props.navigation.addListener(
      'didFocus',
      payload => this.setState({ canRenderMap: true })
    )
  }

  componentWillUnmount() {
    this.didFocusListener.remove()
  }

  componentDidUpdate(prevProps, prevState) {

    const task = this.props.navigation.getParam('task')

    let previousTask = _.find(prevProps.tasks, t => t['@id'] === task['@id'])
    let currentTask = _.find(this.props.tasks, t => t['@id'] === task['@id'])

    // Task status has been updated
    if (currentTask && previousTask && currentTask.status !== previousTask.status) {
      this.props.navigation.setParams({ task: currentTask })
    }
  }

  _onMapLayout(e) {
    const { width, height } = e.nativeEvent.layout
    this.setState({ mapDimensions: [ width, height ] })
  }

  _complete(success = true, force = false) {

    const task = this.props.navigation.getParam('task')

    if (success && task.status === 'TODO' && !force) {
      Alert.alert(
        this.props.t('TASK_COMPLETE_ALERT_TITLE'),
        this.props.t('TASK_COMPLETE_ALERT_MESSAGE'),
        [
          {
            text: this.props.t('CANCEL'),
            style: 'cancel',
            onPress: () => this.swipeRow.current.closeRow()
          },
          {
            text: this.props.t('TASK_COMPLETE_ALERT_NEGATIVE'),
            onPress: () => {
              this.props.startTask(task)
              setTimeout(() => this.swipeRow.current.closeRow(), 250)
            },
          },
          {
            text: this.props.t('TASK_COMPLETE_ALERT_POSITIVE'),
            onPress: () => this._complete(true, true)
          },
        ]
      )
      return
    }

    this.props.navigation.navigate('TaskComplete', {
      task,
      navigateAfter: this.props.navigation.getParam('navigateAfter'),
      success
    })
    setTimeout(() => this.swipeRow.current.closeRow(), 250)
  }

  renderMap() {

    if (!this.state.canRenderMap) {

      return (
        <View style={ [ styles.map, { backgroundColor: '#eeeeee' } ] } />
      )
    }

    const task = this.props.navigation.getParam('task')
    const { mapDimensions } = this.state

    let aspectRatio = 1
    if (mapDimensions.length > 0) {
      const [ width, height ] = mapDimensions
      aspectRatio = width / height
    }

    return (
      <TaskMiniMap task={ task } onLayout={ this._onMapLayout.bind(this) } aspectRatio={ aspectRatio } />
    )
  }

  render() {

    const { getParam } = this.props.navigation

    const task = getParam('task')
    const tasks = getParam('tasks', [])

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <View style={{ height: '35%' }}>
            { this.renderMap() }
          </View>
          <View style={{ height: '55%' }}>
            <TaskDetails task={ task } />
          </View>
          <View style={{ height: '10%' }}>
            <TaskNav tasks={ tasks } task={ task } />
          </View>
        </View>
        { this.props.isInternetReachable && <TaskCompleteButton
          ref={ this.swipeRow }
          task={ task }
          onPressSuccess={ () => this._complete(true) }
          onPressFailure={ () => this._complete(false) } /> }
        { !this.props.isInternetReachable && <OfflineNotice message={ this.props.t('OFFLINE') } /> }
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  offlineNotice: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: '#f8d7da'
  },
  offlineNoticeText: {
    color: '#721c24'
  }
})

function mapStateToProps (state) {

  let allTasks = []

  const courierTasks = _.values(selectTasks(state))
  allTasks = allTasks.concat(courierTasks)

  let assignedTasks = []
  _.forEach(state.dispatch.taskLists, (taskList) => {
    assignedTasks = assignedTasks.concat(taskList.items)
  })

  allTasks = allTasks.concat(assignedTasks)
  allTasks = allTasks.concat(state.dispatch.unassignedTasks)

  return {
    tasks: _.uniqBy(allTasks, '@id'),
    isInternetReachable: state.app.isInternetReachable,
  }
}

function mapDispatchToProps(dispatch) {

  return {
    startTask: (task) => dispatch(startTask(task)),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Task))
