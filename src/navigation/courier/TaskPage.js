import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Dimensions, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Container, Content, Footer, Text, Button, Icon, Header, Title, Left, Body, Right } from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid'
import MapView from 'react-native-maps'
import Swipeout from 'react-native-swipeout'
import moment from 'moment/min/moment-with-locales'
import { translate } from 'react-i18next'
import { localeDetector } from '../../i18n'
import { phonecall } from 'react-native-communications'
import { showLocation } from 'react-native-map-link'
import _ from 'lodash'

import { greenColor, greyColor, redColor } from "../../styles/common"
import { selectTasksList } from "../../redux/Courier"

moment.locale(localeDetector())

const isCompleted = task => task.status !== 'TODO'

class TaskPage extends Component {

  map = null

  constructor(props) {
    super(props)

    this.state = {
      swipeOutClose: false,
    }
  }

  componentDidUpdate(prevProps, prevState) {

    const { task } = this.props.navigation.state.params
    const { task: prevTask } = prevProps.navigation.state.params

    // We are navigating through linked tasks
    if (task['@id'] !== prevTask['@id']) {
      this.fitToCoordinates()
    } else { // Task status has been updated
      let previousTask = _.find(prevProps.tasks, t => t['@id'] === task['@id']),
        currentTask = _.find(this.props.tasks, t => t['@id'] === task['@id'])

      if (currentTask.status !== previousTask.status) {
        this.props.navigation.setParams({ task: currentTask })
      }
    }
  }

  fitToCoordinates() {
    const { geolocation, task } = this.props.navigation.state.params

    const coordinates = [
      geolocation,
      {
        latitude: task.address.geo.latitude,
        longitude: task.address.geo.longitude,
      }
    ]

    this.map.fitToCoordinates(_.filter(coordinates), {
      edgePadding: {
        top: 50,
        left: 50,
        bottom: 50,
        right: 50
      },
      animated: true
    })
  }

  onMapPress() {

    const { task } = this.props.navigation.state.params

    showLocation({
      latitude: task.address.geo.latitude,
      longitude: task.address.geo.longitude,
      dialogTitle: this.props.t('OPEN_IN_MAPS_TITLE'),
      dialogMessage: this.props.t('OPEN_IN_MAPS_MESSAGE'),
      cancelText: this.props.t('CANCEL'),
    })
  }

  renderTaskDetails() {

    const { navigate } = this.props.navigation
    const { task } = this.props.navigation.state.params

    const timeframe = moment(task.doneAfter).format('LT') + ' - ' + moment(task.doneBefore).format('LT')
    let address = task.address.name ? [ task.address.name, task.address.streetAddress ].join(' - ') : task.address.streetAddress
    const name = [ task.address.firstName, task.address.lastName ].filter(function (item) {return item}).join(' ')
    address = name ? [ name, address ].join(' - ') : address

    const items = [
      {
        iconName: 'md-navigate',
        text: address
      },
      {
        iconName: 'md-clock',
        text: timeframe
      }
    ]

    if (task.comments) {
      items.push({
        iconName: 'chatbubbles',
        text: task.comments
      })
    }

    if (task.address.description || task.address.floor) {
      const floor = task.address.floor ? [ this.props.t('FLOOR'), task.address.floor ].join(' : ') : null
      const description = [ floor, task.address.description ].filter(function (item) {return item}).join(' - ')

      items.push({
        iconName: 'information-circle',
        text: description
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
        )
      })
    }

    if (task.address.telephone) {
      items.push({
        iconName: 'call',
        text: task.address.telephone,
        onPress: () => phonecall(task.address.telephone, true)
      })
    }

    const events = _.sortBy(task.events, [ event => moment(event.createdAt) ])
    if (events.length > 0) {
      const lastEvent = _.last(events)
      items.push({
        iconName: 'calendar',
        text: this.props.t('LAST_TASK_EVENT', { fromNow: moment(lastEvent.createdAt).fromNow() }),
        onPress: () => navigate('CourierTaskHistory', { task })
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
              backgroundColor: "#ccc",
            }}
          />
        )} />
    )
  }

  pinColor(task) {
    let color = greyColor

    if (task.tags.length > 0) {
      color = task.tags[0].color
    }

    return color
  }

  renderTaskDetail(item) {

    const { iconName, text, component, onPress } = item

    let touchableOpacityProps = {}
    if (onPress) {
      touchableOpacityProps = { onPress }
    }

    const body = (
      <Col size={ onPress ? 7 : 8 }>
        { text && <Text style={ styles.taskDetailText }>{ text }</Text> }
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

  static renderSwipeoutLeftButton() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="checkmark" style={{ color: '#fff' }} />
      </View>
    )

  }

  static renderSwipeoutRightButton() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="warning" style={{ color: '#fff' }} />
      </View>
    )
  }

  renderSwipeOutButton() {

    const { width } = Dimensions.get('window')
    const { task } = this.props.navigation.state.params
    const { swipeOutClose } = this.state

    if (task.status === 'DONE') {
      return (
        <Footer>
          <View style={ [ styles.buttonContainer, { backgroundColor: greenColor } ] }>
            <View style={ styles.buttonTextContainer }>
              <Icon name="checkmark" style={{ color: '#fff', marginRight: 10 }} />
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
              <Icon name="warning" style={{ color: '#fff', marginRight: 10 }} />
              <Text style={{ color: '#fff' }}>{this.props.t('FAILED')}</Text>
            </View>
          </View>
        </Footer>
      )
    }

    const swipeoutLeftButton = {
      component: TaskPage.renderSwipeoutLeftButton(),
      backgroundColor: greenColor,
      onPress: () => {
        this.props.navigation.navigate('CourierTaskComplete', { task, markTaskDone: true })
        this.setState({
          swipeOutClose: true
        })
      }
    }

    const swipeoutRightButton = {
      component: TaskPage.renderSwipeoutRightButton(),
      backgroundColor: redColor,
      onPress: () => {
        this.props.navigation.navigate('CourierTaskComplete', { task, markTaskFailed: true })
        this.setState({
          swipeOutClose: true
        })
      }
    }

    return (
      <Swipeout buttonWidth={ width * 0.4 } left={[ swipeoutLeftButton ]} right={[ swipeoutRightButton ]} close={ swipeOutClose }>
        <View style={{ padding: 28, width }}>
          <Text style={{ fontSize: 20, textAlign: 'center', color: '#fff', fontFamily: 'Raleway-Regular' }}>{this.props.t('END')}</Text>
        </View>
      </Swipeout>
    )
  }

  render() {

    const { geolocation, task } = this.props.navigation.state.params
    const { navigate } = this.props.navigation

    const initialRegion  = {
      latitude: task.address.geo.latitude,
      longitude: task.address.geo.longitude,
      latitudeDelta: 0.0450,
      longitudeDelta: 0.0250,
    }

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
                <MapView
                  ref={ component => this.map = component }
                  style={ styles.map }
                  zoomEnabled
                  showsUserLocation
                  loadingEnabled
                  loadingIndicatorColor={"#666666"}
                  loadingBackgroundColor={"#eeeeee"}
                  initialRegion={ initialRegion }
                  onMapReady={() => this.fitToCoordinates()}
                  onPress={() => this.onMapPress()}>
                  <MapView.Marker
                    identifier={ task['@id'] }
                    key={ task['@id'] }
                    coordinate={ task.address.geo }
                    pinColor={ this.pinColor(task) }
                    flat={ true }>
                  </MapView.Marker>
                </MapView>
              </Row>
              <Row size={ 3 }>
                <Col>
                  { this.renderTaskDetails() }
                </Col>
              </Row>
            </Col>
          </Row>
          { hasLinkedTasks && <Row size={ 4 } style={ styles.swipeOutHelpContainer }>
            <Col>
              { hasPreviousTask && <Button transparent
                onPress={ () => navigate('CourierTask', { geolocation, task: previousTask }) }>
                <Icon name="arrow-back" />
                <Text>{ this.props.t('PREVIOUS_TASK') }</Text>
              </Button> }
            </Col>
            <Col>
              { hasNextTask && <Button transparent style={{ alignSelf: 'flex-end' }}
                onPress={ () => navigate('CourierTask', { geolocation, task: nextTask }) }>
                <Text>{ this.props.t('NEXT_TASK') }</Text>
                <Icon name="arrow-forward" />
              </Button> }
            </Col>
          </Row> }
          { !isCompleted(task) && <Row size={ 4 } style={ styles.swipeOutHelpContainer }>
            <View style={{ paddingVertical: 10, paddingHorizontal: 15 }}>
              <Text style={styles.swipeOutHelpText}>{`${this.props.t('SWIPE_TO_END')}.`}</Text>
            </View>
          </Row> }
        </Grid>
        { this.renderSwipeOutButton() }
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
    justifyContent: 'center'
  },
  iconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10
  },
  buttonContainer: {
    ...StyleSheet.absoluteFillObject
  },
  buttonTextContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
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
    color: '#ccc'
  },
  taskDetailText: {
    fontSize: 12,
  }
})

function mapStateToProps (state) {
  return {
    tasks: selectTasksList(state),
  }
}

module.exports = connect(mapStateToProps)(translate()(TaskPage))
