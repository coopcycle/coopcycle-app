import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator
} from 'react-native';
import {
  Container, Header, Title, Content,
  Left, Right, Body,
  Button, Text, Icon, List, ListItem, Thumbnail
} from 'native-base';
import slugify from 'slugify';

import RestaurantsAPI from '../RestaurantsAPI'
import AddressTypeahead from '../components/AddressTypeahead'

class RestaurantsPage extends Component {

  restaurantsAPI = null;

  constructor(props) {
    super(props);

    const { baseURL, client, user } = this.props.screenProps

    this.restaurantsAPI = new RestaurantsAPI(client)
    this.state = {
      loading: false,
      restaurants: props.restaurants || [],
      user,
      baseURL,
      deliveryAddress: null
    }
  }
  renderListHeader() {
    return (
      <AddressTypeahead onPress={deliveryAddress => {
        this.setState({
          loading: true,
          restaurants: []
        });
        this.restaurantsAPI
          .nearby(deliveryAddress.geo.latitude, deliveryAddress.geo.longitude, 3000)
          .then(data => {
            this.setState({
              deliveryAddress,
              loading: false,
              restaurants: data['hydra:member']
            });
          });
      }} />
    )
  }
  renderRow(restaurant) {

    const { client, user } = this.props.screenProps
    const { navigate } = this.props.screenProps.navigation
    const { deliveryAddress } = this.state

    let cuisine = 'default';
    // if (restaurant.servesCuisine.length > 0) {
    //   var randomCuisine = _.first(_.shuffle(restaurant.servesCuisine));
    //   cuisine = randomCuisine.name;
    // }

    let imageURI = this.state.baseURL + '/img/cuisine/' + slugify(cuisine).toLowerCase() +'.jpg';

    return (
      <ListItem thumbnail onPress={ () => navigate('Restaurant', { restaurant, deliveryAddress, client, user }) }>
        <Left>
          <Thumbnail square size={60} source={{ uri: imageURI }} />
        </Left>
        <Body>
          <Text>{ restaurant.name }</Text>
          <Text note>{ restaurant.streetAddress }</Text>
        </Body>
      </ListItem>
    );
  }
  render() {

    return (
      <Container>
        <Content>
          <List
            enableEmptySections
            dataArray={ this.state.restaurants }
            renderRow={ this.renderRow.bind(this) }
            renderHeader={ this.renderListHeader.bind(this) }
          />
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
    // ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center'
  },
  listViewItem: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  },
});

module.exports = RestaurantsPage;