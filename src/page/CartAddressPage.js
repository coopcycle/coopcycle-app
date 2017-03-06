import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Navigator,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Modal,
} from 'react-native';
import {
  Badge,
  Container,
  Header,
  Title, Content, Footer, FooterTab, Button, Icon, List, ListItem, Text, Radio } from 'native-base';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import _ from 'underscore';

import theme from '../theme/coopcycle';
import AppConfig from '../AppConfig.json'

class CartAddressPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deliveryAddresses: 2000,
      loading: false,
      loaded: false,
      user: props.user || null
    };
  }
  componentDidMount() {
    this.setState({ loading: true });

    const user = this.state.user;
    this.props.client.get('/api/me')
      .then((data) => {
        Object.assign(user, {
          '@id': data['@id']
        });
        this.setState({
          deliveryAddresses: data.deliveryAddresses,
          loading: false,
          loaded: true,
          user: user,
        });
      });
  }
  _gotoNextPage(navigator) {
    navigator.parentNavigator.push({
      id: 'CreditCardPage',
      name: 'CreditCard',
      sceneConfig: Navigator.SceneConfigs.FloatFromRight,
      passProps: {
        cart: this.props.cart
      }
    });
  }
  renderAutocomplete() {
    return (<GooglePlacesAutocomplete
      placeholder="Entrez votre adresse"
      minLength={2} // minimum length of text to search
      autoFocus={false}
      listViewDisplayed='auto'    // true/false/undefined
      fetchDetails={true}
      onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true

        console.log(data);

        let location = details.geometry.location;

        let deliveryAddress = {
          customer: this.state.user['@id'],
          name: data.description,
          streetAddress: data.description,
          geo: {
            latitude: location.lat,
            longitude: location.lng
          }
        }

        this.setState({ loading: true })
        this.props.client.post('/api/delivery_addresses', deliveryAddress)
          .then((data) => {
            console.log('ADDRESS CREATED', data);
            this.setState({
              deliveryAddresses: [data],
              loading: false,
            });
          });

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
  _renderRow(navigator, deliveryAddress) {
    return (
      <ListItem button iconRight onPress={() => {

        const cart = this.props.cart;
        cart.deliveryAddress = deliveryAddress;

        navigator.parentNavigator.push({
          id: 'CreditCardPage',
          name: 'CreditCard',
          sceneConfig: Navigator.SceneConfigs.FloatFromRight,
          passProps: {
            cart: cart
          }
        });

      }}>
        <Icon name="ios-arrow-dropright" style={{ color: '#0A69FE' }} />
        <Text>{ deliveryAddress.streetAddress }</Text>
      </ListItem>
    )
  }
  render() {
    return (
      <Navigator
          renderScene={this.renderScene.bind(this)}
          navigator={this.props.navigator} />
    );
  }
  renderScene(route, navigator) {

    let top = ( <View /> )

    if (this.state.loaded) {
      if (this.state.deliveryAddresses.length > 0) {
        top = (
          <View style={ { alignItems: 'center', justifyContent: 'center', paddingVertical: 20 } }>
            <Text>Choisissez une adresse de livraison</Text>
          </View>
        );
      } else {
        top = this.renderAutocomplete();
      }
    }

    return (
      <Container>
        <Header>
          <Button transparent onPress={() => navigator.parentNavigator.pop()}>
            <Icon name="ios-arrow-back" />
          </Button>
          <Title>Livraison</Title>
        </Header>
        <Content theme={theme}>
          { top }
          <List dataArray={ this.state.deliveryAddresses } renderRow={ this._renderRow.bind(this, navigator) } />
          <View style={styles.loader}>
            <ActivityIndicator
              animating={this.state.loading}
              size="large"
              color="#0000ff"
            />
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  listViewItem: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  header: {
    flex: 1,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  },
});

module.exports = CartAddressPage;