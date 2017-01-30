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
import {
  Container,
  Header,
  Title, Content, Footer, FooterTab, Button, Icon } from 'native-base';
import _ from 'underscore';
import { API } from 'coopcycle-js';

import theme from '../theme/coopcycle';

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
      distance: 2000,
      loading: false,
      dataSource: ds.cloneWithRows(restaurants),
      user: null
    };
  }
  componentDidMount() {
    AppUser.load()
      .then((user) => {
        APIClient = API.createClient(AppConfig.API_BASEURL, user);
        if (!this.props.restaurants) {
          this.updateRestaurants(this.state.distance);
        }

        if (user.hasCredentials()) {
          this._onLoginSuccess(user);
        }
      });
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
    this.setState({ user });
  }
  _onLogout() {
    this.setState({ user: null });
  }
  render() {
    return (
      <Navigator
          renderScene={this.renderScene.bind(this)}
          navigator={this.props.navigator} />
    );
  }
  renderScene(route, navigator) {

    let topLeftBtn;
    let topRightBtn = (
      <Button transparent> </Button>
    );
    if (this.state.user) {
      topLeftBtn = (
        <Button transparent onPress={() => navigator.parentNavigator.push({
          id: 'AccountPage',
          name: 'Account',
          sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
          passProps: {
            onLogout: this._onLogout.bind(this)
          }
        })}>
          <Icon name="ios-menu" />
        </Button>
      )
    } else {
      topLeftBtn = (
        <Button transparent onPress={() => navigator.parentNavigator.push({
          id: 'LoginPage',
          name: 'Login',
          sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
          passProps: {
            onLoginSuccess: this._onLoginSuccess.bind(this)
          }
        })}>
          <Text>Connexion</Text>
        </Button>
      )
    }

    if (this.state.user && (this.state.user.hasRole('ROLE_COURIER') || this.state.user.hasRole('ROLE_ADMIN'))) {
      topRightBtn = (
        <Button transparent onPress={() => navigator.parentNavigator.push({
          id: 'CourierPage',
          name: 'Courier',
          sceneConfig: Navigator.SceneConfigs.FloatFromRight,
          passProps: {
            user: this.state.user
          }
        })}>
          <Icon name="ios-bicycle" />
        </Button>
      )
    }

    return (
      <Container>
        <Header>
          {topLeftBtn}
          <Title>Restaurants</Title>
          {topRightBtn}
        </Header>
        <Content theme={theme}>
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
          <View style={styles.loader}>
            <ActivityIndicator
              animating={this.state.loading}
              size="large"
              color="#0000ff"
            />
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
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
});

module.exports = RestaurantsPage;