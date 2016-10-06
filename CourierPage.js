import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Navigator,
  TouchableHighlight,
  TouchableOpacity,
  Alert,
} from 'react-native';

import MapView from 'react-native-maps';
import Polyline from 'polyline';
import _ from 'underscore';

const DirectionsAPI = require('./src/DirectionsAPI');
const OrdersAPI = require('./src/OrdersAPI');
const ResourcesAPI = require('./src/ResourcesAPI');
const GeoUtils = require('./GeoUtils');

const LATITUDE_DELTA = 0.0722;
const LONGITUDE_DELTA = 0.0221;

const COURIER_COORDS = {
  latitude: 48.872178,
  longitude: 2.331797
};

class CourierPage extends Component {
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
    };
  }
  componentWillMount() {
    this.ws = new WebSocket('ws://coursiers.dev/realtime');
    this.ws.onopen = () => {
      // connection opened
      console.log('connection onopen')
      this.ws.send('something'); // send a message
    };

    this.ws.onmessage = (e) => {
      // a message was received
      console.log(e.data);
      var data = JSON.parse(e.data);
      if (data.channel === 'orders') {
        // Alert.alert(
        //   'Nouvelle livraison',
        //   'Une nouvelle livraison est disponible',
        // );
        this.setState({
          courier: {
            latitude: data.message.latitude,
            longitude: data.message.longitude,
          }
        });
        // this.map.fitToSuppliedMarkers(['courier'], true)
      }
    };

    this.ws.onerror = (e) => {
      // an error occurred
      console.log('WS ERROR', e.message);
    };

    this.ws.onclose = (e) => {
      // connection closed
      console.log(e.code, e.reason);
    };
  }
  componentWillUnmount() {
    console.log('Closing WebSocket');
    this.ws.close();
  }
  componentDidMount() {

    this.watchID = navigator.geolocation.watchPosition((position) => {
      this._notifyCoordinates(position.coords);
    });

    return;

    let order;
    OrdersAPI.getOrders()
      .then((orders) => {
        order = orders['hydra:member'][0];
        return ResourcesAPI.getResource(order.restaurant);
      })
      .then((restaurant) => {
        restaurant.geo = GeoUtils.parsePoint(restaurant.geo);
        order.restaurant = restaurant
        return ResourcesAPI.getResource(order.customer);
      })
      .then((customer) => {
        customer.deliveryAddress = _.map(customer.deliveryAddress, (deliveryAddress) => {
          deliveryAddress.geo = GeoUtils.parsePoint(deliveryAddress.geo);
          return deliveryAddress;
        });
        order.customer = customer

        let markers = [];
        markers.push({
          key: 'restaurant',
          identifier: 'restaurant',
          coordinate: order.restaurant.geo,
          pinColor: 'blue',
        });
        markers.push({
          key: 'customer',
          identifier: 'customer',
          coordinate: order.customer.deliveryAddress[0].geo,
          pinColor: 'red',
        });
        this.setState({markers});
        this.map.fitToSuppliedMarkers(['courier', 'restaurant', 'customer'], true);

        DirectionsAPI.getDirections({
          origin: COURIER_COORDS,
          destination: order.customer.deliveryAddress[0].geo,
          waypoints: order.restaurant.geo,
        }).then((data) => {
          // console.log(data.routes[0].legs.length)
          // console.log(data.routes[0].legs[0]);
          console.log(data.routes[0].legs[0].duration.text);
          console.log(data.routes[0].legs[1].duration.text);
          let polylineCoords = DirectionsAPI.toPolylineCoordinates(data);
          this.setState({polylineCoords});
        })
      });
  }
  _notifyCoordinates(coordinates) {
    var request = new Request('http://coursiers.dev/couriers/1/coordinates', {
      method: 'POST',
      body: JSON.stringify({coordinates: coordinates})
    });
    return fetch(request)
      .then((response) => {
        return response.json();
      });
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
      <View style={{flex: 1, alignItems: 'center', justifyContent:'center'}}>
        <MapView
          ref={ref => { this.map = ref; }}
          style={styles.map}
          initialRegion={this.state.region}
          zoomEnabled
          showsUserLocation
          loadingEnabled
          loadingIndicatorColor={"#666666"}
          loadingBackgroundColor={"#eeeeee"}>
          <MapView.Marker
            identifier='courier'
            coordinate={this.state.courier}
            pinColor="green"
            flat />
          {this.state.markers.map(marker => (
            <MapView.Marker
              identifier={marker.identifier}
              key={marker.key}
              coordinate={marker.coordinate}
              pinColor={marker.pinColor} />
          ))}
          <MapView.Polyline
            coordinates={this.state.polylineCoords}
            strokeWidth={4}
            strokeColor="#19B5FE"
           />
        </MapView>
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
  map: {
    ...StyleSheet.absoluteFillObject,
  }
});

module.exports = CourierPage;