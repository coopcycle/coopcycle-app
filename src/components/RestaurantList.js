import React, { Component } from 'react'
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Text, Thumbnail } from 'native-base';
import { Col, Grid } from 'react-native-easy-grid'
import { withTranslation } from 'react-i18next'

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#fff',
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomColor: '#f7f7f7',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  restaurantNameText: {
    marginBottom: 5,
  },
});

class RestaurantList extends Component {

  renderItem(restaurant, index) {

    return (
      <TouchableOpacity style={ styles.item }
        onPress={ () => this.props.onItemClick(restaurant) }
        testID={ `restaurantIndex:${index}` }>
        <Grid>
          <Col size={ 1 }>
            <Thumbnail size={60} source={{ uri: restaurant.image }} />
          </Col>
          <Col size={ 4 } style={{ paddingLeft: 10 }}>
            <Text style={ styles.restaurantNameText }>{ restaurant.name }</Text>
            <Text note>{ restaurant.address.streetAddress }</Text>
          </Col>
        </Grid>
      </TouchableOpacity>
    )
  }

  render() {

    return (
      <View style={ styles.wrapper }>
        <FlatList
          testID="restaurantList"
          data={ this.props.restaurants }
          keyExtractor={ (item, index) => item['@id'] }
          renderItem={ ({ item, index }) => this.renderItem(item, index) } />
      </View>
    )
  }
}

export default withTranslation()(RestaurantList)
