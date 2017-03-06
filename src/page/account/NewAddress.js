import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Navigator,
  ActivityIndicator,
} from 'react-native';
import {
  Container,
  Header,
  Title, Content, Footer, FooterTab, Button, Icon, List, ListItem, Text, Radio
} from 'native-base';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView from 'react-native-maps';
import _ from 'underscore';

import theme from '../../theme/coopcycle';

const AppConfig = require('../../AppConfig.json');

class NewAddress extends Component {
  map = null;
  constructor(props) {
    super(props);
    this.state = {
      deliveryAddress: null
    };
  }
  render() {
    return (
      <Navigator
          renderScene={this.renderScene.bind(this)}
          navigator={this.props.navigator} />
    );
  }
  renderAutocomplete() {
    return (<GooglePlacesAutocomplete
      placeholder="Entrez votre adresse"
      minLength={2} // minimum length of text to search
      autoFocus={false}
      listViewDisplayed='auto'    // true/false/undefined
      fetchDetails={true}
      onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true

        let location = details.geometry.location;

        let deliveryAddress = {
          name: data.description,
          streetAddress: data.description,
          geo: {
            latitude: location.lat,
            longitude: location.lng
          }
        }

        this.setState({ deliveryAddress });

        setTimeout(() => this.map.fitToElements(true), 250);

      }}
      getDefaultValue={() => {
        return ''; // text input default value
      }}
      query={{
        // available options: https://developers.google.com/places/web-service/autocomplete
        key: AppConfig.GOOGLE_API_KEY,
        language: 'fr', // language of the results
        types: 'geocode', // default: 'geocode'
      }}
      styles={{
        description: {
          fontWeight: 'bold',
        },
        predefinedPlacesDescription: {
          color: '#1faadb',
        },
        row: {
          backgroundColor: '#fff'
        }
      }}
      nearbyPlacesAPI="GoogleReverseGeocoding" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
      GoogleReverseGeocodingQuery={{
        // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
        region: "fr"
      }}
      GooglePlacesSearchQuery={{
        // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
        rankby: 'distance',
        types: 'food',
      }}
      // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
      filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']}
      />
    );
  }
  renderScene(route, navigator) {

    let markers = [];
    if (this.state.deliveryAddress) {
      markers.push({
        key: 'deliveryAddress',
        identifier: 'deliveryAddress',
        coordinate: this.state.deliveryAddress.geo,
        pinColor: 'green',
      })
    }

    return (
      <Container theme={ theme }>
        <Header>
          <Button transparent onPress={() => navigator.parentNavigator.pop()}>
            Annuler
          </Button>
          <Title>Nouvelle adresse</Title>
        </Header>
        <View style={{ flex: 1 }}>
          <MapView
            ref={ref => { this.map = ref; }}
            style={styles.map}
            zoomEnabled
            loadingEnabled
            loadingIndicatorColor={"#666666"}
            loadingBackgroundColor={"#eeeeee"}>
            {markers.map(marker => (
              <MapView.Marker
                identifier={marker.identifier}
                key={marker.key}
                coordinate={marker.coordinate}
                pinColor={marker.pinColor}
                title={marker.title}
                description={marker.description} />
            ))}
          </MapView>
          <View style={{ flex: 1 }}>
            { this.renderAutocomplete() }
          </View>
        </View>
        <Footer>
          <Button success block style={ { alignSelf: 'flex-end', marginRight: 10 } } onPress={() => {
            this.props.onAddressCreated(this.state.deliveryAddress);
            navigator.parentNavigator.pop();
          }}>
            Valider
          </Button>
        </Footer>
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
  }
});

module.exports = NewAddress;