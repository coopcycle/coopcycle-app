import React, { Component } from 'react'
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Icon, Text, Thumbnail } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid'
import slugify from 'slugify'
import moment from 'moment/min/moment-with-locales'

moment.locale('fr')

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 15,
    backgroundColor: '#fff'
  },
  item: {
    paddingVertical: 10,
    borderBottomColor: '#f7f7f7',
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  restaurantNameText: {
    marginBottom: 5
  }
});

export default class RestaurantList extends Component {

  renderItem(restaurant) {

    const { baseURL } = this.props

    let cuisine = 'default';
    // if (restaurant.servesCuisine.length > 0) {
    //   var randomCuisine = _.first(_.shuffle(restaurant.servesCuisine));
    //   cuisine = randomCuisine.name;
    // }
    const imageURI = baseURL + '/img/cuisine/' + slugify(cuisine).toLowerCase() +'.jpg'

    const deliveryDate = moment(restaurant.availabilities[0])

    return (
      <TouchableOpacity style={ styles.item } onPress={ () => this.props.onItemClick(restaurant, deliveryDate) }>
        <Grid>
          <Col size={ 1 }>
            <Thumbnail size={60} source={{ uri: imageURI }} />
          </Col>
          <Col size={ 4 }>
            <Text style={ styles.restaurantNameText }>{ restaurant.name }</Text>
            <Text note>{ restaurant.address.streetAddress }</Text>
            <Text note style={{ fontWeight: 'bold' }}>
              { 'À partir de ' + moment(restaurant.availabilities[0]).format('dddd LT') }
            </Text>
          </Col>
        </Grid>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <View style={ styles.wrapper }>
        <FlatList
          data={ this.props.restaurants }
          keyExtractor={ (item, index) => item['@id'] }
          renderItem={ ({ item }) => this.renderItem(item) } />
      </View>
    )
  }
}