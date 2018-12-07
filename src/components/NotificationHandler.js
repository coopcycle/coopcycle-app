import React, { Component } from 'react'
import { Alert } from 'react-native'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import Sound from 'react-native-sound'
import moment from 'moment'

import PushNotification from '../notifications'
import NavigationHolder from '../NavigationHolder'

import { setRemotePushToken } from '../redux/App/actions'
import { loadTasks } from '../redux/Courier'
import { loadOrderAndNavigate } from '../redux/Restaurant/actions'

// Make sure sound will play even when device is in silent mode
Sound.setCategory('Playback')

class NotificationHandler extends Component {

  _onTasksChanged(date) {
    if (this.props.currentRoute !== 'CourierTaskList') {
      NavigationHolder.navigate('CourierTaskList', {})
    }

    this.props.loadTasks(this.props.httpClient, moment(date))
  }

  _onOrderCreated(restaurant, date, order) {
    this.props.loadOrderAndNavigate(order)
  }

  componentDidMount() {
    PushNotification.configure({
      onRegister: token => this.props.setRemotePushToken(token),
      onNotification: notification => {
        const { event } = notification.data

        if (event && event.name === 'order:created') {
          const { restaurant, date, order } = event.data
          if (notification.foreground) {

            // Load and play sound until the alert is closed
            const bell = new Sound('misstickle__indian_bell_chime.wav', Sound.MAIN_BUNDLE, (error) => {
              if (error) {
                return
              }
              bell.setNumberOfLoops(-1)
              bell.play((success) => {
                if (!success) {
                  bell.reset();
                }
              })
            })

            Alert.alert(
              this.props.t('NOTIFICATION_ORDER_CREATED_TITLE'),
              this.props.t('NOTIFICATION_ORDER_CREATED_DESC', { date: event.data.date }),
              [
                {
                  text: this.props.t('VIEW'),
                  onPress: () => {
                    bell.stop(() => {})
                    this._onOrderCreated(restaurant, date, order)
                  }
                },
              ],
              {
                cancelable: false
              }
            )
          } else {
            this._onOrderCreated(restaurant, date, order)
          }
        }

        if (event && event.name === 'tasks:changed') {
          if (notification.foreground) {
            Alert.alert(
              this.props.t('NOTIFICATION_TASKS_CHANGED_TITLE'),
              this.props.t('NOTIFICATION_TASKS_CHANGED_DESC', { date: event.data.date }),
              [
                {
                  text: this.props.t('CANCEL'),
                  onPress: () => {}
                },
                {
                  text: this.props.t('VIEW'),
                  onPress: () => this._onTasksChanged(event.data.date)
                },
              ],
              {
                cancelable: true
              }
            )
          } else {
            this._onTasksChanged(event.data.date)
          }
        }
      }
    })
  }

  componentWillUnmount() {
    PushNotification.removeListeners()
  }

  render() {

    return null
  }
}

function mapStateToProps(state) {

  return {
    httpClient: state.app.httpClient,
    currentRoute: state.app.currentRoute,
  }
}

function mapDispatchToProps (dispatch) {

  return {
    loadOrderAndNavigate: order => dispatch(loadOrderAndNavigate(order)),
    loadTasks: (httpClient, date) => dispatch(loadTasks(httpClient, date)),
    setRemotePushToken: token => dispatch(setRemotePushToken(token)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(NotificationHandler))
