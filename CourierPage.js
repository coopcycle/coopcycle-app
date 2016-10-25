import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Navigator,
  TouchableHighlight,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';

import MapView from 'react-native-maps';
import Polyline from 'polyline';
import _ from 'underscore';

const DirectionsAPI = require('./src/DirectionsAPI');
const OrdersAPI = require('./src/OrdersAPI');
const ResourcesAPI = require('./src/ResourcesAPI');
const GeoUtils = require('./GeoUtils');
const Auth = require('./src/Auth');

const LATITUDE_DELTA = 0.0722;
const LONGITUDE_DELTA = 0.0221;

const COURIER_COORDS = {
  latitude: 48.872178,
  longitude: 2.331797
};

class CourierPage extends Component {

  ws = undefined;
  isWebSocketOpen = false;
  watchID = undefined;
  user = undefined;
  map = undefined;

  constructor(props) {
    super(props);
    this.state = {
      region: {
        ...COURIER_COORDS,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      courier: COURIER_COORDS,
      restaurant: props.restaurant,
      customer: props.customer,
      polylineCoords: [],
      markers: [],
      position: undefined,
      loading: false,
      loadingMessage: 'Connexion au serveur…',
      order: undefined,
    };
  }
  _drawPathToDestination(destination) {
    let marker = {
      key: 'order',
      identifier: 'order',
      coordinate: destination,
      pinColor: 'green',
      title: 'Foo',
      description: 'Lorem ipsum',
    }
    DirectionsAPI.getDirections({
      origin: this.position,
      destination: destination,
    }).then((data) => {
      let polylineCoords = DirectionsAPI.toPolylineCoordinates(data);
      this.setState({
        loading: false,
        markers: [marker],
        region: {
          ...this.state.region,
          destination,
        },
        polylineCoords: polylineCoords
      });
      this.map.fitToElements(true);
      this.updateRegion = false;
    });
  }
  _onUpdatePosition(position) {
      console.log('Position updated', position)
      this._notifyCoordinates(position.coords);
      if (this.updateRegion) {
        this.setState({region: {
          ...this.state.region,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }});
      }
  }
  _connectToWebSocket(user) {

    this.user = user;
    this.ws = new WebSocket('ws://coursiers-velo.xyz/realtime');

    if (!this.state.loading) {
      this.setState({
        loading: true,
      });
    }

    this.ws.onopen = () => {
      // connection opened
      console.log('Connected to realtime server !');
      this.isWebSocketOpen = true;

      console.log('Trying to get current position...');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this._onUpdatePosition(position);

          console.log('Start watching position...');
          this.watchID = navigator.geolocation.watchPosition(this._onUpdatePosition.bind(this));
        },
        (error) => console.log('ERROR : getCurrentPosition', JSON.stringify(error)),
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 1000
        }
      );

      // console.log('Watching position...');
      // this.watchID = navigator.geolocation.watchPosition((position) => {
      //   console.log('watchPosition...')
      //   this._notifyCoordinates(position.coords);
      //   if (this.updateRegion) {
      //     this.setState({region: {
      //       ...this.state.region,
      //       latitude: position.coords.latitude,
      //       longitude: position.coords.longitude,
      //     }});
      //   }
      // });

      this.setState({
        loadingMessage: 'En attente d\'une commande…'
      });
    };

    this.ws.onmessage = (e) => {

      // a message was received
      var order = JSON.parse(e.data);

      Alert.alert(
        'Nouvelle commande',
        'Une nouvelle commande est disponible',
        [
          {
            text: 'Voir',
            onPress: () => {
              this.setState({loadingMessage: 'Chargement de la commande…'});
              OrdersAPI.getOrderById(order.id).then((orderObj) => {
                this._drawPathToDestination(order);
                this.setState({order: orderObj});
              });
            }
          },
        ]
      );

    };

    this.ws.onerror = (e) => {
      // an error occurred
      console.log('WS ERROR', e.message);
    };

    this.ws.onclose = (e) => {
      console.log('Connection closed !', e.code, e.message);
      navigator.geolocation.clearWatch(this.watchID);
      this.isWebSocketOpen = false;
      this.setState({
        loadingMessage: 'Connexion perdue ! Reconnexion…'
      });
      setTimeout(() => {
        this._connectToWebSocket(user);
      }, 500);
    };
  }
  _notifyCoordinates(coordinates) {
    this.position = coordinates;
    console.log(this.isWebSocketOpen);
    if (this.isWebSocketOpen) {
      this.ws.send(JSON.stringify({
        type: "updateCoordinates",
        coordinates: coordinates,
        token: this.user.token,
        user: {
          id: this.user.id,
        }
      }));
    }
  }
  componentDidMount() {
    Auth.getUser()
      .then((user) => setTimeout(() => this._connectToWebSocket(user), 2000))
      .catch(() => {});
  }
  componentWillUnmount() {
    if (this.ws) {
      console.log('Closing WebSocket');
      this.ws.onclose = function () {}; // disable onclose handler first
      this.ws.close();
    }
    if (this.watchID) {
      navigator.geolocation.clearWatch(this.watchID);
    }
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
    let loader = <View />;
    let orderOverlay = <View />;
    if (this.state.loading) {
      loader = (
        <View style={styles.loader}>
          <ActivityIndicator
            animating={true}
            size="large"
            color="#fff"
          />
          <Text style={{color: '#fff'}}>{this.state.loadingMessage}</Text>
        </View>
      );
    }
    if (this.state.order) {
      orderOverlay = (
        <View style={styles.orderOverlay}>
          <Text style={{color: '#fff'}}>{this.state.order.restaurant.name}</Text>
          <Text style={{color: '#fff'}}>{this.state.order.restaurant.streetAddress}</Text>
        </View>
      );
    }
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent:'center'}}>
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
        {loader}
        {orderOverlay}
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
          Coursiers
        </Text>
      </TouchableOpacity>
    );
  }
};

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
    backgroundColor: 'rgba(52, 52, 52, 0.3)'
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  }
});

module.exports = CourierPage;