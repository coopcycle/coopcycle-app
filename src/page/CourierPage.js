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

const AppUser = require('../AppUser');
const APIClient = null;

class CourierPage extends Component {

  ws = undefined;
  watchID = undefined;
  map = undefined;

  constructor(props) {
    super(props);

    APIClient = API.createClient(AppConfig.API_BASEURL, props.user)

    this.state = {
      status: null,
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
    return DirectionsAPI.getRoute({
      origin: this.position,
      destination: destination,
    }).then((route) => {
      this.setState({
        markers: [marker],
        // region: {
        //   ...this.state.region,
        //   latitude: destination.latitude,
        //   longitude: destination.longitude,
        // },
        polylineCoords: route
      });
      this.map.fitToElements(true);
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
  _notifyCoordinates(coordinates) {
    this.position = coordinates;
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: "updateCoordinates",
        coordinates: coordinates,
      }));
    }
  }
  _connectToWebSocket() {
    return new Promise((resolve, reject) => {

      this.ws = new WebSocket(AppConfig.WEBSOCKET_BASEURL + '/realtime', '', {
          Authorization: "Bearer " + this.props.user.token
      });

      if (!this.state.loading) {
        this.setState({
          loading: true,
        });
      }

      this.ws.onopen = () => {

        console.log('Connected to dispatch service !');

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

        if (this.state.status === 'AVAILABLE') {
          this.setState({
            loadingMessage: 'En attente d\'une commande…'
          });
        }
      };

      this.ws.onmessage = (e) => {

        // a message was received
        var message = JSON.parse(e.data);

        console.log('Message received!', message);

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
                  APIClient.get('/api/orders/' + order.id).then((orderObj) => {
                    console.log(orderObj);
                    this.setState({loadingMessage: "Calcul de l'itinéraire…"});
                    this._drawPathToDestination(orderObj.restaurant.geo)
                      .then(() => this.setState({order: orderObj, loading: false}));
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
        this.setState({
          loadingMessage: 'Connexion perdue ! Reconnexion…'
        });
        setTimeout(() => {
          this._connectToWebSocket();
        }, 500);
      };
    });
  }
  _disconnectFromWebSocket() {
    if (this.watchID) {
      console.log('Clearing geolocation');
      navigator.geolocation.clearWatch(this.watchID);
    }
    if (this.ws) {
      console.log('Closing WebSocket');
      this.ws.onclose = function () {}; // disable onclose handler first
      this.ws.close();
    }
  }
  _acceptOrder() {
    this.setState({
      loading: true,
      loadingMessage: "Veuillez patienter…"
    });
    APIClient.put(this.state.order['@id'] + '/accept', {})
      .then((order) => {
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
    APIClient.put(this.state.order['@id'] + '/pick', {})
      .then((order) => {
        this._drawPathToDestination(order.deliveryAddress.geo)
          .then(() => this.setState({order: order, loading: false}));
      });
  }
  _deliverOrder() {
    this._disconnectFromWebSocket();
    this.setState({
      loading: true,
      loadingMessage: "Veuillez patienter…"
    });
    APIClient.put(this.state.order['@id'] + '/deliver', {})
      .then((order) => {
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
      case 'WAITING' :
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
          onPress: () => {
            this.setState({
              loading: true,
              loadingMessage: "Vérification de votre état…"
            });
            APIClient.get('/api/me/status')
              .then((data) => {
                if (data.status === 'AVAILABLE') {
                  this._connectToWebSocket();
                  this.setState({
                    markers: [],
                    order: null,
                    polylineCoords: [],
                  });
                }
              });
          }
        }
        break;
    }
  }
  componentDidMount() {
    this.setState({
      loading: true,
      loadingMessage: "Vérification de votre état…"
    });
    APIClient.get('/api/me/status')
      .then((data) => {
        if (data.status === 'AVAILABLE') {
          this.setState({
            status: data.status,
            loadingMessage: 'Connexion au serveur…'
          });
          setTimeout(() => this._connectToWebSocket(), 1000);
        }

        if (data.status === 'DELIVERING') {
          this.setState({loadingMessage: 'Récupération de la commande…'});
          APIClient.get('/api/orders/' + data.order.id)
            .then((order) => {
              this.props.navigator.push({
                id: 'BusyPage',
                name: 'Busy',
                sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
                passProps: {
                  order: order,
                  onContinue: () => {
                    console.log('Continue order ' + order['@id']);
                    this.setState({loadingMessage: "Calcul de l'itinéraire…"});
                    this._connectToWebSocket()
                      .then(() => this._drawPathToDestination(order.restaurant.geo))
                      .then(() => {
                        this.setState({
                          order: order,
                          loading: false
                        });
                      });
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
      let nextAddress = this.state.order.status === 'PICKED' ?
        this.state.order.deliveryAddress.streetAddress : this.state.order.restaurant.streetAddress;
      orderOverlay = (
        <View style={styles.orderOverlay}>
          <Text style={{color: '#fff'}}>{this.state.order.restaurant.name}</Text>
          <Text style={{color: '#fff'}}>{nextAddress}</Text>
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