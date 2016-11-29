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

const MainPage = require('./MainPage');
const LoginPage = require('./LoginPage');
const RestaurantsPage = require('./RestaurantsPage');
const RestaurantPage = require('./RestaurantPage');
const CartPage = require('./CartPage');
const ChooseAddressPage = require('./ChooseAddressPage');
const CourierPage = require('./CourierPage');
const EnterAddressPage = require('./EnterAddressPage');
const AccountPage = require('./AccountPage');
const BusyPage = require('./BusyPage');
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
    if (routeId === 'MainPage') {
      return (
        <MainPage navigator={navigator} {...route.passProps} />
      );
    }
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
