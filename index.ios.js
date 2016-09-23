/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions
} from 'react-native';

import MapView from 'react-native-maps';
import Polyline from 'polyline';
import _ from 'underscore';

const FBSDK = require('react-native-fbsdk');
const {
  LoginButton,
  AccessToken
} = FBSDK;

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

class coursiersapp extends Component {

  state = {
    fromCoords: HOME_COORDS,
    toCoords: PALAIS_GARNIER_COORDS,
    region: {
      ...HOME_COORDS,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    },
    polylineCoords: [],
    initialPosition: 'unknown',
    lastPosition: 'unknown',
    zoomEnabled: true,
  };

  watchID: ?number = null;

  getDirections(opts) {
    var fromCoords = opts.fromCoords;
    var toCoords = opts.toCoords;
    var url = 'https://maps.googleapis.com/maps/api/directions/json?mode=bicycling&';
        url += 'origin=' + fromCoords.latitude + ',' + fromCoords.longitude;
        url += '&destination=' + toCoords.latitude + ',' + toCoords.longitude;
        url += '&waypoints=' + BIG_FERNAND_COORDS.latitude + ',' + BIG_FERNAND_COORDS.longitude;
        url += '&key=' + GOOGLE_API_KEY;

    return new Promise((resolve, reject) => {;
      fetch(url)
      .then((response) => {
        return response.json();
      }).then((json) => {
        resolve(json);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  getBooks() {
    return new Promise((resolve, reject) => {;
      fetch('http://coursiers.dev/books')
      .then((response) => {
        return response.json();
      }).then((json) => {
        resolve(json);
      }).catch((err) => {
        // reject(err);
        console.log(err);
      });
    });
  }

  addBook(name) {
    var body = {
      name: name
    };
    console.log(JSON.stringify(body));

    var request = new Request('http://coursiers.dev/books', {
      method: 'POST',
      body: JSON.stringify(body)
    });
    return fetch(request)
      .then((response) => {
        return response.json();
      })
      // .then((responseJson) => {
      //   return responseJson.movies;
      // })
      .catch((err) => {
        console.log(err);
      });
  }

  componentDidMount() {

    console.log('componentDidMount');

     animationTimeout = setTimeout(() => {
      this.map.fitToSuppliedMarkers(['home', 'palaisGarnier', 'stGeorges'], false);
    }, 1000);

    // this.addBook("Les fleurs du mal").then((data) => {
    //   console.log('Created book with name '+data.name);
    // })

    this.getBooks().then((data) => {
      console.log(data);
    });

    /*
    navigator.geolocation.getCurrentPosition(
      (position) => {

        console.log(position)

        this.setState({position: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }});
        // var initialPosition = JSON.stringify(position);
        // this.setState({initialPosition});

        // this.map.animateToRegion({
        //   ...this.state.region,
        //   latitude: position.coords.latitude,
        //   longitude: position.coords.longitude,
        // });
      },
      (error) => console.log(error),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 20}
    );
    this.watchID = navigator.geolocation.watchPosition((position) => {
      console.log(position);
      // this.animate();
      // var lastPosition = JSON.stringify(position);
      this.setState({position : {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }});

      // this.map.animateToRegion({
      //   ...this.state.region,
      //   latitude: position.coords.latitude,
      //   longitude: position.coords.longitude,
      // });

    });
    */
  }

  onMarkerPress(e, coordinate) {
    console.log(e.nativeEvent);

    let toMarker = e.nativeEvent.id;

    this.getDirections({
      fromCoords: HOME_COORDS,
      toCoords: e.nativeEvent.coordinate,
    }).then((data) => {

      let points = data.routes[0].overview_polyline.points;
      let steps = Polyline.decode(points);

      let polylineCoords = [];
      for (let i=0; i < steps.length; i++) {
        let tempLocation = {
          latitude : steps[i][0],
          longitude : steps[i][1]
        }
        polylineCoords.push(tempLocation);
      }
      this.setState({polylineCoords});
      this.map.fitToSuppliedMarkers(['home', 'palaisGarnier', 'stGeorges'], false);
    });
  }

  onLoginFinished(error, result) {
    if (error) {
      alert("Login failed with error: " + result.error);
    } else if (result.isCancelled) {
      alert("Login was cancelled");
    } else {
      console.log(result);
      AccessToken.getCurrentAccessToken().then(
        (data) => {
          console.log(data.accessToken.toString())
        }
      )
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <LoginButton
            onLoginFinished={this.onLoginFinished}
            onLogoutFinished={() => console.log("User logged out")}/>
        </View>
        <View style={{flex: 2, borderColor: "red", borderStyle: "solid", borderWidth: 2}}>
          <MapView
            ref={ref => { this.map = ref; }}
            style={styles.map}
            region={this.state.region}
            zoomEnabled
            showsUserLocation>
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
            <MapView.Marker
              identifier='palaisGarnier'
              coordinate={PALAIS_GARNIER_COORDS}
              pinColor="blue"
              onSelect={(e) => this.onMarkerPress(e)} />
            <MapView.Marker
              identifier='stGeorges'
              coordinate={ST_GEORGES_COORD}
              pinColor="blue"
              onSelect={(e) => this.onMarkerPress(e)} />
            <MapView.Marker
              identifier='bigFernand'
              coordinate={BIG_FERNAND_COORDS}
              pinColor="green" />
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
}

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

AppRegistry.registerComponent('coursiersapp', () => coursiersapp);
