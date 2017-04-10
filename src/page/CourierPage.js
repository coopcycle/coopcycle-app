import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Navigator,
  TouchableHighlight,
  TouchableOpacity,
  Alert,
  Modal,
  ActivityIndicator,
  Dimensions,
  Platform,
} from 'react-native';
import {
  Container,
  Header,
  Left, Right, Body,
  Title, Content, Footer, FooterTab, Button, Icon, Text
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import MapView from 'react-native-maps';
import theme from '../theme/coopcycle';

import Countdown from '../Countdown';
import DirectionsAPI from '../DirectionsAPI';

const LATITUDE_DELTA = 0.0722;
const LONGITUDE_DELTA = 0.0221;

class CourierPage extends Component {

  ws = undefined;
  watchID = undefined;
  map = undefined;
  directionsAPI = null;

  constructor(props) {
    super(props);
    this.directionsAPI = new DirectionsAPI(this.props.client)
    this.state = {
      status: null,
      region: null,
      polylineCoords: [],
      markers: [],
      position: null,
      loading: false,
      loadingMessage: 'Connexion au serveur…',
      order: null,
      modalVisible: false,
      watchID: null,
      connected: false,
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
    return this.directionsAPI.getRoute({
      origin: this.state.position,
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
  declineOrder() {
    this.setState({
      loading: true,
      loadingMessage: "Veuillez patienter…"
    });
    this.props.client.put(this.state.order['@id'] + '/decline', {})
      .then((order) => {
        this.setState({
          loadingMessage: 'En attente d\'une commande…',
          order: null
        });
        this.resetMap();
      });
  }
  acceptOrder() {
    this.setState({
      loading: true,
      loadingMessage: "Veuillez patienter…"
    });
    this.props.client.put(this.state.order['@id'] + '/accept', {})
      .then((order) => {
        this.setState({
          order: order,
          loading: false,
        });
      });
  }
  pickOrder() {
    this.setState({
      loading: true,
      loadingMessage: "Veuillez patienter…"
    });
    this.props.client.put(this.state.order['@id'] + '/pick', {})
      .then((order) => {
        this._drawPathToDestination(order.deliveryAddress.geo)
          .then(() => this.setState({ order: order, loading: false }));
      });
  }
  deliverOrder() {
    this.setState({
      loading: true,
      loadingMessage: "Veuillez patienter…"
    });
    this.props.client.put(this.state.order['@id'] + '/deliver', {})
      .then((order) => {
        this.setState({
          order: null,
          loadingMessage: 'En attente d\'une commande…'
        });
        this.resetMap();
      });
  }
  _onRegionChange(region) {
    this.setState({region});
  }
  getStatus() {
    return this.props.client.get('/api/me/status').then((data) => {
      console.log(data);
      return data;
    });
  }
  loadOrderById(id) {
    this.setState({
      loading: true,
      loadingMessage: 'Chargement de la commande…'
    });
    this.props.client.get('/api/orders/' + id).then((order) => {
      this.setState({ loadingMessage: "Calcul de l'itinéraire…" });
      const destination = order.status === 'PICKED' ? order.deliveryAddress.geo : order.restaurant.geo;
      this._drawPathToDestination(destination)
        .then(() => this.setState({
          loading: false,
          order: order
        }));
    });
  }
  getCurrentPosition() {
    this.setState({ loadingMessage: 'Calcul de votre position…' });
    return new Promise((resolve, reject) => {

      let options;
      if (Platform.OS === 'ios') {
        options = {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 5000
        }
      } else {
        options = {
          enableHighAccuracy: false
        }
      }

      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) => reject(error),
        options
      );
    });
  }
  watchPosition() {
    return new Promise((resolve, reject) => {
      const watchID = navigator.geolocation.watchPosition(
        (position) => this.onPositionUpdated(position.coords),
        (error) => console.log
      );
      this.setState({
        loadingMessage: 'Suivi de votre position…',
        watchID: watchID
      });
      resolve();
    });
  }
  clearWatch() {
    const { watchID } = this.state;
    navigator.geolocation.clearWatch(watchID);
    this.setState({ watchID: null })
  }
  onPositionUpdated(latLng) {

    latLng = latLng || this.state.position;

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({
        type: "updateCoordinates",
        coordinates: {
          latitude: latLng.latitude,
          longitude: latLng.longitude
        },
      });
      this.ws.send(message);
    }

    this.setState({ position: latLng });
  }
  zoomTo(coords) {
    let region = {
      latitude: coords.latitude,
      longitude: coords.longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    }
    this.map.animateToRegion(region);
    // this.map.animateToCoordinate(coords, 1000)
  }
  resetMap() {
    this.setState({
      markers: [],
      polylineCoords: []
    });
  }
  connectToWebSocket() {

    this.setState({
      loadingMessage: 'Connexion au serveur…'
    });

    return new Promise((resolve, reject) => {

      const webSocketBaseURL = this.props.server.replace('http', 'ws');

      this.ws = new WebSocket(webSocketBaseURL + '/realtime', '', {
          Authorization: "Bearer " + this.props.user.token
      });

      this.ws.onopen = () => {
        console.log('Connected to dispatch service !');
        this.onPositionUpdated();
        this.setState({
          connected: true,
          loadingMessage: 'En attente d\'une commande…'
        });
        resolve();
      };

      this.ws.onmessage = this.onWebSocketMessage.bind(this);

      // When an error occurs, the WebSocket is closed
      // So this is managed by the onclose handler below
      this.ws.onerror = (e) => {
        reject(e.message);
      };

      this.ws.onclose = this.onWebSocketClose.bind(this);
    });
  }
  onWebSocketMessage(e) {

    var message = JSON.parse(e.data);
    console.log('Message received!', message);

    if (message.type === 'order') {
      this.loadOrderById(message.order.id);
    }

    if (message.type === 'accept-timeout') {
      this.setState({
        order: null
      });
      this.resetMap();
    }
  }
  onWebSocketClose(e) {
    console.log('Connection closed !', e.code, e.message);
    this.setState({
      connected: false,
      loadingMessage: 'Connexion perdue ! Reconnexion…'
    });
    setTimeout(() => {
      this.connectToWebSocket()
        .catch((err) => {
          console.log(err)
        });
    }, 1000);
  }
  componentDidMount() {
    setTimeout(() => {

      this.setState({
        loading: true,
        loadingMessage: "Authentification…"
      });

      this.getStatus()
        .then((data) => {
          this
            .getCurrentPosition()
            .then((position) => {
              this.onPositionUpdated(position.coords);

              return position;
            })
            .then((position) => this.zoomTo(position.coords))
            .then(this.watchPosition.bind(this))
            .then(this.connectToWebSocket.bind(this))
            .then(() => {
              if (data.status === 'DELIVERING') {
                this.loadOrderById(data.order.id);
              }
            })
            .catch((err) => {
              console.log(err)
              if (err.message) {
                if (err.message === 'Location request timed out') {
                  // TODO Display error message
                }
              }
            });
        })
        .catch((err) => {
          console.log(err)
        });

    }, 2500);
  }
  componentWillUnmount() {
    if (this.ws) {
      this.ws.onclose = function () {}; // disable onclose handler first
      this.ws.close();
    }
    this.clearWatch();
  }
  render() {
    return (
      <Navigator
        renderScene={this.renderScene.bind(this)}
        navigator={this.props.navigator} />
    );
  }
  renderTopRow() {
    return (
      <Row>
        <MapView
          ref={ref => { this.map = ref; }}
          style={ styles.map }
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
      </Row>
    )
  }
  renderScene(route, navigator) {

    const { height, width } = Dimensions.get('window');

    const grey = '#95A5A6';
    const green = '#2ECC71';

    const halfScreenHeight = (height - 64) / 2;
    const isModalVisible = this.state.order !== null;

    let loader = <View />;

    if (this.state.loading) {

      let loaderStyle = {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(52, 52, 52, 0.4)'
      };
      if (isModalVisible) {
        loaderStyle = { ...loaderStyle, height: halfScreenHeight };
      }

      loader = (
        <View style={loaderStyle}>
          <ActivityIndicator
            animating={true}
            size="large"
            color="#fff"
          />
          <Text style={{color: '#fff'}}>{this.state.loadingMessage}</Text>
        </View>
      );
    }

    const connectedButton = (
      <Button transparent>
        <Icon name="wifi" style={{ fontSize: 30, color: this.state.connected ? green : grey }} />
      </Button>
    )

    const isTracking = this.state.watchID || this.state.position;
    const trackingButton = (
      <Button transparent>
        <Icon name="navigate" style={{ fontSize: 30, color: isTracking ? green : grey }} />
      </Button>
    );

    let bottomRow = ( <View /> )

    if (this.state.order) {

      let nextAddress = this.state.order.status === 'PICKED' ?
        this.state.order.deliveryAddress.streetAddress : this.state.order.restaurant.streetAddress;

      let countdown = ( <View /> )

      let modalButtons = ( <View /> );
      if (this.state.order.status === 'WAITING') {
        modalButtons = (
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
            <Button danger disabled={this.state.loading} onPress={this.declineOrder.bind(this)}>
              <Text>Refuser</Text>
            </Button>
            <Button success disabled={this.state.loading} onPress={this.acceptOrder.bind(this)}>
              <Text>Accepter</Text>
            </Button>
          </View>
        );
        countdown = (
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Countdown duration={30} onComplete={() => console.log('TIMEOUT')} />
          </View>
        );
      }
      if (this.state.order.status === 'ACCEPTED') {
        modalButtons = (
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
            <Button success disabled={this.state.loading} onPress={this.pickOrder.bind(this)}>
              <Text>Commande récupérée</Text>
            </Button>
          </View>
        );
      }
      if (this.state.order.status === 'PICKED') {
        modalButtons = (
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
            <Button success disabled={this.state.loading} onPress={this.deliverOrder.bind(this)}>
              <Text>Commande livrée</Text>
            </Button>
          </View>
        );
      }

      bottomRow = (
        <Row style={{ padding: 10 }}>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: 10 }}>{ this.state.order.restaurant.name }</Text>
              <Text>{ nextAddress }</Text>
            </View>
            { countdown }
            { modalButtons }
          </View>
        </Row>
      );
    }

    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => {
              Alert.alert('Êtes-vous sûr ?', null, [
                { text: 'Annuler', onPress: () => {} },
                { text: 'Quitter', onPress: () => navigator.parentNavigator.pop() },
              ]);
            }}>
              <Icon name="exit" />
            </Button>
          </Left>
          <Body>
            <Title>Commandes</Title>
          </Body>
          <Right>
            { connectedButton }
            { trackingButton }
          </Right>
        </Header>
        <Grid>
          { this.renderTopRow() }
          { bottomRow }
          { loader }
        </Grid>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.4)'
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

module.exports = CourierPage;