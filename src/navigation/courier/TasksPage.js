import React, { Component } from 'react'
import { StyleSheet, View, ActivityIndicator, Alert, TouchableOpacity, Platform } from 'react-native'
import {
  Container, Button, Icon, Text
} from 'native-base'
import moment from 'moment/min/moment-with-locales'
import MapView from 'react-native-maps'
import { NavigationActions } from 'react-navigation'
import KeepAwake from 'react-native-keep-awake'
import RNPinScreen from 'react-native-pin-screen'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import _ from 'lodash'

import { greenColor, redColor, greyColor, whiteColor, orangeColor, dateSelectHeaderHeight, websocketWarningHeight } from "../../styles/common"
import DateSelectHeader from "../../components/DateSelectHeader"
import { localeDetector } from '../../i18n'
import Preferences from '../../Preferences'
import {
  loadTasks,
  selectFilteredTasks,
  selectIsTasksLoading,
  selectIsTasksLoadingFailure,
  selectTaskSelectedDate,
} from '../../redux/Courier'
import BackgroundGeolocation from 'react-native-mauron85-background-geolocation'

import { withDefaults } from "../../maps"
const MapViewWithDefaults = withDefaults(MapView)

moment.locale(localeDetector())


class TasksPage extends Component {

  map = null
  markers = []

  static navigationOptions = ({navigation}) => {
    return {
      headerRight: (
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'flex-end'}}>
          <Button transparent onPress={() => navigation.navigate('CourierFilters')}>
            <Icon name="settings" style={{color: whiteColor}} />
          </Button>
          <Button transparent>
            <Icon name="navigate" style={{color: navigation.getParam('tracking', false) ? greenColor : greyColor}}/>
          </Button>
        </View>
      ),
    }
  }

  constructor(props) {
    super(props)

    this.state = {
      task: null,
      loading: false,
      loadingMessage: this.props.t('LOADING'),
      geolocation: null,
      polyline: [],
    }

    this.onMapReady = this.onMapReady.bind(this)
    this.refreshTasks = this.refreshTasks.bind(this)
  }

  componentDidMount() {

    Preferences.getKeepAwake().then(keepAwake => {
      if (keepAwake) {
        if (Platform.OS === 'ios') {
          KeepAwake.activate()
        } else {
          RNPinScreen.pin()
        }
      }
    })

    this.refreshTasks(this.props.selectedDate)
  }

  componentWillUnmount() {

    BackgroundGeolocation.stop()

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

  center() {
    const { geolocation } = this.state
    this.map.animateToCoordinate(geolocation, 500)
  }

  onGeolocationChange(geolocation) {
    this.setState({ geolocation })
  }

  refreshTasks (selectedDate) {
    this.props.loadTasks(this.props.httpClient, selectedDate)
  }

  onMapReady () {

    BackgroundGeolocation.on('start', () => {
      this.props.navigation.setParams({ tracking: true })
    })

    BackgroundGeolocation.on('stop', () => {
      this.props.navigation.setParams({ tracking: false })
    })

    BackgroundGeolocation.on('location', (location) => {

      this.onGeolocationChange(location)

      // handle your locations here
      // to perform long running operation on iOS
      // you need to create background task
      // BackgroundGeolocation.startTask(taskKey => {
      //   // execute long running task
      //   // eg. ajax post location
      //   // IMPORTANT: task has to be ended by endTask
      //   BackgroundGeolocation.endTask(taskKey);
      // });
    })

    BackgroundGeolocation.on('error', (error) => {
      console.log('[ERROR] BackgroundGeolocation error:', error);
    });

    BackgroundGeolocation.on('authorization', (status) => {
      console.log('[INFO] BackgroundGeolocation authorization status: ' + status);
      if (status !== BackgroundGeolocation.AUTHORIZED) {
        // we need to set delay or otherwise alert may not be shown
        setTimeout(() =>
          Alert.alert('App requires location tracking permission', 'Would you like to open app settings?', [
            { text: 'Yes', onPress: () => BackgroundGeolocation.showAppSettings() },
            { text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel' }
          ]), 1000);
      }
    });

    BackgroundGeolocation.checkStatus(status => {
      // you don't need to check status before start (this is just the example)
      if (!status.isRunning) {
        BackgroundGeolocation.start(); // triggers start on start event
      }
    });

    // you can also just start without checking for status
    // BackgroundGeolocation.start();
  }

  renderLoader() {

    const { isLoadingTasks } = this.props
    const { loading, loadingMessage } = this.state

    if (isLoadingTasks || loading) {
      return (
        <View style={ styles.loader }>
          <ActivityIndicator
            animating={ true }
            size="large"
            color="#fff"
          />
          <Text style={{ color: '#fff' }}>{
            loadingMessage || this.props.t('LOADING')
          }</Text>
        </View>
      )
    }

    return (
      <View />
    )
  }

  renderLocateButton() {

    const { geolocation } = this.state

    if (geolocation) {
      return (
        <View style={ styles.locateButton }>
          <TouchableOpacity
            onPress={ () => this.center() }
            style={ styles.circle }>
            <Icon name="locate" />
          </TouchableOpacity>
        </View>
      )
    }
  }

  render() {

    const { tasks, selectedDate } = this.props
    const { navigate } = this.props.navigation
    const { geolocation } = this.state

    this.markers = this.markers.slice()

    const pinColor = task => {

      let pinColor = greyColor

      if (task.status === 'DONE') {
        pinColor = greenColor
      }

      if (task.status === 'FAILED') {
        pinColor = redColor
      }

      return pinColor
    }

    const navigationParams = { geolocation }

    return (
      <Container>
        <DateSelectHeader
          buttonsEnabled={true}
          toDate={this.refreshTasks}
          selectedDate={selectedDate}
        />
        <View style={ styles.container }>
          <MapViewWithDefaults
            ref={ component => this.map = component }
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
                  {
                    task.tags.map((tag, index) => (
                      <Text key={{index}} style={{
                        backgroundColor: tag.color,
                        textAlign: 'center',
                        color: whiteColor,
                        fontSize: 14,
                        paddingHorizontal: 15,
                        width: '60%'
                      }}>
                        {tag.name}
                      </Text>))
                  }
                </MapView.Callout>
              </MapView.Marker>
            ))}
          </MapViewWithDefaults>
          <View style={ styles.taskListButton }>
            <Button block onPress={ () => navigate('CourierTaskList', { ...navigationParams, tasks }) }>
              <Icon name="list" />
              <Text>{this.props.t('TASK_LIST')}</Text>
            </Button>
          </View>
          { this.renderLocateButton() }
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
    top: 22,
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
  websocketWarning: {
    backgroundColor: orangeColor,
    justifyContent: 'center',
    alignItems: 'center',
    height: websocketWarningHeight,
    zIndex: 2,
  },
  websocketWarningText: {
    color: whiteColor
  }
})

function mapStateToProps (state) {
  return {
    httpClient: state.app.httpClient,
    tasks: selectFilteredTasks(state),
    selectedDate: selectTaskSelectedDate(state),
    isLoadingTasks: selectIsTasksLoading(state),
    tasksLoadingError: selectIsTasksLoadingFailure(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    loadTasks: (client, selectedDate) => dispatch(loadTasks(client, selectedDate)),
    send: (msg) => dispatch(send(msg)),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(translate()(TasksPage))
