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
  Header, Title, Content, Footer,
  Left, Right, Body,
  Button, Icon, List, ListItem, Text, Radio } from 'native-base';
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
  onAddressCreated(deliveryAddress) {
    Object.assign(deliveryAddress, {
      customer: this.state.user['@id'],
    });
    this.setState({ loading: true })
    this.props.client.post('/api/delivery_addresses', deliveryAddress)
      .then((data) => {
        const deliveryAddresses = this.state.deliveryAddresses;
        deliveryAddresses.push(data);

        this.setState({
          deliveryAddresses: deliveryAddresses,
          loading: false,
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
  render() {
    return (
      <Navigator
          renderScene={this.renderScene.bind(this)}
          navigator={this.props.navigator} />
    );
  }
  renderList(navigator) {
    if (this.state.loading) {
      return ( <View /> )
    }

    return (
      <View>
        <List dataArray={ this.state.deliveryAddresses }
          renderHeader={ this.renderListHeader.bind(this) }
          renderRow={ this.renderRow.bind(this, navigator) } />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <Button block onPress={() => {
            navigator.parentNavigator.push({
              id: 'NewAddressPage',
              name: 'NewAddress',
              sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
              passProps: {
                onAddressCreated: this.onAddressCreated.bind(this)
              }
            });
          }}>
            <Text>Ajouter une adresse</Text>
          </Button>
        </View>
      </View>
    );
  }
  renderListHeader() {
    let headingText = 'Choisissez une adresse de livraison';
    if (this.state.deliveryAddresses.length === 0) {
      headingText = "Vous n'avez aucune adresse de livraison"
    }
    return (
      <View style={{ flex: 1, alignItems: 'center', paddingVertical: 20 }}>
        <Text>{ headingText }</Text>
      </View>
    )
  }
  renderRow(navigator, deliveryAddress) {
    return (
      <ListItem button icon onPress={() => {

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
        <Left>
          <Icon name="ios-arrow-dropright" style={{ color: '#0A69FE' }} />
        </Left>
        <Body>
          <Text>{ deliveryAddress.streetAddress }</Text>
        </Body>
      </ListItem>
    )
  }
  renderScene(route, navigator) {
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => navigator.parentNavigator.pop()}>
              <Icon name="ios-arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Livraison</Title>
          </Body>
          <Right />
        </Header>
        <Content theme={theme}>
          { this.renderList(navigator) }
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
  loader: {
    flex: 1,
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
});

module.exports = CartAddressPage;