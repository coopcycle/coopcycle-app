import React, { Component } from 'react'
import { StyleSheet, View, ActivityIndicator, Alert, TouchableOpacity, Platform } from 'react-native'
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
import RNPinScreen from 'react-native-pin-screen'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import _ from 'lodash'

import { greenColor, blueColor, redColor, greyColor, whiteColor, dateSelectHeaderHeight } from "../../styles/common"
import GeolocationTracker from '../../GeolocationTracker'
import DateSelectHeader from "../../components/DateSelectHeader"
import { localeDetector } from '../../i18n'
import { Settings } from '../../Settings'
import {
  loadTasks,
  selectTasksList, selectIsTasksLoading, selectIsTasksLoadingFailure, selectTaskSelectedDate,
} from '../../redux/Tasks'
import { selectIsWsOpen } from '../../redux/App'
import { send } from '../../redux/middlewares/WebSocketMiddleware'


moment.locale(localeDetector())


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
      loadingMessage: `${this.props.t('LOADING')}...`,
      currentPosition: null,
      polyline: [],
      detailsModal: false
    }

    this.onMapReady = this.onMapReady.bind(this)
    this.refreshTasks = this.refreshTasks.bind(this)
  }

  componentDidMount() {

    Settings.getKeepAwake().then(keepAwake => {
      if (keepAwake) {
        if (Platform.OS === 'ios') {
          KeepAwake.activate()
        } else {
          RNPinScreen.pin()
        }
      }
    })

    if (this.props.isWsOpen) {
      this.props.navigation.setParams({connected: true})
    }
  }

  componentWillUnmount() {
    this.geolocationTracker.stop()

    if (Platform.OS === 'ios') {
      KeepAwake.deactivate()
    } else {
      RNPinScreen.unpin()
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { tasksLoadingError, navigation } = this.props

    if (tasksLoadingError && !prevProps.tasksLoadingError) {
      Alert.alert(
        this.props.t('FAILED_TASK_LOAD'),
        this.props.t('TRY_LATER'),
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
    if (this.props.isWsOpen !== nextProps.isWsOpen) {
      this.props.navigation.setParams({ connected: nextProps.isWsOpen })
    }

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

    this.setState({ loading: true, loadingMessage: `${this.props.t('WAITING_FOR_POS')}...` })

    this.geolocationTracker.start()
      .then(() => {
        this.setState({ loading: false, loadingMessage: '' })
        return this.refreshTasks(this.props.selectedDate)
      })
      .catch(e => {
        console.log(e)
        // TODO Distinguish error reason
        Alert.alert(
          this.props.t('PROBLEM_CONNECTING'),
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

  onGeolocationChange(position) {
    this.props.navigation.setParams({ tracking: true })
    this.setState({ currentPosition: position.coords })
    this.props.send({ type: 'position', data: position.coords })
  }

  refreshTasks (selectedDate) {
    const { client } = this.props.navigation.state.params
    this.props.loadTasks(client, selectedDate)
  }

  onMapReady () {
    this.connect()
  }

  renderLoader() {

    const { taskLoadingMessage, isWsOpen } = this.props
    const { loading, loadingMessage } = this.state

    if (taskLoadingMessage || !isWsOpen || loading) {
      return (
        <View style={ styles.loader }>
          <ActivityIndicator
            animating={ true }
            size="large"
            color="#fff"
          />
          <Text style={{ color: '#fff' }}>{
            taskLoadingMessage ||
            !isWsOpen && this.props.t('CONN_LOST') ||
            loading && loadingMessage
          }</Text>
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

      if (task.tags.length > 0) {
        const tag = _.first(task.tags)

        return tag.color
      }

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
            showsMyLocationButton={ false }
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
    tasks: selectTasksList(state),
    selectedDate: selectTaskSelectedDate(state),
    isLoadingTasks: selectIsTasksLoading(state),
    tasksLoadingError: selectIsTasksLoadingFailure(state),
    isWsOpen: selectIsWsOpen(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    loadTasks: (client, selectedDate) => dispatch(loadTasks(client, selectedDate)),
    send: (msg) => dispatch(send(msg)),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(translate()(TasksPage))
