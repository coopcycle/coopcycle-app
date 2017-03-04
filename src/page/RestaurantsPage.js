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

import theme from '../theme/coopcycle';

const HOME_COORDS = {
  latitude: 48.875973,
  longitude: 2.370039
};

class RestaurantsPage extends Component {
  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      distance: 2000,
      loading: false,
      dataSource: ds.cloneWithRows(props.restaurants || []),
      user: props.user || null
    };
  }
  componentDidMount() {
    if (!this.props.restaurants) {
      this.updateRestaurants(this.state.distance);
    }
  }
  getRestaurants(distance) {
    this.setState({
      loading: true
    });
    return this.props.client
      .request('GET', '/api/restaurants?coordinate=' + [HOME_COORDS.latitude, HOME_COORDS.longitude] + '&distance=' + distance)
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
  _onLogout(navigator) {
    this.setState({ user: null });
    navigator.parentNavigator.pop();
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
    if (this.state.user.isAuthenticated()) {
      topLeftBtn = (
        <Button transparent onPress={() => navigator.parentNavigator.push({
          id: 'AccountPage',
          name: 'Account',
          sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
          passProps: {
            onLogout: this._onLogout.bind(this, navigator)
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

    if (this.state.user.isAuthenticated() && (this.state.user.hasRole('ROLE_COURIER') || this.state.user.hasRole('ROLE_ADMIN'))) {
      topRightBtn = (
        <Button transparent onPress={() => navigator.parentNavigator.push({
          id: 'CourierPage',
          name: 'Courier',
          sceneConfig: Navigator.SceneConfigs.FloatFromRight
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