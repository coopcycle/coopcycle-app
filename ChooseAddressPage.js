import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Navigator,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';

import MapView from 'react-native-maps';
import Polyline from 'polyline';

const LATITUDE_DELTA = 0.0722;
const LONGITUDE_DELTA = 0.0221;
const GOOGLE_API_KEY = 'AIzaSyCAqNf8X0elLLXv5yeh0btsYpq47eCzIAw';

class ChooseAddressPage extends Component {
  constructor(props) {
    super(props);
    console.log(props.restaurant);
    this.state = {
      region: {
        ...props.customer.deliveryAddress[0].geo,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      restaurant: props.restaurant,
      customer: props.customer,
      polylineCoords: [],
    };
  }
  getDirections(opts) {
    var fromCoords = opts.fromCoords;
    var toCoords = opts.toCoords;
    var url = 'https://maps.googleapis.com/maps/api/directions/json?mode=bicycling&';
        url += 'origin=' + fromCoords.latitude + ',' + fromCoords.longitude;
        url += '&destination=' + toCoords.latitude + ',' + toCoords.longitude;
        // url += '&waypoints=' + BIG_FERNAND_COORDS.latitude + ',' + BIG_FERNAND_COORDS.longitude;
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
  componentDidMount() {
    setTimeout(() => {
      this.getDirections({
        fromCoords: this.state.restaurant.geo,
        toCoords: this.state.customer.deliveryAddress[0].geo,
      }).then((data) => {

        console.log(data.routes[0].legs[0].duration.text);

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
        // this.map.fitToSuppliedMarkers(['restaurant', 'customer'], false);
        this.map.fitToElements(true);
      });
    }, 300);
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
            identifier='customer'
            coordinate={this.state.customer.deliveryAddress[0].geo}
            pinColor="blue"
            flat>
            <MapView.Callout style={styles.callout}>
              <View style={styles.calloutView}>
                <Text>This is a plain view</Text>
              </View>
            </MapView.Callout>
          </MapView.Marker>
          <MapView.Marker
            identifier='restaurant'
            coordinate={this.state.restaurant.geo}
            pinColor="red"
            flat>
            <MapView.Callout style={styles.callout}>
              <View style={styles.calloutView}>
                <Text>This is a plain view</Text>
              </View>
            </MapView.Callout>
          </MapView.Marker>
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

module.exports = ChooseAddressPage;