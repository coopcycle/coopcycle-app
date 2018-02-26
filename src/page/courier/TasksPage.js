import React, { Component } from 'react'
import { StyleSheet, View, ActivityIndicator, Alert, TouchableOpacity } from 'react-native'
import {
  Container,
  Content, Button, Icon, List, ListItem, Text, Title,
  Card, CardItem, Thumbnail,
  Header, Left, Right
} from 'native-base'
import moment from 'moment/min/moment-with-locales'
import MapView from 'react-native-maps'
import { NavigationActions } from 'react-navigation'
import KeepAwake from 'react-native-keep-awake'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'

import { greenColor, blueColor, redColor, greyColor, whiteColor, dateSelectHeaderHeight } from "../../styles/common"
import GeolocationTracker from '../../GeolocationTracker'
import { Settings } from '../../Settings'
import { Registry } from '../../Registry'
import DateSelectHeader from "../../components/DateSelectHeader"
import {assignTask, loadTasksRequest, unassignTask} from "../../store/actions"
import AppConfig from '../../AppConfig'

moment.locale(AppConfig.LOCALE)


class TasksPage extends Component {

  map = null
  markers = []

  geolocationTracker = null

  static navigationOptions = ({navigation}) => {
    const {params} = navigation.state
    return {
      headerRight: (
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'flex-end'}}>
          <Button transparent>
            <Icon name="wifi" style={{color: params.connected ? greenColor : greyColor}}/>
          </Button>
          <Button transparent>
            <Icon name="navigate" style={{color: params.tracking ? greenColor : greyColor}}/>
          </Button>
        </View>
      ),
    }
  }

  constructor(props) {
    super(props)

    this.geolocationTracker = new GeolocationTracker({
      onChange: this.onGeolocationChange.bind(this)
    })

    this.state = {
      task: null,
      loading: false,
      loadingMessage: 'Chargement…',
      currentPosition: null,
      polyline: [],
      detailsModal: false
    }

    this.onMapReady = this.onMapReady.bind(this)
    this.refreshTasks = this.refreshTasks.bind(this)
  }

  componentDidMount() {
    KeepAwake.activate()

    this.onConnectHandler = this.onWebSocketConnect.bind(this)
    this.onDisconnectHandler = this.onWebSocketDisconnect.bind(this)
    this.onReconnectHandler = this.onWebSocketReconnect.bind(this)
    this.onMessageHandler = this.onWebSocketMessage.bind(this)

    Settings.addListener('websocket:connect', this.onConnectHandler)
    Settings.addListener('websocket:disconnect', this.onDisconnectHandler)
    Settings.addListener('websocket:reconnect', this.onReconnectHandler)
    Settings.addListener('websocket:message', this.onMessageHandler)

    const ws = Registry.getWebSocketClient()
    if (ws.isOpen()) {
      this.props.navigation.setParams({connected: true})
    }
  }

  componentWillUnmount() {
    Settings.removeListener('websocket:connect', this.onConnectHandler)
    Settings.removeListener('websocket:disconnect', this.onDisconnectHandler)
    Settings.removeListener('websocket:reconnect', this.onReconnectHandler)
    Settings.removeListener('websocket:message', this.onMessageHandler)
    this.geolocationTracker.stop()
    KeepAwake.deactivate()
  }

  componentDidUpdate(prevProps, prevState) {
    const { tasksLoadingError, navigation } = this.props

    if (tasksLoadingError && !prevProps.tasksLoadingError) {
      Alert.alert(
        'Impossible de charger les tâches',
        'Veuillez réessayer plus tard',
        [
          {
            text: 'OK', onPress: () => {
              navigation.dispatch(NavigationActions.back())
            }
          },
        ],
        { cancelable: false }
      )
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.tasks !== this.props.tasks) {

        const { currentPosition } = this.state

        const coordinates = nextProps.tasks.map(task => {
          const { latitude, longitude } = task.address.geo
          return {
            latitude,
            longitude
          }
        })
        coordinates.push(currentPosition)

        this.map.fitToCoordinates(coordinates, {
          edgePadding: {
            top: 100,
            left: 100,
            bottom: 100,
            right: 100
          },
          animated: true
        })
    }
  }

  center() {
    const { currentPosition } = this.state
    this.map.animateToCoordinate(currentPosition, 500)
  }

  connect() {

    this.setState({ loading: true, loadingMessage: 'En attente de la position…' })

    Promise.all([
      this.geolocationTracker.start()
    ]).then(() => {
      const { selectedDate } = this.props
      this.setState({ loading: false })
      this.refreshTasks(selectedDate)
    }).catch(e => {
      // TODO Distinguish error reason
      Alert.alert(
        this.props.t('PROBLEM_CONNECTION'),
        this.props.t('TRY_LATER'),
        [
          {
            text: this.props.t('OK'), onPress: () => {
              this.props.navigation.dispatch(NavigationActions.back())
            }
          },
        ],
        { cancelable: false }
      )
    })
  }

  onWebSocketConnect() {
    this.props.navigation.setParams({ connected: true })
  }

  onWebSocketDisconnect() {
    this.props.navigation.setParams({ connected: false })
    this.setState({
      loading: true,
      loadingMessage: this.props.t('CONN_LOST'),
    })
  }

  onWebSocketReconnect() {
    this.props.navigation.setParams({ connected: true })
    this.setState({
      loading: false
    })
  }

  onWebSocketMessage (event) {
    let data = JSON.parse(event.data)

    if (data.type === 'task:unassign') {
      this.props.unassignTask(data.task)
    } else if (data.type === 'task:assign') {
      this.props.assignTask(data.task)
    }
  }

  onGeolocationChange(position) {
    const ws = Registry.getWebSocketClient()
    this.props.navigation.setParams({ tracking: true })
    this.setState({ currentPosition: position.coords })

    if (ws.isOpen()) {
      ws.send({
        type: 'position',
        data: position.coords
      })
    }
  }

  refreshTasks (selectedDate) {
    const { client } = this.props.navigation.state.params
    this.props.loadTasks(client, selectedDate)

  }

  onMapReady () {
    this.connect()
  }

  renderLoader() {

    const { taskLoadingMessage } = this.props
    const { loading, loadingMessage } = this.state

    if (taskLoadingMessage || loading) {
      return (
        <View style={ styles.loader }>
          <ActivityIndicator
            animating={ true }
            size="large"
            color="#fff"
          />
          <Text style={{ color: '#fff' }}>{ taskLoadingMessage || loadingMessage }</Text>
        </View>
      )
    }

    return (
      <View />
    )
  }

  render() {

    const { tasks, selectedDate } = this.props
    const { navigate } = this.props.navigation
    const { client } = this.props.navigation.state.params
    const geolocationTracker = this.geolocationTracker

    this.markers = this.markers.slice()

    const pinColor = task => {

      let pinColor = blueColor

      if (task.status === 'DONE') {
        pinColor = greenColor
      }

      if (task.status === 'FAILED') {
        pinColor = redColor
      }

      return pinColor
    }

    const navigationParams = {
      client,
      geolocationTracker
    }

    return (
      <Container>
        <DateSelectHeader
          buttonsEnabled={true}
          toDate={this.refreshTasks}
          selectedDate={selectedDate}
        />
        <View style={ styles.container }>
          <MapView
            ref={ component => this.map = component }
            style={styles.map}
            zoomEnabled={true}
            zoomControlEnabled={true}
            showsUserLocation
            loadingEnabled
            loadingIndicatorColor={"#666666"}
            loadingBackgroundColor={"#eeeeee"}
            onMapReady={() => this.onMapReady()}>
            { tasks.map(task => (
              <MapView.Marker
                ref={ component => this.markers.push(component) }
                identifier={ task['@id'] }
                key={ task['@id'] }
                coordinate={ task.address.geo }
                pinColor={ pinColor(task) }
                flat={ true }>
                <MapView.Callout onPress={ () => navigate('CourierTask', { ...navigationParams, task }) }>
                  { task.address.name && (<Text style={styles.mapCalloutText}>{ task.address.name }</Text>) }
                  <Text style={styles.mapCalloutText}>{ task.address.streetAddress }</Text>
                </MapView.Callout>
              </MapView.Marker>
            ))}
          </MapView>
          <View style={ styles.taskListButton }>
            <Button block onPress={ () => navigate('CourierTaskList', { ...navigationParams, tasks }) }>
              <Icon name="list" />
              <Text>{this.props.t('TASK_LIST')}</Text>
            </Button>
          </View>
          <View style={ styles.locateButton }>
            <TouchableOpacity
              onPress={ () => this.center() }
              style={ styles.circle }>
              <Icon name="locate" />
            </TouchableOpacity>
          </View>
        </View>
        { this.renderLoader() }
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    top: dateSelectHeaderHeight
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.4)',
    zIndex: 20
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapCalloutText: {
    fontSize: 14
  },
  modal: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: whiteColor
  },
  taskListButton: {
    paddingHorizontal: 15,
    paddingTop: 0,
    paddingBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 2,
    right: 0,
    left: 0,
    bottom: 0
  },
  locateButton: {
    position: 'absolute',
    zIndex: 2,
    top: 0,
    right: 0,
  },
  circle: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginRight: 20,
    marginTop: 20,
  },
})

function mapStateToProps (state) {
  return {
    tasks: state.tasks,
    selectedDate: state.selectedDate,
    taskLoadingMessage: state.taskLoadingMessage,
    tasksLoadingError: state.tasksLoadingError
  }
}

function mapDispatchToProps (dispatch) {
  return {
    loadTasks: (client, selectedDate) => { dispatch(loadTasksRequest(client, selectedDate)) },
    assignTask: (task) => { dispatch(assignTask(task)) },
    unassignTask: (task) => { dispatch(unassignTask(task)) }
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(translate()(TasksPage))
