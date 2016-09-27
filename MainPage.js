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
} from 'react-native';

const FBSDK = require('react-native-fbsdk');
const {
  LoginButton,
  AccessToken
} = FBSDK;

import MapView from 'react-native-maps';
import Polyline from 'polyline';
import _ from 'underscore';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0722;
const LONGITUDE_DELTA = 0.0221; // LATITUDE_DELTA * ASPECT_RATIO;

const GOOGLE_API_KEY = 'AIzaSyCAqNf8X0elLLXv5yeh0btsYpq47eCzIAw';

const HOME_COORDS = {
  latitude: 48.875973,
  longitude: 2.370039
};

const PALAIS_GARNIER_COORDS = {
  latitude: 48.872178,
  longitude: 2.331797
};
const ST_GEORGES_COORD = {
  latitude: 48.879291,
  longitude: 2.337333
}

const PARIS_COORDS = {
  latitude: 48.855901,
  longitude: 2.349272
};

const BIG_FERNAND_COORDS = {
  latitude: 48.881455,
  longitude: 2.346224
};

class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fromCoords: HOME_COORDS,
      toCoords: PALAIS_GARNIER_COORDS,
      region: {
        ...HOME_COORDS,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      markers: [],
      polylineCoords: [],
      initialPosition: 'unknown',
      lastPosition: 'unknown',
      distance: 500,
      circle: []
    };
  }
  getCouriers(latitude, longitude, distance) {
    return fetch('http://coursiers.dev/coordinates?latitude='+latitude+'&longitude='+longitude+'&distance='+distance)
      .then((response) => {
        return response.json();
      }).catch((err) => {
        // reject(err);
        console.log(err);
      });
  }
  updateCouriers(latitude, longitude, distance) {
    this.getCouriers(latitude, longitude, distance).then((data) => {
      let markers = _.map(data, (courier) => {
        courier.key = courier.name;
        courier.coordinate = {
          latitude: courier.coordinate[0],
          longitude: courier.coordinate[1]
        }

        return courier;
      })
      this.setState({markers});
      this.setState({circle: [distance]});
      let markerKeys = _.map(markers, (courier) => courier.name);
      this.map.fitToSuppliedMarkers(markerKeys, false);
    });
  }

  componentDidMount() {
    this.updateCouriers(HOME_COORDS.latitude, HOME_COORDS.longitude, 500);
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
        <View style={{flex: 1, justifyContent: 'center'}}>
          <View style={{flex: 1, borderStyle: "solid", borderWidth: 1, borderColor: "black"}}>
            <LoginButton
              onLoginFinished={this.onLoginFinished}
              onLogoutFinished={() => console.log("User logged out")}/>
          </View>
          <View style={{flex: 1, borderStyle: "solid", borderWidth: 1, borderColor: "black"}}>
            <Text>Distance : {this.state.distance} m</Text>
            <Slider
              minimumValue={0}
              maximumValue={2000}
              step={500}
              value={this.state.distance}
              onValueChange={(value) => {
                let distance = value;
                this.updateCouriers(HOME_COORDS.latitude, HOME_COORDS.longitude, value);
                this.setState({distance: value});
              }}/>
          </View>
        </View>
        <View style={{flex: 2, borderColor: "red", borderStyle: "solid", borderWidth: 2}}>
          <MapView
            ref={ref => { this.map = ref; }}
            style={styles.map}
            initialRegion={this.state.region}
            zoomEnabled
            showsUserLocation>
            {this.state.circle.map(radius => (
            <MapView.Circle
              key="{{'__distance' + radius}}"
              center={HOME_COORDS}
              radius={radius}
              fillColor="rgba(200, 0, 0, 0.5)"
              strokeColor="rgba(0,0,0,0.5)" />
            ))}
            <MapView.Marker
              identifier='home'
              coordinate={HOME_COORDS}
              pinColor="red"
              flat>
              <MapView.Callout style={styles.callout}>
                <View style={styles.calloutView}>
                  <Text>This is a plain view</Text>
                </View>
              </MapView.Callout>
            </MapView.Marker>
            {this.state.markers.map(marker => (
              <MapView.Marker
                identifier={marker.name}
                key={marker.name}
                coordinate={marker.coordinate}
                pinColor="blue"
                title={marker.name}
                description={marker.name} />
            ))}
            <MapView.Polyline
              coordinates={this.state.polylineCoords}
              strokeWidth={4}
              strokeColor="#19B5FE"
             />
          </MapView>
        </View>
      </View>
    );
  }
  gotoPersonPage() {
    this.props.navigator.push({
      id: 'LoginPage',
      name: '我的主页',
    });
  }
}

var NavigationBarRouteMapper = {
  LeftButton(route, navigator, index, navState) {
    return (
      <TouchableOpacity style={{flex: 1, justifyContent: 'center'}}
          onPress={() => navigator.parentNavigator.pop()}>
        <Text style={{color: 'white', margin: 10,}}>
          返回
        </Text>
      </TouchableOpacity>
    );
  },
  RightButton(route, navigator, index, navState) {
    return (
      <TouchableOpacity style={{flex: 1, justifyContent: 'center'}}
          onPress={() => navigator.parentNavigator.push({id: 'LoginPage', name: 'Login'})}>
        <Text style={{color: 'white', margin: 10,}}>
          Configurer
        </Text>
      </TouchableOpacity>
    );
  },
  Title(route, navigator, index, navState) {
    return (
      <TouchableOpacity style={{flex: 1, justifyContent: 'center'}}>
        <Text style={{color: 'white', margin: 10, fontSize: 16}}>
          主页
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
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  callout: {
    position: 'relative',
  },
  calloutView: {
    // flex: 1,
    // ...StyleSheet.absoluteFillObject,
    // backgroundColor: '#FF5A5F',
    // margin: 0
  },

  map: {
    ...StyleSheet.absoluteFillObject,
  }
});

module.exports = MainPage;