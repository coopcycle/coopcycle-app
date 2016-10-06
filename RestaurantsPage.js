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

const GeoUtils = require('./GeoUtils');

const HOME_COORDS = {
  latitude: 48.875973,
  longitude: 2.370039
};

class RestaurantsPage extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      modalVisible: false,
      distance: 2000,
      loading: false,
      dataSource: ds.cloneWithRows([
        // 'John', 'Joel', 'James', 'Jimmy', 'Jackson', 'Jillian', 'Julie', 'Devin'
      ])
    };
  }
  getRestaurants(distance) {
    this.setState({
      loading: true
    });
    return new Promise((resolve, reject) => {;
      fetch('http://coursiers.dev/restaurants?coordinate='+HOME_COORDS.latitude+','+HOME_COORDS.longitude+'&distance='+distance)
      .then((response) => {
        return response.json();
      }).then((json) => {
        resolve(json);
      }).catch((err) => {
        console.log(err);
      });
    });
  }

  updateRestaurants(distance) {
    this.getRestaurants(distance).then((data) => {
      var restaurants = _.map(data['hydra:member'], (restaurant) => {
        restaurant.geo = GeoUtils.parsePoint(restaurant.geo)
        return restaurant;
      });
      this.setState({
        loading: false,
        dataSource: this.state.dataSource.cloneWithRows(restaurants)
      });
    });
  }

  componentDidMount() {
    this.updateRestaurants(this.state.distance);
  }

  render() {
    return (
      <Navigator
          renderScene={this.renderScene.bind(this)}
          navigator={this.props.navigator}
          navigationBar={
            <Navigator.NavigationBar style={{backgroundColor: '#246dd5'}}
                routeMapper={NavigationBarRouteMapper} />
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

var NavigationBarRouteMapper = {
  LeftButton(route, navigator, index, navState) {
    return (
      <TouchableOpacity style={{flex: 1, justifyContent: 'center'}}
          onPress={() => navigator.parentNavigator.pop()}>
        <Text style={{color: 'white', margin: 10,}}>Retour</Text>
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
};

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