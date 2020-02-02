import React, { Component } from 'react'
import { StyleSheet, Alert, Platform, InteractionManager } from 'react-native'
import { Container } from 'native-base'
import { NavigationActions, withNavigationFocus } from 'react-navigation'
import KeepAwake from 'react-native-keep-awake'
import RNPinScreen from 'react-native-pin-screen'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'

import { whiteColor, orangeColor, dateSelectHeaderHeight, websocketWarningHeight } from '../../styles/common'
import DateSelectHeader from '../../components/DateSelectHeader'
import TasksMapView from '../../components/TasksMapView'
import {
  loadTasks,
  selectFilteredTasks,
  selectTaskSelectedDate,
  selectKeepAwake,
} from '../../redux/Courier'
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation'

class TasksPage extends Component {

  constructor(props) {
    super(props)

    this.state = {
      task: null,
      polyline: [],
    }

    this.onMapReady = this.onMapReady.bind(this)
    this.refreshTasks = this.refreshTasks.bind(this)
  }

  enableKeepAwake() {
    if (Platform.OS === 'ios') {
      KeepAwake.activate()
    } else {
      RNPinScreen.pin()
    }
  }

  disableKeepAwake() {
    if (Platform.OS === 'ios') {
      KeepAwake.deactivate()
    } else {
      RNPinScreen.unpin()
    }
  }

  componentDidMount() {

    InteractionManager.runAfterInteractions(() => {
      this.refreshTasks(this.props.selectedDate)
    })

    if (this.props.keepAwake && this.props.isFocused) {
      this.enableKeepAwake()
    }

    BackgroundGeolocation.on('start', () => {
      this.setParentParams({ tracking: true })
    })
    BackgroundGeolocation.on('stop', () => {
      this.setParentParams({ tracking: false })
    })
    BackgroundGeolocation.checkStatus(status => {
      if (status.isRunning) {
        this.setParentParams({ tracking: true })
      }
    })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isFocused !== this.props.isFocused || prevProps.keepAwake !== this.props.keepAwake) {
      if (this.props.keepAwake && this.props.isFocused) {
        this.enableKeepAwake()
      } else {
        this.disableKeepAwake()
      }
    }
  }

  refreshTasks (selectedDate) {
    this.props.loadTasks(selectedDate)
  }

  setParentParams(params) {
    this.props.navigation.dispatch(NavigationActions.setParams({
      params,
      key: 'CourierHome',
    }))
  }

  onMapReady () {
    BackgroundGeolocation.on('authorization', (status) => {
      console.log('[INFO] BackgroundGeolocation authorization status: ' + status);
      if (status === BackgroundGeolocation.NOT_AUTHORIZED) {
        // we need to set delay or otherwise alert may not be shown
        setTimeout(() =>
          Alert.alert('App requires location tracking permission', 'Would you like to open app settings?', [
            { text: 'Yes', onPress: () => BackgroundGeolocation.showAppSettings() },
            { text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel' },
          ]), 1000);
      }
    });
  }

  render() {

    const { tasks, selectedDate } = this.props
    const { navigate } = this.props.navigation

    return (
      <Container style={ styles.container }>
        <TasksMapView
          mapCenter={ this.props.mapCenter }
          tasks={ tasks }
          onMapReady={ () => this.onMapReady() }
          onMarkerCalloutPress={ task => navigate('Task', { task, navigateAfter: this.props.navigation.state.routeName }) } />
        <DateSelectHeader
          buttonsEnabled={true}
          toDate={this.refreshTasks}
          selectedDate={selectedDate}/>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: dateSelectHeaderHeight,
  },
  websocketWarning: {
    backgroundColor: orangeColor,
    justifyContent: 'center',
    alignItems: 'center',
    height: websocketWarningHeight,
    zIndex: 2,
  },
  websocketWarningText: {
    color: whiteColor,
  },
})

function mapStateToProps (state) {
  return {
    tasks: selectFilteredTasks(state),
    selectedDate: selectTaskSelectedDate(state),
    keepAwake: selectKeepAwake(state),
    mapCenter: state.app.settings.latlng.split(',').map(parseFloat),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    loadTasks: (selectedDate) => dispatch(loadTasks(selectedDate)),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(withNavigationFocus(TasksPage)))
