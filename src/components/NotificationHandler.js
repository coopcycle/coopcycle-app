import { CommonActions } from '@react-navigation/native';
import moment from 'moment';
import { Icon, Text } from 'native-base';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import Sound from 'react-native-sound';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';

import NavigationHolder from '../NavigationHolder';
import PushNotification from '../notifications';

import analyticsEvent from '../analytics/Event';
import tracker from '../analytics/Tracker';
import {
  clearNotifications,
  pushNotification,
  registerPushNotificationToken,
} from '../redux/App/actions';
import { loadTasks, selectTasksChangedAlertSound } from '../redux/Courier';
import {
  loadOrder,
  loadOrderAndNavigate,
  loadOrderAndPushNotification,
} from '../redux/Restaurant/actions';
import { message as wsMessage } from '../redux/middlewares/CentrifugoMiddleware/actions';

import ModalContent from './ModalContent';

// Make sure sound will play even when device is in silent mode
Sound.setCategory('Playback');

/**
 * This component is used
 * 1/ To configure push notifications (see componentDidMount)
 * 2/ To show notifications when the app is in foreground.
 */
class NotificationHandler extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sound: null,
      isSoundReady: false,
    };
  }

  _onTasksChanged(date) {
    if (this.props.currentRoute !== 'CourierTaskList') {
      NavigationHolder.navigate('CourierTaskList', {});
    }

    this.props.loadTasks(moment(date));
  }

  _loadSound() {
    const bell = new Sound(
      'misstickle__indian_bell_chime.wav',
      Sound.MAIN_BUNDLE,
      error => {
        if (error) {
          return;
        }

        bell.setNumberOfLoops(-1);

        this.setState({
          sound: bell,
          isSoundReady: true,
        });
      },
    );
  }

  _startSound() {
    const { sound, isSoundReady } = this.state;
    if (isSoundReady) {
      sound.play(success => {
        if (!success) {
          sound.reset();
        }
      });
      // Clear notifications after 10 seconds
      setTimeout(() => this.props.clearNotifications(), 10000);
    }
  }

  _stopSound() {
    const { sound, isSoundReady } = this.state;
    if (isSoundReady) {
      sound.stop(() => {});
    }
  }

  includesNotification(notifications, predicate) {
    return notifications.findIndex(predicate) !== -1;
  }

  componentDidUpdate(prevProps) {
    if (this.props.notifications !== prevProps.notifications) {
      if (this.props.notifications.length > 0) {
        if (
          this.includesNotification(
            this.props.notifications,
            n => n.event === 'order:created',
          )
        ) {
          this._startSound();
        } else if (
          this.includesNotification(
            this.props.notifications,
            n => n.event === 'tasks:changed',
          )
        ) {
          if (this.props.tasksChangedAlertSound) {
            this._startSound();
          }
        }
      } else {
        this._stopSound();
      }
    }
  }

  componentDidMount() {
    this._loadSound();

    PushNotification.configure({
      onRegister: token => this.props.registerPushNotificationToken(token),
      onNotification: message => {
        const { event } = message.data;

        if (event && event.name === 'order:created') {
          tracker.logEvent(
            analyticsEvent.restaurant._category,
            analyticsEvent.restaurant.orderCreatedMessage,
            message.foreground ? 'in_app' : 'notification_center',
          );

          const { order } = event.data;

          // Here in any case, we navigate to the order that was tapped,
          // it should have been loaded via WebSocket already.
          this.props.loadOrderAndNavigate(order);
        }

        if (event && event.name === 'tasks:changed') {
          tracker.logEvent(
            analyticsEvent.courier._category,
            analyticsEvent.courier.tasksChangedMessage,
            message.foreground ? 'in_app' : 'notification_center',
          );

          if (message.foreground) {
            this.props.pushNotification('tasks:changed', {
              date: event.data.date,
            });
          } else {
            // user clicked on a notification in the notification center
            this._onTasksChanged(event.data.date);
          }
        }
      },
      onBackgroundMessage: message => {
        const { event } = message.data;
        if (event && event.name === 'order:created') {
          this.props.loadOrder(event.data.order, order => {
            if (order) {
              // Simulate a WebSocket message
              this.props.message({
                name: 'order:created',
                data: { order },
              });
            }
          });
        }
      },
    });
  }

  componentWillUnmount() {
    PushNotification.removeListeners();
  }

  _keyExtractor(item, index) {
    switch (item.event) {
      case 'order:created':
        return `order:created:${item.params.order.id}`;
      case 'tasks:changed':
        return `tasks:changed:${moment()}`;
    }
  }

  renderItem(notification) {
    switch (notification.event) {
      case 'order:created':
        return this.renderOrderCreated(notification.params.order);
      case 'tasks:changed':
        return this.renderTasksChanged(
          notification.params.date,
          notification.params.added,
          notification.params.removed,
        );
    }
  }

  _navigateToOrder(order) {
    this._stopSound();
    this.props.clearNotifications();

    NavigationHolder.dispatch(
      CommonActions.navigate({
        name: 'RestaurantNav',
        params: {
          screen: 'Main',
          params: {
            restaurant: order.restaurant,
            // We don't want to load orders again when navigating
            loadOrders: false,
            screen: 'RestaurantOrder',
            params: {
              order,
            },
          },
        },
      }),
    );
  }

  _navigateToTasks(date) {
    this._stopSound();
    this.props.clearNotifications();

    NavigationHolder.dispatch(
      CommonActions.navigate({
        name: 'CourierNav',
        params: {
          screen: 'CourierHome',
          params: {
            screen: 'CourierTaskList',
          },
        },
      }),
    );

    this.props.loadTasks(moment(date));
  }

  renderOrderCreated(order) {
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => this._navigateToOrder(order)}>
        <Text>{this.props.t('NOTIFICATION_ORDER_CREATED_TITLE')}</Text>
        <Icon as={FontAwesome} name="chevron-right" />
      </TouchableOpacity>
    );
  }

  renderTasksChanged(date, added, removed) {
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => this._navigateToTasks(date)}>
        <View>
          <Text style={{ fontSize: 14, fontWeight: '700' }}>
            {this.props.t('NOTIFICATION_TASKS_CHANGED_TITLE')}
          </Text>
          {added && Array.isArray(added) && added.length > 0 && (
            <Text style={{ fontSize: 14 }}>
              {this.props.t('NOTIFICATION_TASKS_ADDED', {
                count: added.length,
              })}
            </Text>
          )}
          {removed && Array.isArray(removed) && removed.length > 0 && (
            <Text style={{ fontSize: 14 }}>
              {this.props.t('NOTIFICATION_TASKS_REMOVED', {
                count: removed.length,
              })}
            </Text>
          )}
        </View>
        <Icon as={FontAwesome} name="chevron-right" />
      </TouchableOpacity>
    );
  }

  renderModalContent() {
    return (
      <ModalContent>
        <View>
          <View style={styles.heading}>
            <Icon
              as={Ionicons}
              name="notifications"
              style={{ color: 'white', marginRight: 10 }}
            />
            <Text style={{ color: 'white' }}>
              {this.props.t('NEW_NOTIFICATION')}
            </Text>
          </View>
        </View>
        <FlatList
          data={this.props.notifications}
          keyExtractor={this._keyExtractor}
          renderItem={({ item }) => this.renderItem(item)}
        />
        <TouchableOpacity
          style={styles.footer}
          onPress={() => this.props.clearNotifications()}>
          <Text style={{ color: '#FF4136' }}>{this.props.t('CLOSE')}</Text>
        </TouchableOpacity>
      </ModalContent>
    );
  }

  render() {
    return (
      <Modal isVisible={this.props.isModalVisible}>
        {this.renderModalContent()}
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 25,
    backgroundColor: '#39CCCC',
  },
  footer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 25,
  },
  item: {
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderBottomColor: '#f7f7f7',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

function mapStateToProps(state) {
  return {
    currentRoute: state.app.currentRoute,
    isModalVisible: state.app.notifications.length > 0,
    notifications: state.app.notifications,
    tasksChangedAlertSound: selectTasksChangedAlertSound(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadOrder: (order, cb) => dispatch(loadOrder(order, cb)),
    loadOrderAndNavigate: order => dispatch(loadOrderAndNavigate(order)),
    loadOrderAndPushNotification: order =>
      dispatch(loadOrderAndPushNotification(order)),
    loadTasks: date => dispatch(loadTasks(date)),
    registerPushNotificationToken: token =>
      dispatch(registerPushNotificationToken(token)),
    clearNotifications: () => dispatch(clearNotifications()),
    pushNotification: (event, params) =>
      dispatch(pushNotification(event, params)),
    message: payload => dispatch(wsMessage(payload)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(NotificationHandler));
