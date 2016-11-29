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

const DirectionsAPI = require('../DirectionsAPI');
const OrdersAPI = require('../OrdersAPI');
const ResourcesAPI = require('../ResourcesAPI');
const Auth = require('../Auth');
const AppConfig = require('../AppConfig');

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
  map = undefined;
  position = undefined;

  constructor(props) {
    super(props);
    this.state = {
      region: {
        ...COURIER_COORDS,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      polylineCoords: [],
      markers: [],
      position: undefined,
      loading: false,
      loadingMessage: 'Connexion au serveur…',
      order: undefined,
      user: undefined,
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
          latitude: destination.latitude,
          longitude: destination.longitude,
        },
        polylineCoords: polylineCoords
      });
      this.map.fitToElements(true);
      console.log(Object.keys(this.map.state));
    });
  }
  _onUpdatePosition(position) {
      this._notifyCoordinates(position.coords);
      if (!this.state.order) {
        this.setState({region: {
          ...this.state.region,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }});
      }
  }
  _connectToWebSocket(user) {
    return new Promise((resolve, reject) => {

      this.user = user || this.user;
      this.ws = new WebSocket(AppConfig.WEBSOCKET_BASEURL + '/realtime', '', {
          Authorization: "Bearer " + user.token
      });

      if (!this.state.loading) {
        this.setState({
          loading: true,
        });
      }

      this.ws.onopen = () => {
        // connection opened

        // TODO Check authentication first, then launch tracking

        console.log('Connected to realtime server !');
        this.isWebSocketOpen = true;

        console.log('Trying to get current position...');
        navigator.geolocation.getCurrentPosition(
          (position) => {

            resolve(position);

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

        this.setState({
          loadingMessage: 'En attente d\'une commande…'
        });
      };

      this.ws.onmessage = (e) => {

        // a message was received
        var message = JSON.parse(e.data);

        if (message.type === 'error') {
          var error = message.error;
          if (error.name === 'TokenExpiredError') {
            this._disconnectFromWebSocket();
            this.props.navigator.push({
              id: 'LoginPage',
              name: 'Login',
              sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
              passProps: {
                onLoginSuccess: () => {
                  Auth.getUser()
                    .then((user) => setTimeout(() => this._connectToWebSocket(user), 500))
                    .catch(() => {});
                }
              }
            })
          }
        }

        if (message.type === 'order') {
          var order = message.order;
          Alert.alert(
            'Nouvelle commande',
            'Une nouvelle commande est disponible',
            [
              {
                text: 'Voir',
                onPress: () => {
                  this.setState({loadingMessage: 'Chargement de la commande…'});
                  OrdersAPI.getOrderById(order.id).then((orderObj) => {
                    this.setState({order: orderObj});
                    this._drawPathToDestination(order);
                  });
                }
              },
            ]
          );
        }

      };

      this.ws.onerror = (e) => {
        // an error occurred
        console.log('WS ERROR', e.message);
        reject();
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
    });
  }
  _disconnectFromWebSocket() {
    if (this.watchID) {
      console.log('Clearing geolocation')
      navigator.geolocation.clearWatch(this.watchID);
    }
    if (this.ws) {
      console.log('Closing WebSocket');
      this.ws.onclose = function () {}; // disable onclose handler first
      this.ws.close();
      this.isWebSocketOpen = false;
    }
  }
  _notifyCoordinates(coordinates) {
    this.position = coordinates;
    if (this.isWebSocketOpen) {
      console.log(this.user.token);
      this.ws.send(JSON.stringify({
        type: "updateCoordinates",
        coordinates: coordinates,
        user: {
          id: this.user.id,
        }
      }));
    }
  }
  _acceptOrder() {
    this._disconnectFromWebSocket();
    this.setState({
      loading: true,
      loadingMessage: "Veuillez patienter…"
    });
    OrdersAPI.acceptOrder(this.state.order).then((order) => {
      this._connectToWebSocket();
      this.setState({
        order: order,
        loading: false,
      });
    });
  }
  _pickOrder() {
    this.setState({
      loading: true,
      loadingMessage: "Veuillez patienter…"
    });
    OrdersAPI.pickOrder(this.state.order).then((order) => {
      this.setState({
        loading: false,
        order: order,
      });
    });
  }
   _deliverOrder() {
    this.setState({
      loading: true,
      loadingMessage: "Veuillez patienter…"
    });
    OrdersAPI.deliverOrder(this.state.order).then((order) => {
      this.setState({
        order: order,
        loading: false,
      });
    });
  }
  _onRegionChange(region) {
    this.setState({region});
  }
  _getNextStatus(order) {
    switch (order.status) {
      case 'PLACED' :
        return {
          text: '✓ Accepter',
          onPress: this._acceptOrder
        }
        break;
      case 'ACCEPTED' :
        return {
          text: '✓ Commande réceptionnée',
          onPress: this._pickOrder
        }
        break;
      case 'PICKED' :
        return {
          text: '✓ Commande livrée',
          onPress: this._deliverOrder
        }
        break;
      case 'DELIVERED' :
        return {
          text: '✓ Bien joué !',
          onPress: () => {}
        }
        break;
    }
  }
  componentDidMount() {
    this.setState({
      loading: true,
      loadingMessage: "Vérification de votre état…"
    });
    Auth
      .getStatus()
      .then((status) => {
        console.log('Status', status);
        if (status === 'AVAILABLE') {
          this.setState({loadingMessage: 'Connexion au serveur…'});
          Auth.getUser()
            .then((user) => setTimeout(() => this._connectToWebSocket(user), 1000))
            .catch(() => {});
        }
        if (status === 'BUSY') {
          this.setState({loadingMessage: 'Récupération de la commande…'});
          Auth.getCurrentOrder().then((order) => {
            this.props.navigator.push({
              id: 'BusyPage',
              name: 'Busy',
              sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
              passProps: {
                order: order,
                onContinue: () => {
                  console.log('Continue order #' + order['@id']);
                  Auth.getUser()
                    .then((user) => {
                      this._connectToWebSocket(user).then(() => {
                        this._drawPathToDestination(order.restaurant.geo);
                        this.setState({
                          order: order,
                          loading: false
                        });
                      });
                    })
                    .catch(() => {});
                }
              }
            });
          });
        }
      });
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
      let nextStatus = this._getNextStatus(this.state.order);
      orderOverlay = (
        <View style={styles.orderOverlay}>
          <Text style={{color: '#fff'}}>{this.state.order.restaurant.name}</Text>
          <Text style={{color: '#fff'}}>{this.state.order.restaurant.streetAddress}</Text>
          <View style={styles.buttonBlue}>
            <TouchableOpacity onPress={nextStatus.onPress.bind(this)}>
              <Text style={{color: "white", fontWeight: "bold"}}>{nextStatus.text}</Text>
            </TouchableOpacity>
          </View>
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
          onRegionChange={this._onRegionChange.bind(this)}
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
          onPress={() => {
            Alert.alert(
              'Êtes-vous sûr ?',
              null,
              [
                {text: 'Annuler', onPress: () => {}},
                {text: 'Quitter', onPress: () => navigator.parentNavigator.pop()},
              ]
            );
          }}>
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

module.exports = CourierPage;