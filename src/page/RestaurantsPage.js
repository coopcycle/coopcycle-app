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
import _ from 'underscore'
import moment from 'moment/min/moment-with-locales'

import RestaurantSearch from '../components/RestaurantSearch'
import RestaurantList from '../components/RestaurantList'
import AppConfig from '../AppConfig'

moment.locale(AppConfig.LOCALE)

class RestaurantsPage extends Component {

  constructor(props) {
    super(props);

    const { client, user } = this.props.screenProps

    this.state = {
      loading: false,
      restaurants: props.restaurants || [],
      user,
      deliveryAddress: null,
      deliveryDay: null
    }
  }

  request(latitude, longitude, distance) {
    const { client } = this.props.screenProps
    return client.get('/api/restaurants?coordinate=' + [latitude, longitude] + '&distance=' + distance)
  }

  onChange(deliveryAddress, deliveryDay) {
    if (deliveryAddress) {

      this.setState({ loading: true, restaurants: [] })

      const { latitude, longitude } = deliveryAddress.geo
      this.request(latitude, longitude, 3000)
        .then(data => {

          let restaurants = data['hydra:member']
          if (deliveryDay) {
            restaurants = _.filter(restaurants, restaurant => {
              for (let i = 0; i < restaurant.availabilities.length; i++) {
                if (moment(restaurant.availabilities[i]).isSame(deliveryDay, 'day')) {
                  return true
                }
              }

              return false
            })
          }

          this.setState({ deliveryAddress, deliveryDay, restaurants, loading: false })
        })
    }
  }

  renderWarning() {

    const { deliveryDay, restaurants, loading } = this.state

    if (!loading && deliveryDay && restaurants.length === 0) {
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

    const { baseURL, client, user } = this.props.screenProps
    const { navigate } = this.props.screenProps.navigation
    const { deliveryAddress, deliveryDay, restaurants } = this.state

    return (
      <Container>
        <Content>
          <RestaurantSearch
            ref={ component => this.restaurantSearch = component }
            onChange={ this.onChange.bind(this) } />
          <RestaurantList
            baseURL={ baseURL }
            restaurants={ restaurants }
            deliveryDay={ deliveryDay }
            onItemClick={ (restaurant, deliveryDate) => navigate('Restaurant', { restaurant, deliveryAddress, deliveryDate, client, user }) } />
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
});

module.exports = RestaurantsPage;