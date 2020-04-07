import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Dimensions, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Container, Footer, Text, Button, Icon } from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid'
import MapView from 'react-native-maps'
import { SwipeRow } from 'react-native-swipe-list-view'
import moment from 'moment'
import { withTranslation } from 'react-i18next'
import { phonecall } from 'react-native-communications'
import { showLocation } from 'react-native-map-link'
import _ from 'lodash'

import { greenColor, redColor } from '../../styles/common'
import { selectTasks } from '../../redux/Courier'
import {
  doneIconName,
  failedIconName,
} from './styles/common'
import TaskMarker from '../../components/TaskMarker'

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

  _complete(success = true) {
    const params = {
      task: this.props.navigation.getParam('task'),
      navigateAfter: this.props.navigation.getParam('navigateAfter'),
      success
    }
    this.props.navigation.navigate('TaskComplete', params)
    setTimeout(() => this.swipeRow.current.closeRow(), 250)
  }

  renderTaskDetails() {

    const task = this.props.navigation.getParam('task')

    const timeframe = moment(task.doneAfter).format('LT') + ' - ' + moment(task.doneBefore).format('LT')
    let address = task.address.name ? [ task.address.name, task.address.streetAddress ].join(' - ') : task.address.streetAddress
    const name = [ task.address.firstName, task.address.lastName ].filter(function (item) {return item}).join(' ')
    address = name ? [ name, address ].join(' - ') : address

    const items = [
      {
        iconName: 'md-navigate',
        text: address,
        onPress: () => showLocation({
          latitude: task.address.geo.latitude,
          longitude: task.address.geo.longitude,
          dialogTitle: this.props.t('OPEN_IN_MAPS_TITLE'),
          dialogMessage: this.props.t('OPEN_IN_MAPS_MESSAGE'),
          cancelText: this.props.t('CANCEL'),
        }),
      },
      {
        iconName: 'md-clock',
        text: timeframe,
      },
    ]

    if (task.comments) {
      items.push({
        iconName: 'chatbubbles',
        text: task.comments,
      })
    }

    if (task.address.description || task.address.floor) {
      const floor = task.address.floor ? [ this.props.t('FLOOR'), task.address.floor ].join(' : ') : null
      const description = [ floor, task.address.description ].filter(function (item) {return item}).join(' - ')

      items.push({
        iconName: 'information-circle',
        text: description,
      })
    }

    if (task.tags.length > 0) {
      items.push({
        iconName: 'star',
        component: (
          <View style={{ flex: 1, flexDirection: 'row' }}>
          { task.tags.map(tag => (
            <Button style={{ backgroundColor: tag.color, marginRight: 5 }} key={ tag.slug } small disabled>
              <Text style={{ fontSize: 10 }}>{ tag.slug }</Text>
            </Button>
          )) }
          </View>
        ),
      })
    }

    if (task.address.telephone) {
      items.push({
        iconName: 'call',
        text: task.address.telephone,
        onPress: () => phonecall(task.address.telephone, true),
      })
    }

    return (
      <FlatList
        data={ items }
        keyExtractor={ (item, index) => item.iconName }
        renderItem={ ({ item }) => this.renderTaskDetail(item) }
        ItemSeparatorComponent={ () => (
          <View
            style={{
              height: StyleSheet.hairlineWidth,
              backgroundColor: '#ccc',
            }}
          />
        )} />
    )
  }

  renderTaskDetail(item) {

    const { iconName, text, component, onPress } = item

    let touchableOpacityProps = {}
    if (onPress) {
      touchableOpacityProps = { onPress }
    }

    const body = (
      <Col size={ onPress ? 7 : 8 }>
        { text ? (<Text style={ styles.taskDetailText }>{ text }</Text>) : null }
        { component && component }
      </Col>
    )

    return (
      <TouchableOpacity style={{ flex:  1 }} { ...touchableOpacityProps }>
        <Row style={ styles.row }>
          <Col size={ 2 } style={ styles.iconContainer }>
            <Icon name={ iconName } style={{ color: '#ccc' }} />
          </Col>
          { body }
          { onPress &&
          <Col size={ 1 }>
            <Icon name="arrow-forward" style={{ color: '#ccc' }} />
          </Col> }
        </Row>
      </TouchableOpacity>
    )
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

    // @see https://stackoverflow.com/questions/46568465/convert-a-region-latitudedelta-longitudedelta-into-an-approximate-zoomlevel/
    const zoomLevel = 15
    const distanceDelta = Math.exp(Math.log(360) - (zoomLevel * Math.LN2))

    let aspectRatio = 1
    if (mapDimensions.length > 0) {
      const [ width, height ] = mapDimensions
      aspectRatio = width / height
    }

    const region  = {
      latitude: task.address.geo.latitude,
      longitude: task.address.geo.longitude,
      latitudeDelta: distanceDelta,
      longitudeDelta: distanceDelta * aspectRatio,
    }

    return (
      <MapView
        style={ styles.map }
        zoomEnabled
        showsUserLocation
        loadingEnabled
        loadingIndicatorColor={ '#666666' }
        loadingBackgroundColor={ '#eeeeee' }
        initialRegion={ region }
        region={ region }
        onLayout={ this._onMapLayout.bind(this) }>
        <MapView.Marker
          identifier={ task['@id'] }
          key={ task['@id'] }
          coordinate={ task.address.geo }
          flat={ true }>
          <TaskMarker task={ task } />
        </MapView.Marker>
      </MapView>
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
                  { this.renderTaskDetails() }
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
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  row: {
    padding: 10,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
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
  taskDetailText: {
    fontSize: 12,
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

module.exports = connect(mapStateToProps)(withTranslation()(Task))
