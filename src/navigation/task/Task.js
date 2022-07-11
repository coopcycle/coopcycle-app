import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Alert, StyleSheet, View } from 'react-native'
import { Text } from 'native-base'
import { withTranslation } from 'react-i18next'
import _ from 'lodash'

import { selectTasks, startTask } from '../../redux/Courier'
import { selectAllTasks as selectAllDispatchTasks } from '../../coopcycle-frontend-js/logistics/redux'

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
    this.unsubscribeFromFocusListener = this.props.navigation.addListener(
      'focus',
      () => this.setState({ canRenderMap: true })
    )
  }

  componentWillUnmount() {
    this.unsubscribeFromFocusListener()
  }

  componentDidUpdate(prevProps, prevState) {

    const task = this.props.route.params?.task

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

    const task = this.props.route.params?.task

    if (success && task.status === 'TODO' && !force) {
      Alert.alert(
        this.props.t('TASK_COMPLETE_ALERT_TITLE'),
        this.props.t('TASK_COMPLETE_ALERT_MESSAGE'),
        [
          {
            text: this.props.t('CANCEL'),
            style: 'cancel',
            onPress: () => this.swipeRow.current?.closeRow(),
          },
          {
            text: this.props.t('TASK_COMPLETE_ALERT_NEGATIVE'),
            onPress: () => {
              this.props.startTask(task)
              setTimeout(() => this.swipeRow.current?.closeRow(), 250)
            },
          },
          {
            text: this.props.t('TASK_COMPLETE_ALERT_POSITIVE'),
            onPress: () => this._complete(true, true),
          },
        ]
      )
      return
    }

    this.props.navigation.navigate('TaskComplete', {
      screen: 'TaskCompleteHome',
      params: {
        task,
        navigateAfter: this.props.route.params?.navigateAfter,
        success,
      },
    })
    setTimeout(() => this.swipeRow.current.closeRow(), 250)
  }

  renderMap() {

    if (!this.state.canRenderMap) {

      return (
        <View style={ [ styles.map, { backgroundColor: '#eeeeee' }] } />
      )
    }

    const task = this.props.route.params?.task
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

    const task = this.props.route.params?.task
    const tasks = this.props.route.params?.tasks || []

    return (
      <View style={{ flex: 1 }}>
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
      </View>
    )
  }
}

const styles = StyleSheet.create({
  offlineNotice: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: '#f8d7da',
  },
  offlineNoticeText: {
    color: '#721c24',
  },
})

function mapStateToProps (state) {

  let allTasks = []

  const courierTasks = _.values(selectTasks(state))
  allTasks = allTasks.concat(courierTasks)
  allTasks = allTasks.concat(selectAllDispatchTasks(state))

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

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Task))
