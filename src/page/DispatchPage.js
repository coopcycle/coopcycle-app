import React, { Component } from 'react';
import {
  StyleSheet,
  View,
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
import { translate } from 'react-i18next'
// import Countdown from '../Countdown';
import DirectionsAPI from '../DirectionsAPI';

const LATITUDE_DELTA = 0.0722;
const LONGITUDE_DELTA = 0.0221;

const COLOR_GREY = '#95A5A6'
const COLOR_GREEN = '#2ECC71'

class DispatchPage extends Component {

  ws = undefined;
  map = undefined;
  directionsAPI = null;

  static navigationOptions = ({ navigation }) => {

    const { params } = navigation.state;

    return {
      headerRight: (
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end' }}>
          <Button transparent>
            <Icon name="wifi" style={{ color: params.connected ? COLOR_GREEN : COLOR_GREY }} />
          </Button>
          <Button transparent>
            <Icon name="navigate" style={{ color: params.tracking ? COLOR_GREEN : COLOR_GREY }} />
          </Button>
        </View>
      ),
    }

  }

  constructor(props) {
    super(props);

    const { client } = this.props.navigation.state.params

    this.directionsAPI = new DirectionsAPI(client)
    this.state = {
      status: null,
      region: null,
      polylineCoords: [],
      markers: [],
      position: null,
      loading: false,
      loadingMessage: `${props.t('CONNECTING_SERVER')}…`,
      order: null,
      delivery: null,
      watchID: null,
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
  decline() {

    const { client } = this.props.navigation.state.params

    this.setState({
      loading: true,
      loadingMessage: `${this.props.t('PLS_WAIT')}…`
    });
    client.put(this.state.order['@id'] + '/decline', {})
      .then((order) => {
        this.setState({
          loadingMessage: `${this.props.t('WAITING_FOR_ORDER')}…`,
          order: null
        });
        this.resetMap();
      });
  }
  accept() {

    const { client } = this.props.navigation.state.params
    const { delivery } = this.state

    this.setState({
      loading: true,
      loadingMessage: `${this.props.t('PLS_WAIT')}…`
    })

    client
      .put(delivery['@id'] + '/accept', {})
      .then(delivery => this.setState({ delivery, loading: false }))
  }
  pick() {

    const { client } = this.props.navigation.state.params
    const { delivery } = this.state

    this.setState({
      loading: true,
      loadingMessage: `${this.props.t('PLS_WAIT')}…`
    })

    client
      .put(delivery['@id'] + '/pick', {})
      .then((delivery) => {
        this
          ._drawPathToDestination(delivery.deliveryAddress.geo)
          .then(() => this.setState({ delivery, loading: false }))
      })
  }
  deliver() {

    const { client } = this.props.navigation.state.params
    const { delivery } = this.state

    this.setState({
      loading: true,
      loadingMessage: `${this.props.t('PLS_WAIT')}…`
    })

    client
      .put(delivery['@id'] + '/deliver', {})
      .then(delivery => {
        this.setState({
          delivery: null,
          order: null,
          loadingMessage: `${this.props.t('WAITING_FOR_ORDER')}…`,
        });
        this.resetMap();
      });
  }
  _onRegionChange(region) {
    this.setState({region});
  }
  getStatus() {
    const { client } = this.props.navigation.state.params

    return client.get('/api/me/status').then((data) => {
      console.log(data);
      return data;
    });
  }
  load(data) {

    const { client } = this.props.navigation.state.params

    this.setState({
      loading: true,
      loadingMessage: `${this.props.t('LOADING_ORDER')}…`,
    })

    const promises = [
      client.get('/api/deliveries/' + data.id),
      client.get('/api/orders/' + data.order.id)
    ]

    Promise.all(promises)
      .then(values => {

        this.setState({ loadingMessage: `${this.props.t('CALCULATING_ROUTE')}…`, })

        const [ delivery, order ] = values
        const address = delivery.status === 'PICKED' ? delivery.deliveryAddress : delivery.originAddress

        this
          ._drawPathToDestination(address.geo)
          .then(() => this.setState({ delivery, order, loading: false }))
      })
      .catch(err => console.log(err))
  }
  getCurrentPosition() {
    this.setState({ loadingMessage: `${this.props.t('CALCULATING_YOUR_POS')}…`, });
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
        loadingMessage: `${this.props.t('TRACKING_YOUR_POS')}…`,
        watchID: watchID
      });
      resolve();
    });
  }
  clearWatch() {
    const { watchID } = this.state;
    navigator.geolocation.clearWatch(watchID);

    this.props.navigation.setParams({ tracking: false })
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

    this.props.navigation.setParams({ tracking: true })
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
      loadingMessage: `${this.props.t('CONNECTING_SERVER')}…`,
    });

    return new Promise((resolve, reject) => {

      const { baseURL, user } = this.props.navigation.state.params

      const webSocketBaseURL = baseURL.replace('http', 'ws');

      this.ws = new WebSocket(webSocketBaseURL + '/realtime', '', {
        headers: {
          Authorization: "Bearer " + user.token
        }
      });

      this.ws.onopen = () => {

        console.log('Connected to dispatch service !');

        this.onPositionUpdated();
        this.props.navigation.setParams({ connected: true })
        this.setState({
          loadingMessage: `${this.props.t('WAITING_FOR_ORDER')}…`,
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

    if (message.type === 'delivery') {
      this.load(message.delivery);
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
    this.props.navigation.setParams({ connected: true });
    this.setState({
      loadingMessage: `${this.props.t('CONN_LOST')}…`,
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
        loadingMessage: `${this.props.t('AUTHENTICATING')}…`,
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
                this.load(data.delivery);
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

  renderBottomRow() {

    const { delivery, order } = this.state

    if (!delivery) {
      return ( <View /> )
    }

    let nextAddress = delivery.status === 'PICKED' ?
      delivery.deliveryAddress.streetAddress : delivery.originAddress.streetAddress;

    let countdown = ( <View /> )
    let buttons = ( <View /> )

    if (delivery.status === 'WAITING') {
      buttons = (
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
          <Button danger disabled={ this.state.loading } onPress={ () => this.decline() }>
            <Text>{this.props.t('REFUSE')}</Text>
          </Button>
          <Button success disabled={ this.state.loading } onPress={ () => this.accept() }>
            <Text>{this.props.t('ACCEPT')}</Text>
          </Button>
        </View>
      );
      // countdown = (
      //   <View style={{ flex: 1, alignItems: 'center' }}>
      //     <Countdown duration={30} onComplete={() => console.log('TIMEOUT')} />
      //   </View>
      // );
    }
    if (delivery.status === 'DISPATCHED') {
      buttons = (
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
          <Button success disabled={this.state.loading} onPress={ () => this.pick() }>
            <Text>{this.props.t('ORDER_COLLECTED')}</Text>
          </Button>
        </View>
      );
    }
    if (delivery.status === 'PICKED') {
      buttons = (
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
          <Button success disabled={this.state.loading} onPress={ () => this.deliver() }>
            <Text>{this.props.t('ORDER_DELIVERED')}</Text>
          </Button>
        </View>
      );
    }

    return (
      <Row style={{ padding: 10 }}>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: 10 }}>{ order.restaurant.name }</Text>
            <Text>{ nextAddress }</Text>
          </View>
          { countdown }
          { buttons }
        </View>
      </Row>
    );
  }

  render() {

    const { height, width } = Dimensions.get('window');
    const halfScreenHeight = (height - 64) / 2;

    const { delivery, order } = this.state

    let loader = <View />;

    if (this.state.loading) {

      let loaderStyle = {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(52, 52, 52, 0.4)'
      };

      if (delivery) {
        loaderStyle = { ...loaderStyle, height: halfScreenHeight };
      }

      loader = (
        <View style={ loaderStyle }>
          <ActivityIndicator
            animating={true}
            size="large"
            color="#fff"
          />
          <Text style={{color: '#fff'}}>{this.state.loadingMessage}</Text>
        </View>
      );
    }

    return (
      <Container>
        <Grid>
          { this.renderTopRow() }
          { this.renderBottomRow() }
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

module.exports = translate()(DispatchPage);
