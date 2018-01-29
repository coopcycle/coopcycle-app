import React, { Component } from 'react'
import { StyleSheet, View, ActivityIndicator, Image, FlatList, Modal, Platform, TouchableHighlight } from 'react-native'
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

moment.locale('fr')

const COLOR_GREY = '#95A5A6'
const COLOR_LIGHTGREY = '#ECF0F1'
const COLOR_GREEN = '#2ECC71'
const COLOR_BLUE = '#3498DB'
const COLOR_RED = '#E74C3C'

class TasksPage extends Component {

  map = null
  markers = []

  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state
    return {
      headerRight: (
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end' }}>
          <Button transparent>
            <Icon name="navigate" style={{ color: params.tracking ? COLOR_GREEN : COLOR_GREY }} />
          </Button>
        </View>
      ),
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      tasks: [],
      task: null,
      nextTask: null,
      loading: false,
      loadingMessage: 'Chargement…',
      currentPosition: null,
      watchID: null,
      polyline: [],
      detailsModal: false,
    }
  }

  componentDidMount() {
    this.setState({ loading: true })
    this.getCurrentPosition()
      .then(position => this.watchPosition(position))
      .then(position => {
        this.onPositionUpdated(position)
        this.props.navigation.setParams({ tracking: true })
        this.refreshTasks()
      })
  }

  componentWillUnmount() {
    const { watchID } = this.state
    navigator.geolocation.clearWatch(watchID)
  }

  getCurrentPosition() {

    this.setState({ loadingMessage: 'Calcul de votre position…' })

    return new Promise((resolve, reject) => {

      let options;
      if (Platform.OS === 'ios') {
        options = {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 5000
        }
      } else {
        options = {
          enableHighAccuracy: false
        }
      }

      navigator.geolocation.getCurrentPosition(
        position => resolve(position),
        error => reject(error),
        options
      )
    })

  }

  watchPosition(position) {
    return new Promise((resolve, reject) => {
      const watchID = navigator.geolocation.watchPosition(
        position => this.onPositionUpdated(position),
        error => reject(error)
      )
      this.setState({
        watchID: watchID
      })
      resolve(position)
    })
  }

  onPositionUpdated(position) {
    this.setState({ currentPosition: position.coords })
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
    const { currentPosition } = this.state

    this.setState({ loading: true, loadingMessage: 'Chargement…' })

    client.get('/api/me/tasks/' + moment().format('YYYY-MM-DD'))
      .then(data => {
        const tasks = data['hydra:member']
        this.setState({
          loading: false,
          tasks,
        })
        setTimeout(() => this.map.fitToElements(false), 500)
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

  renderTask(task, nextTask) {

    const { client } = this.props.navigation.state.params
    const buttonProps = (task === nextTask) ? {} : { disabled: true }
    const taskIcon = task.type === 'PICKUP' ? 'md-arrow-up' : 'md-arrow-down'

    let style = [ styles.item ]
    if (task === nextTask) {
      style.push(styles.itemActive)
    }

    return (
      <View style={ style }>
        <Grid>
          <Col size={ 1 } style={{ paddingHorizontal: 5, flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name={ taskIcon } />
          </Col>
          <Col size={ 10 } style={{ padding: 10 }}>
            <Text>{ task.address.streetAddress }</Text>
            <Text>{ moment(task.doneAfter).format('LT') } - { moment(task.doneBefore).format('LT') }</Text>
          </Col>
          <Col size={ 1 } style={{ paddingHorizontal: 5, flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <TouchableHighlight>
              <Icon style={{ color: '#ccc' }} name="md-arrow-forward" />
            </TouchableHighlight>
          </Col>
        </Grid>
      </View>
    )
  }

  render() {

    const { tasks } = this.state
    const { navigate } = this.props.navigation
    const { client } = this.props.navigation.state.params

    const nextTask = _.find(this.state.tasks, task => task.status === 'TODO')

    this.markers = this.markers.slice()

    return (
      <Container>
        <Grid>
          <Row size={ 9 }>
            <MapView
              ref={ component => this.map = component }
              style={ styles.map }
              zoomEnabled
              showsUserLocation
              loadingEnabled
              loadingIndicatorColor={"#666666"}
              loadingBackgroundColor={"#eeeeee"}>
              { this.state.tasks.map(task => (
                <MapView.Marker
                  ref={ component => this.markers.push(component) }
                  identifier={ task['@id'] }
                  key={ task['@id'] }
                  coordinate={ task.address.geo }
                  pinColor={ task.status === 'TODO' ? COLOR_BLUE : COLOR_GREEN }
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