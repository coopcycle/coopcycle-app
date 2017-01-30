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
import _ from 'underscore';
import { API } from 'coopcycle-js';

import theme from '../theme/coopcycle';

const AppConfig = require('../AppConfig');
const AppUser = require('../AppUser');
const APIClient = null;

class CartAddressPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deliveryAddresses: 2000,
      loading: false,
      user: null
    };
  }
  componentDidMount() {
    AppUser.load()
      .then((user) => {
        APIClient = API.createClient(AppConfig.API_BASEURL, user);
        this.setState({ loading: true });
        APIClient.get('/api/me')
          .then((data) => {
            this.setState({
              deliveryAddresses: data.deliveryAddresses,
              loading: false
            });
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
    return (
      <Container>
        <Header>
          <Button transparent onPress={() => navigator.parentNavigator.pop()}>
            <Icon name="ios-arrow-back" />
          </Button>
          <Title>Livraison</Title>
        </Header>
        <Content theme={theme}>
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