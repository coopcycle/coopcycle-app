import React, { Component } from 'react'
import { StyleSheet, View, ActivityIndicator, Image, FlatList, Modal, Platform, TouchableHighlight, Alert } from 'react-native'
import {
  Container,
  Content, Button, Icon, List, ListItem, Text, Title,
  Card, CardItem, Thumbnail,
  Header, Left, Body, Right
} from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid'
import _ from 'lodash'
import moment from 'moment/min/moment-with-locales'
import MapView from 'react-native-maps'
import { NavigationActions } from 'react-navigation';
import WebSocketClient from '../../WebSocketClient'
import GeolocationTracker from '../../GeolocationTracker'

moment.locale('fr')

const COLOR_GREY = '#95A5A6'
const COLOR_LIGHTGREY = '#ECF0F1'
const COLOR_GREEN = '#2ECC71'
const COLOR_BLUE = '#3498DB'
const COLOR_RED = '#E74C3C'

class TasksPage extends Component {

  map = null
  markers = []
  webSocketClient = null
  geolocationTracker = null

  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state
    return {
      headerRight: (
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end' }}>
          <Button transparent>
            <Icon name="wifi" style={{ color: params.connected ? COLOR_GREEN : COLOR_GREY }} />
          </Button>
          <Button transparent>
            <Icon name="navigate" style={{ color: params.tracking ? COLOR_GREEN : COLOR_GREY }} />
          </Button>
        </View>
      ),
    }
  }

  constructor(props) {
    super(props)

    const { baseURL, client, user } = this.props.navigation.state.params

    this.webSocketClient = new WebSocketClient(client, '/dispatch', {
      onConnect: this.onWebSocketConnect.bind(this),
      onDisconnect: this.onWebSocketDisconnect.bind(this),
      onReconnect: this.onWebSocketReconnect.bind(this),
    })

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
    }
  }

  componentWillUnmount() {
    this.geolocationTracker.stop()
    this.webSocketClient.disconnect()
  }

  connect() {

    this.setState({ loading: true, loadingMessage: 'Connexion…' })

    Promise.all([
      this.geolocationTracker.start(),
      this.webSocketClient.connect()
    ]).then(() => {
      this.refreshTasks()
    }).catch(e => {
      // TODO Distinguish error reason
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

  onGeolocationChange(position) {

    this.props.navigation.setParams({ tracking: true })
    this.setState({ currentPosition: position.coords })

    if (this.webSocketClient.isOpen()) {
      this.webSocketClient.send({
        type: 'position',
        data: position.coords
      })
    }
  }

  onTaskChange(newTask) {
    const { tasks } = this.state
    const newTasks = tasks.slice()
    const taskIndex = _.findIndex(tasks, task => task['@id'] === newTask['@id'])
    newTasks[taskIndex] = newTask

    this.setState({ tasks: newTasks })
  }

  refreshTasks() {

    const { client } = this.props.navigation.state.params

    this.setState({ loading: true, loadingMessage: 'Chargement…' })

    client.get('/api/me/tasks/' + moment().format('YYYY-MM-DD'))
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

    const { tasks } = this.state
    const { navigate } = this.props.navigation
    const { client } = this.props.navigation.state.params

    this.markers = this.markers.slice()

    const pinColor = task => {

      let pinColor = COLOR_BLUE

      if (task.status === 'DONE') {
        pinColor = COLOR_GREEN
      }

      if (task.status === 'FAILED') {
        pinColor = COLOR_RED
      }

      return pinColor
    }

    return (
      <Container>
        <Grid>
          <Row size={ 9 }>
            <MapView
              ref={ component => this.map = component }
              style={ styles.map }
              zoomEnabled={ true }
              zoomControlEnabled={ true }
              showsUserLocation
              loadingEnabled
              loadingIndicatorColor={"#666666"}
              loadingBackgroundColor={"#eeeeee"}
              onMapReady={() => this.connect()}>
              { this.state.tasks.map(task => (
                <MapView.Marker
                  ref={ component => this.markers.push(component) }
                  identifier={ task['@id'] }
                  key={ task['@id'] }
                  coordinate={ task.address.geo }
                  pinColor={ pinColor(task) }
                  flat={ true }>
                  <MapView.Callout onPress={ () => navigate('CourierTask', { client, task, onTaskChange: this.onTaskChange.bind(this) }) }>
                    <Text style={{ fontSize: 14 }}>{ task.address.streetAddress }</Text>
                  </MapView.Callout>
                </MapView.Marker>
              ))}
            </MapView>
          </Row>
          <Row size={ 1 }>
            <View style={{ padding: 10, flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Button block onPress={ () => navigate('CourierTaskList', { client, tasks, onTaskChange: this.onTaskChange.bind(this) }) }>
                <Icon name="list" />
                <Text>Liste des tâches</Text>
              </Button>
            </View>
          </Row>
        </Grid>
        { this.renderLoader() }
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  item: {
    borderBottomColor: '#f7f7f7',
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  itemActive: {
    backgroundColor: COLOR_LIGHTGREY
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.4)'
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  modal: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff'
  },
});

module.exports = TasksPage;