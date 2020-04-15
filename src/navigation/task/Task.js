import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Alert, Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Container, Footer, Text, Button, Icon } from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid'
import { SwipeRow } from 'react-native-swipe-list-view'
import { withTranslation } from 'react-i18next'
import _ from 'lodash'

import { greenColor, redColor } from '../../styles/common'
import { selectTasks, startTask } from '../../redux/Courier'
import {
  doneIconName,
  failedIconName,
} from './styles/common'
import TaskDetails from './components/Details'
import TaskMiniMap from './components/MiniMap'

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
            style: 'cancel'
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

    const params = {
      task,
      navigateAfter: this.props.navigation.getParam('navigateAfter'),
      success
    }
    this.props.navigation.navigate('TaskComplete', params)
    setTimeout(() => this.swipeRow.current.closeRow(), 250)
  }

  renderSwipeoutLeftButton(width) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width }}>
        <Icon type="FontAwesome" name={ doneIconName } style={{ color: '#fff' }} />
      </View>
    )

  }

  renderSwipeoutRightButton(width) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width }}>
        <Icon type="FontAwesome" name={ failedIconName } style={{ color: '#fff' }} />
      </View>
    )
  }

  renderSwipeOutButton() {

    const { width } = Dimensions.get('window')
    const task = this.props.navigation.getParam('task')

    if (task.status === 'DONE') {
      return (
        <Footer>
          <View style={ [ styles.buttonContainer, { backgroundColor: greenColor } ] }>
            <View style={ styles.buttonTextContainer }>
              <Icon type="FontAwesome" name={ doneIconName } style={{ color: '#fff', marginRight: 10 }} />
              <Text style={{ color: '#fff' }}>{this.props.t('COMPLETED')}</Text>
            </View>
          </View>
        </Footer>
      )
    }

    if (task.status === 'FAILED') {
      return (
        <Footer>
          <View style={ [ styles.buttonContainer, { backgroundColor: redColor } ] }>
            <View style={ styles.buttonTextContainer }>
              <Icon type="FontAwesome" name={ failedIconName } style={{ color: '#fff', marginRight: 10 }} />
              <Text style={{ color: '#fff' }}>{this.props.t('FAILED')}</Text>
            </View>
          </View>
        </Footer>
      )
    }

    const buttonWidth = (width / 3)

    return (
      <View>
        <View style={{ paddingVertical: 10, paddingHorizontal: 15 }}>
          <Text style={styles.swipeOutHelpText}>{`${this.props.t('SWIPE_TO_END')}.`}</Text>
        </View>
        <SwipeRow
          leftOpenValue={ buttonWidth }
          stopLeftSwipe={ buttonWidth + 25 }
          rightOpenValue={ buttonWidth * -1 }
          stopRightSwipe={ (buttonWidth + 25) * -1 }
          ref={ this.swipeRow }>
          <View style={ styles.rowBack }>
            <TouchableOpacity
              testID="task:completeSuccessButton"
              style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center', backgroundColor: greenColor, width: buttonWidth }}
              onPress={ () => this._complete(true) }>
              { this.renderSwipeoutLeftButton(buttonWidth) }
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center', backgroundColor: redColor, width: buttonWidth }}
              onPress={ () => this._complete(false) }>
              { this.renderSwipeoutRightButton(buttonWidth) }
            </TouchableOpacity>
          </View>
          <View style={{ padding: 28, width, backgroundColor: '#dedede' }} testID="task:completeButton">
            <Text style={{ fontSize: 20, textAlign: 'center', color: '#fff', fontFamily: 'Raleway-Regular' }}>
              { this.props.t('COMPLETE_TASK') }
            </Text>
          </View>
        </SwipeRow>
      </View>
    )
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

    const { navigate, getParam } = this.props.navigation

    const task = getParam('task')
    const navigateAfter = getParam('navigateAfter')

    const hasLinkedTasks = (task.previous || task.next)
    const hasPreviousTask = Boolean(task.previous)
    const hasNextTask = Boolean(task.next)

    let previousTask
    if (hasPreviousTask) {
      previousTask = _.find(this.props.tasks, t => t['@id'] === task.previous)
    }

    let nextTask
    if (hasNextTask) {
      nextTask = _.find(this.props.tasks, t => t['@id'] === task.next)
    }

    return (
      <Container style={{ backgroundColor: '#fff' }}>
        <Grid>
          <Row size={ 8 }>
            <Col>
              <Row size={ 2 }>
                { this.renderMap() }
              </Row>
              <Row size={ 3 }>
                <Col>
                  <TaskDetails task={ task } />
                </Col>
              </Row>
            </Col>
          </Row>
          { hasLinkedTasks && (
          <Row size={ 4 } style={ styles.swipeOutHelpContainer }>
            <Col>
              { hasPreviousTask && <Button transparent
                onPress={ () => navigate('Task', { navigateAfter, task: previousTask }) }>
                <Icon name="arrow-back" />
                <Text>{ this.props.t('PREVIOUS_TASK') }</Text>
              </Button> }
            </Col>
            <Col>
              { hasNextTask && <Button transparent style={{ alignSelf: 'flex-end' }}
                onPress={ () => navigate('Task', { navigateAfter, task: nextTask }) }>
                <Text>{ this.props.t('NEXT_TASK') }</Text>
                <Icon name="arrow-forward" />
              </Button> }
            </Col>
          </Row>
          )}
        </Grid>
        { this.props.isInternetReachable && this.renderSwipeOutButton() }
        { !this.props.isInternetReachable && <OfflineNotice message={ this.props.t('OFFLINE') } /> }
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  buttonTextContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  swipeOutHelpContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopColor: '#ccc',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  swipeOutHelpText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#ccc',
  },
  rowBack: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
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
