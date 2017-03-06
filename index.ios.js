/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Navigator,
  TouchableOpacity,
} from 'react-native';

import MapView from 'react-native-maps';
import Polyline from 'polyline';
import _ from 'underscore';

import { API } from 'coopcycle-js';

const LoginPage = require('./src/page/LoginPage');
const RestaurantsPage = require('./src/page/RestaurantsPage');
const RestaurantPage = require('./src/page/RestaurantPage');
const CartPage = require('./src/page/CartPage');
const CartAddressPage = require('./src/page/CartAddressPage');
const CourierPage = require('./src/page/CourierPage');
const AccountPage = require('./src/page/AccountPage');
const AccountAddressesPage = require('./src/page/account/AccountAddressesPage');
const AccountOrdersPage = require('./src/page/account/AccountOrdersPage');
const BusyPage = require('./src/page/BusyPage');
const CreditCardPage = require('./src/page/CreditCardPage');
const OrderTrackingPage = require('./src/page/OrderTrackingPage');

const AppUser = require('./src/AppUser');
const AppConfig = require('./src/AppConfig');

class coursiersapp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      client: null
    }
  }
  componentWillMount() {
    AppUser.load()
      .then((user) => {
        this.setState({
          user: user,
          client: API.createClient(AppConfig.API_BASEURL, user)
        });
      });
  }
  render() {
    return (
      <Navigator
        initialRoute={{id: 'RestaurantsPage', name: 'Restaurants'}}
        renderScene={this.renderScene.bind(this)}
        configureScene={(route) => {
          if (route.sceneConfig) {
            return route.sceneConfig;
          }
          return Navigator.SceneConfigs.FloatFromRight;
        }} />
    );
  }
  renderScene(route, navigator) {

    if (!this.state.user) {
      return this.loading();
    }

    var routeId = route.id;
    if (routeId === 'RestaurantsPage') {
      return (
        <RestaurantsPage navigator={navigator} user={this.state.user} client={this.state.client} {...route.passProps} />
      );
    }
    if (routeId === 'RestaurantPage') {
      return (
        <RestaurantPage navigator={navigator} {...route.passProps} />
      );
    }
    if (routeId === 'LoginPage') {
      return (
        <LoginPage navigator={navigator} user={this.state.user} client={this.state.client} {...route.passProps} />
      );
    }
    if (routeId === 'CartPage') {
      return (
        <CartPage navigator={navigator} {...route.passProps} />
      );
    }
    if (routeId === 'CartAddressPage') {
      return (
        <CartAddressPage navigator={navigator} user={this.state.user} client={this.state.client} {...route.passProps} />
      );
    }
    if (routeId === 'CourierPage') {
      return (
        <CourierPage navigator={navigator} user={this.state.user} client={this.state.client} {...route.passProps} />
      );
    }
    if (routeId === 'AccountPage') {
      return (
        <AccountPage navigator={navigator} user={this.state.user} client={this.state.client} {...route.passProps} />
      );
    }
    if (routeId === 'BusyPage') {
      return (
        <BusyPage navigator={navigator} {...route.passProps} />
      );
    }
    if (routeId === 'CreditCardPage') {
      return (
        <CreditCardPage navigator={navigator} {...route.passProps} />
      );
    }
    if (routeId === 'AccountOrdersPage') {
      return (
        <AccountOrdersPage navigator={navigator} {...route.passProps} />
      );
    }
    if (routeId === 'AccountAddressesPage') {
      return (
        <AccountAddressesPage navigator={navigator} {...route.passProps} />
      );
    }
    if (routeId === 'OrderTrackingPage') {
      return (
        <OrderTrackingPage navigator={navigator} {...route.passProps} />
      );
    }

    return this.noRoute(navigator);
  }

  loading() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>Chargement</Text>
      </View>
    );
  }

  noRoute(navigator) {
    return (
      <View style={{flex: 1, alignItems: 'stretch', justifyContent: 'center'}}>
        <TouchableOpacity style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
            onPress={() => navigator.pop()}>
          <Text style={{color: 'red', fontWeight: 'bold'}}>NOT FOUND</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

AppRegistry.registerComponent('coursiersapp', () => coursiersapp);
