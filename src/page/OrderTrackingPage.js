import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Navigator,
  TouchableHighlight,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  Container,
  Header,
  Left, Right, Body,
  Title, Content, Footer, Button, Icon, List, ListItem, Text, Radio
} from 'native-base';
import theme from '../theme/coopcycle';

import { API } from 'coopcycle-js';

import MapView from 'react-native-maps';
import Polyline from 'polyline';
import _ from 'underscore';

const DirectionsAPI = require('../DirectionsAPI');
const AppConfig = require('../AppConfig');

const LATITUDE_DELTA = 0.0722;
const LONGITUDE_DELTA = 0.0221;

const COURIER_COORDS = {
  latitude: 48.872178,
  longitude: 2.331797
};

class OrderTrackingPage extends Component {

  map = undefined;

  constructor(props) {
    super(props);

    this.state = {
      region: {
        ...COURIER_COORDS,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      polylineCoords: [],
      markers: [{
        key: 'restaurant',
        identifier: 'restaurant',
        coordinate: this.props.order.restaurant.geo,
        pinColor: 'red',
      }, {
        key: 'deliveryAddress',
        identifier: 'deliveryAddress',
        coordinate: this.props.order.deliveryAddress.geo,
        pinColor: 'green',
      }],
      position: undefined,
      loading: false,
      loadingMessage: 'Connexion au serveur…',
      backButton: props.hasOwnProperty('backButton') ? props.backButton : true
    };
  }
  componentDidMount() {
    setTimeout(() => this.map.fitToElements(true), 1000);
  }
  render() {
    return (
      <Navigator
          renderScene={this.renderScene.bind(this)}
          navigator={this.props.navigator} />
    );
  }
  renderScene(route, navigator) {

    var leftButton = ( <View /> );
    var rightButton = ( <View /> );

    if (this.state.backButton) {
      var leftButton = (
        <Button transparent onPress={() => navigator.parentNavigator.pop()}>
          <Icon name="ios-arrow-back" />
        </Button>
      );
    } else {
      var rightButton = (
        <Button transparent onPress={() => {
          navigator.parentNavigator.resetTo({
            id: 'RestaurantsPage',
            name: 'Restaurants',
            sceneConfig: Navigator.SceneConfigs.FloatFromRight
          });
        }}>
          Restaurants
        </Button>
      );
    }

    return (
      <Container theme={theme}>
        <Header>
          <Left>{ leftButton }</Left>
          <Body><Title>Commande</Title></Body>
          <Right>{ rightButton }</Right>
        </Header>
        <Content contentContainerStyle={ { flex: 1, justifyContent: 'center', alignItems: 'center' } }>
          <MapView
            ref={ref => { this.map = ref; }}
            style={styles.map}
            initialRegion={this.state.region}
            region={this.state.region}
            zoomEnabled
            showsUserLocation
            loadingEnabled
            loadingIndicatorColor={"#666666"}
            loadingBackgroundColor={"#eeeeee"}>
            {this.state.markers.map(marker => (
              <MapView.Marker
                identifier={marker.identifier}
                key={marker.key}
                coordinate={marker.coordinate}
                pinColor={marker.pinColor}
                title={marker.title}
                description={marker.description} />
            ))}
            <MapView.Polyline
              coordinates={this.state.polylineCoords}
              strokeWidth={4}
              strokeColor="#19B5FE"
             />
          </MapView>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF',
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.4)'
  },
  orderOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.3)',
  },
  buttonBlue: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 4,
    backgroundColor: "#246dd5",
  },
  buttonGreen: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 4,
    backgroundColor: "#2ecc71",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  }
});

module.exports = OrderTrackingPage;