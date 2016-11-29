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

const LoginPage = require('./src/page/LoginPage');
const RestaurantsPage = require('./src/page/RestaurantsPage');
const RestaurantPage = require('./src/page/RestaurantPage');
const CartPage = require('./src/page/CartPage');
const ChooseAddressPage = require('./src/page/ChooseAddressPage');
const CourierPage = require('./src/page/CourierPage');
const EnterAddressPage = require('./src/page/EnterAddressPage');
const AccountPage = require('./src/page/AccountPage');
const BusyPage = require('./src/page/BusyPage');

const Auth = require('./src/Auth');

class coursiersapp extends Component {

  componentDidMount() {
    Auth.getUser()
      .then((user) => console.log(user))
      .catch(() => {});
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
    var routeId = route.id;
    if (routeId === 'RestaurantsPage') {
      return (
        <RestaurantsPage navigator={navigator} {...route.passProps} />
      );
    }
    if (routeId === 'RestaurantPage') {
      return (
        <RestaurantPage navigator={navigator} {...route.passProps} />
      );
    }
    if (routeId === 'LoginPage') {
      return (
        <LoginPage navigator={navigator} {...route.passProps} />
      );
    }
    if (routeId === 'CartPage') {
      return (
        <CartPage navigator={navigator} {...route.passProps} />
      );
    }
    if (routeId === 'ChooseAddressPage') {
      return (
        <ChooseAddressPage navigator={navigator} {...route.passProps} />
      );
    }
    if (routeId === 'CourierPage') {
      return (
        <CourierPage navigator={navigator} {...route.passProps} />
      );
    }
    if (routeId === 'EnterAddressPage') {
      return (
        <EnterAddressPage navigator={navigator} {...route.passProps} />
      );
    }
    if (routeId === 'AccountPage') {
      return (
        <AccountPage navigator={navigator} {...route.passProps} />
      );
    }
    if (routeId === 'BusyPage') {
      return (
        <BusyPage navigator={navigator} {...route.passProps} />
      );
    }

    return this.noRoute(navigator);
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
