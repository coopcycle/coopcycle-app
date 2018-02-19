import React, { Component } from 'react'
import { StyleSheet, View, ActivityIndicator, Alert } from 'react-native'
import {
  Container,
  Content, Button, Icon, List, ListItem, Text, Title,
  Card, CardItem, Thumbnail,
  Header, Left, Right
} from 'native-base'
import _ from 'lodash'
import moment from 'moment/min/moment-with-locales'
import MapView from 'react-native-maps'
import { NavigationActions } from 'react-navigation'
import KeepAwake from 'react-native-keep-awake'

import { greenColor, blueColor, redColor, greyColor, lightGreyColor, whiteColor, dateSelectHeaderHeight } from "../../styles/common"
import GeolocationTracker from '../../GeolocationTracker'
import { Settings } from '../../Settings'
import { Registry } from '../../Registry'
import DateSelectHeader from "../../components/DateSelectHeader"

moment.locale('fr')


class TasksPage extends Component {

  map = null
  markers = []

  geolocationTracker = null

  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state
    return {
      headerRight: (
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end' }}>
          <Button transparent>
            <Icon name="wifi" style={{ color: params.connected ? greenColor : greyColor }} />
          </Button>
          <Button transparent>
            <Icon name="navigate" style={{ color: params.tracking ? greenColor : greyColor }} />
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
      tasks: [],
      task: null,
      loading: false,
      loadingMessage: 'Chargement…',
      currentPosition: null,
      polyline: [],
      detailsModal: false,
      selectedDate: moment()
    }

    this.onMapReady = this.onMapReady.bind(this)
    this.toPast = this.toPast.bind(this)
    this.toFuture = this.toFuture.bind(this)
    this.toDate = this.toDate.bind(this)
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.selectedDate !== prevState.selectedDate) {
      this.refreshTasks()
    }
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
      this.props.navigation.setParams({ connected: true })
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

  connect() {

    // this.setState({ loading: true, loadingMessage: 'Connexion…' })

    Promise.all([
      this.geolocationTracker.start()
    ]).then(() => {
      this.refreshTasks()
    }).catch(e => {
      // TODO Distinguish error reason
      console.log(e)
      Alert.alert(
        'Connexion impossible',
        'Veuillez réessayer plus tard',
        [
          {
            text: 'OK', onPress: () => {
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
      loadingMessage: 'Connexion perdue, reconnexion…'
    })
  }

  onWebSocketReconnect() {
    this.props.navigation.setParams({ connected: true })
    this.setState({
      loading: false
    })
  }

  onWebSocketMessage (event) {
    let data = JSON.parse(event.data),
      { tasks } = this.state,
      newTasks = tasks.slice()

    if (data.type === 'task:unassign') {
      _.remove(newTasks, (task) => data.task['@id'] === task['@id'])
      this.setState({ tasks: newTasks })
    } else if (data.type === 'task:assign') {
      let position = data.task.position
      newTasks = Array.prototype.concat(newTasks.slice(0, position), [data.task], newTasks.slice(position + 1))
      this.setState({ tasks: newTasks })
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

  onTaskChange(newTask) {
    const { tasks } = this.state,
      newTasks = tasks.slice(),
      taskIndex = _.findIndex(tasks, task => task['@id'] === newTask['@id'])
    newTasks[taskIndex] = newTask

    this.setState({ tasks: newTasks })
  }

  refreshTasks() {

  const { client } = this.props.navigation.state.params
  let { selectedDate } = this.state

  this.setState({ loading: true, loadingMessage: 'Chargement…' })

  client.get('/api/me/tasks/' + selectedDate.format('YYYY-MM-DD'))
    .then(data => {

      const tasks = data['hydra:member']

      this.setState({
        loading: false,
        tasks,
      })

      const { currentPosition } = this.state

      const coordinates = tasks.map(task => {
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

    })
  }

  onMapReady () {
    this.connect()
  }

  toPast () {
    let { selectedDate } = this.state,
        newSelectedDate = selectedDate.clone().subtract(1, 'days')
    this.setState({selectedDate: newSelectedDate})
  }

  toFuture () {
    let { selectedDate } = this.state,
      newSelectedDate = selectedDate.clone().add(1, 'days')
    this.setState({selectedDate: newSelectedDate})
  }

  toDate (date) {
    this.setState({selectedDate: date})
  }

  renderLoader() {

    const { loading, loadingMessage } = this.state

    if (loading) {
      return (
        <View style={ styles.loader }>
          <ActivityIndicator
            animating={ true }
            size="large"
            color="#fff"
          />
          <Text style={{ color: '#fff' }}>{ loadingMessage }</Text>
        </View>
      );
    }

    return (
      <View />
    )
  }

  render() {

    const { tasks, selectedDate } = this.state
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
      geolocationTracker,
      onTaskChange: this.onTaskChange.bind(this)
    }

    return (
      <Container>
        <DateSelectHeader
          toPastDate={this.toPast}
          toFutureDate={this.toFuture}
          toDate={this.toDate}
          selectedDate={selectedDate}
        />
        <MapView
          ref={ component => this.map = component }
          style={ styles.map }
          zoomEnabled={ true }
          zoomControlEnabled={ true }
          showsUserLocation
          loadingEnabled
          loadingIndicatorColor={"#666666"}
          loadingBackgroundColor={"#eeeeee"}
          onMapReady={() => this.onMapReady()}>
          { this.state.tasks.map(task => (
            <MapView.Marker
              ref={ component => this.markers.push(component) }
              identifier={ task['@id'] }
              key={ task['@id'] }
              coordinate={ task.address.geo }
              pinColor={ pinColor(task) }
              flat={ true }>
              <MapView.Callout onPress={ () => navigate('CourierTask', { ...navigationParams, task }) }>
                <Text style={styles.mapCalloutText}>{ task.address.streetAddress }</Text>
              </MapView.Callout>
            </MapView.Marker>
          ))}
        </MapView>
        <View style={ styles.taskListButton }>
          <Button block onPress={ () => navigate('CourierTaskList', { ...navigationParams, tasks }) }>
            <Icon name="list" />
            <Text>Liste des tâches</Text>
          </Button>
        </View>
        { this.renderLoader() }
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  selectHeaderStyle: {
    position: 'absolute',
    top: 0,
    zIndex: 2
  },
  item: {
    borderBottomColor: whiteColor,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  itemActive: {
    backgroundColor: lightGreyColor
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.4)'
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    top: dateSelectHeaderHeight
  },
  mapCalloutText: {
    fontSize: 14
  },
  modal: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: whiteColor
  },
  taskListButton: {
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 10,
    right: 0,
    left: 0,
    bottom: 15
  }
});

module.exports = TasksPage;