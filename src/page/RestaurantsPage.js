import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator
} from 'react-native';
import {
  Container, Header, Title, Content,
  Left, Right, Body,
  Button, Text, Icon, List, ListItem, Thumbnail,
  Card, CardItem
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid'
import slugify from 'slugify'
import _ from 'underscore'
import moment from 'moment/min/moment-with-locales'

import RestaurantSearch from '../components/RestaurantSearch'

moment.locale('fr')

class RestaurantsPage extends Component {

  constructor(props) {
    super(props);

    const { baseURL, client, user } = this.props.screenProps

    this.state = {
      loading: false,
      restaurants: props.restaurants || [],
      user,
      baseURL,
      deliveryAddress: null,
      deliveryDate: null
    }
  }

  request(latitude, longitude, distance) {
    const { client } = this.props.screenProps
    return client.get('/api/restaurants?coordinate=' + [latitude, longitude] + '&distance=' + distance)
  }

  onChange(deliveryAddress, deliveryDate) {
    if (deliveryAddress) {

      this.setState({ loading: true, restaurants: [] })

      const { latitude, longitude } = deliveryAddress.geo
      this.request(latitude, longitude, 3000)
        .then(data => {

          let restaurants = data['hydra:member']
          if (deliveryDate) {
            restaurants = _.filter(restaurants, restaurant => {
              for (let i = 0; i < restaurant.availabilities.length; i++) {
                if (moment(restaurant.availabilities[i]).isSame(deliveryDate, 'day')) {
                  return true
                }
              }

              return false
            })
          }

          this.setState({ deliveryAddress, deliveryDate, restaurants, loading: false })
        })
    }
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

    let imageURI = this.state.baseURL + '/img/cuisine/' + slugify(cuisine).toLowerCase() +'.jpg'

    const deliveryDate = moment(restaurant.availabilities[0])

    return (
      <ListItem thumbnail onPress={ () => navigate('Restaurant', { restaurant, deliveryAddress, deliveryDate, client, user }) }>
        <Left>
          <Thumbnail square size={60} source={{ uri: imageURI }} />
        </Left>
        <Body>
          <Text>{ restaurant.name }</Text>
          <Text note>{ restaurant.address.streetAddress }</Text>
          <Text note style={{ fontWeight: 'bold' }}>{ 'À partir de ' + moment(restaurant.availabilities[0]).format('dddd LT') }</Text>
        </Body>
      </ListItem>
    );
  }

  renderWarning() {

    const { deliveryDate, restaurants } = this.state

    if (deliveryDate && restaurants.length === 0) {
      return (
        <View style={{ paddingHorizontal: 10, marginTop: 30 }}>
          <Card>
            <CardItem>
              <Body>
                <Text>
                  Désolé, nous n'avons pas trouvé de restaurant ouvert.
                </Text>
                <Text>
                  Voulez-vous relancer la recherche sans inclure de date ?
                </Text>
                <Button block style={{ marginTop: 10 }} onPress={ () => this.restaurantSearch.resetDeliveryDate() }>
                  <Text>Relancer la recherche</Text>
                </Button>
              </Body>
            </CardItem>
          </Card>
        </View>
      )
    }

    return (
      <View />
    )
  }

  render() {

    const { client } = this.props.screenProps
    const { deliveryDate, restaurants } = this.state

    return (
      <Container>
        <Content>
          <RestaurantSearch
            ref={ component => this.restaurantSearch = component }
            onChange={ this.onChange.bind(this) } />
          <List
            enableEmptySections
            dataArray={ restaurants }
            renderRow={ this.renderRow.bind(this) } />
          { this.renderWarning() }
          <View style={styles.loader}>
            <ActivityIndicator
              animating={ this.state.loading }
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