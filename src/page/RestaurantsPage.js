import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Navigator,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
  Slider,
  ListView,
  ActivityIndicator,
  Modal,
} from 'react-native';

import MapView from 'react-native-maps';
import Polyline from 'polyline';
import _ from 'underscore';
import { API } from 'coopcycle-js';

const Auth = require('../Auth');

const AppConfig = require('../AppConfig');
const AppUser = require('../AppUser');
const APIClient = null;

const HOME_COORDS = {
  latitude: 48.875973,
  longitude: 2.370039
};

class RestaurantsPage extends Component {
  constructor(props) {
    super(props);
    let restaurants = [];
    if (props.restaurants) {
      restaurants = props.restaurants;
    }
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      modalVisible: false,
      distance: 2000,
      loading: false,
      dataSource: ds.cloneWithRows(restaurants),
      navigationBarRouteMapper: this.getNavigationBarRouteMapper(false),
    };
  }
  getRestaurants(distance) {
    this.setState({
      loading: true
    });
    return APIClient
      .request('GET', '/api/restaurants?coordinate='+HOME_COORDS.latitude+','+HOME_COORDS.longitude+'&distance='+distance)
  }
  updateRestaurants(distance) {
    this.getRestaurants(distance).then((data) => {
      var restaurants = _.map(data['hydra:member'], (restaurant) => {
        return restaurant;
      });
      this.setState({
        loading: false,
        dataSource: this.state.dataSource.cloneWithRows(restaurants)
      });
    });
  }
  _onLoginSuccess(user) {
    this.setState({navigationBarRouteMapper: this.getNavigationBarRouteMapper(true, user)});
  }
  _onLogout() {
    this.setState({navigationBarRouteMapper: this.getNavigationBarRouteMapper(false)});
  }
  getNavigationBarRouteMapper(authenticated, user) {
    let that = this;
    if (authenticated) {
      return {
        LeftButton(route, navigator, index, navState) {
          return (
            <TouchableOpacity style={{flex: 1, justifyContent: 'center'}}
              onPress={() => navigator.parentNavigator.push({
                id: 'AccountPage',
                name: 'Account',
                sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
                passProps: {
                  onLogout: that._onLogout.bind(that)
                }
              })}>
              <Text style={{color: 'white', margin: 10}}>Mon compte</Text>
            </TouchableOpacity>
          );
        },
        RightButton(route, navigator, index, navState) {
          if (user.hasRole('ROLE_COURIER') || user.hasRole('ROLE_ADMIN')) {
            return (
              <TouchableOpacity style={{flex: 1, justifyContent: 'center'}}
                onPress={() => navigator.parentNavigator.push({
                  id: 'CourierPage',
                  name: 'Courier',
                  sceneConfig: Navigator.SceneConfigs.FloatFromRight,
                  passProps: {
                    user: user
                  }
                })}>
                <Text style={{color: 'white', margin: 10}}>Commandes</Text>
              </TouchableOpacity>
            );
          }

          return null;
        },
        Title(route, navigator, index, navState) {
          return (
            <TouchableOpacity style={{flex: 1, justifyContent: 'center'}}>
              <Text style={{color: 'white', margin: 10, fontSize: 16}}>
                Restaurants
              </Text>
            </TouchableOpacity>
          );
        }
      }
    } else {
      return {
        LeftButton(route, navigator, index, navState) {
          return (
            <TouchableOpacity style={{flex: 1, justifyContent: 'center'}}
              onPress={() => navigator.parentNavigator.push({
                id: 'LoginPage',
                name: 'Login',
                sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
                passProps: {
                  onLoginSuccess: that._onLoginSuccess.bind(that)
                }
              })}>
              <Text style={{color: 'white', margin: 10}}>Connexion</Text>
            </TouchableOpacity>
          );
        },
        RightButton(route, navigator, index, navState) {
          return null;
        },
        Title(route, navigator, index, navState) {
          return (
            <TouchableOpacity style={{flex: 1, justifyContent: 'center'}}>
              <Text style={{color: 'white', margin: 10, fontSize: 16}}>
                Restaurants
              </Text>
            </TouchableOpacity>
          );
        }
      }
    }
  }
  componentDidMount() {
    AppUser.load()
      .then((user) => {

        APIClient = API.createClient(AppConfig.API_BASEURL, user);
        this.updateRestaurants(this.state.distance);

        if (user.hasCredentials()) {
          this._onLoginSuccess(user);
        }

        // APIClient.getWithToken('/api/me/status')
        //   .then((status) => {
        //     console.log(status)
        //   })
        //   .catch((err) => {
        //     console.log(err);
        //   });

      });
  }
  render() {
    return (
      <Navigator
          renderScene={this.renderScene.bind(this)}
          navigator={this.props.navigator}
          navigationBar={
            <Navigator.NavigationBar style={{backgroundColor: '#246dd5'}}
                routeMapper={this.state.navigationBarRouteMapper} />
          } />
    );
  }
  renderScene(route, navigator) {
    return (
      <View style={styles.container}>
        <View style={styles.listView}>
          <View style={styles.loader}>
            <ActivityIndicator
              animating={this.state.loading}
              size="large"
              color="#0000ff"
            />
          </View>
          <ListView
            dataSource={this.state.dataSource}
            enableEmptySections
            renderRow={(restaurant) => {
              return (
                <TouchableHighlight
                  onPress={() => {
                    navigator.parentNavigator.push({
                      id: 'RestaurantPage',
                      name: 'Restaurant',
                      sceneConfig: Navigator.SceneConfigs.FloatFromRight,
                      restaurant: restaurant,
                      passProps: {
                        restaurant: restaurant,
                      }
                    });
                  }}>
                  <View style={styles.listViewItem}>
                    <Text>{restaurant.name}</Text>
                  </View>
                </TouchableHighlight>
              );
            }}
            renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
            renderHeader={() => {
              return (
                <View style={styles.header}>
                  <Text style={{flex: 1}}>Distance : {this.state.distance} m</Text>
                  <Slider
                    style={{flex: 1}}
                    minimumValue={0}
                    maximumValue={2000}
                    step={500}
                    value={this.state.distance}
                    onValueChange={(distance) => {
                      this.updateRestaurants(distance);
                      this.setState({distance: distance});
                    }}/>
                </View>
              );
            }}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF',
    paddingTop: 60,
  },
  listView: {
    flex: 4,
    borderTopColor: "black",
    borderStyle: "solid",
    borderTopWidth: 2
  },
  listViewItem: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  header: {
    flex: 1,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  }
});

module.exports = RestaurantsPage;