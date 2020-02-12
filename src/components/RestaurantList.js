import React, { Component } from 'react'
import { FlatList, StyleSheet, TouchableOpacity, View, Image } from 'react-native'
import { Text, Icon } from 'native-base'
import { withTranslation } from 'react-i18next'

import { getNextShippingTimeAsText, getRestaurantCaption, isFast } from '../utils/checkout'

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e7e7e7',
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 15,
  },
  restaurantNameText: {
    marginBottom: 5,
  },
  badge: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    height: 30,
    alignSelf: 'center',
    bottom: -15,
    paddingVertical: 5,
    paddingLeft: 5,
    paddingRight: 10,
    backgroundColor: '#ffffff',
    borderRadius: 30,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
  },
})

const OneLineText = (props) => (
  <Text numberOfLines={ props.numberOfLines || 1 } ellipsizeMode="tail" { ...props }>
    { props.children }
  </Text>
)

class RestaurantList extends Component {

  constructor(props) {
    super(props)
    this.matchingCounter = 0
  }

  renderItem(restaurant, index) {

    let testID = `restaurants:${index}`
    if (restaurant.address.streetAddress.match(/75020/g) || restaurant.address.streetAddress.match(/75010/g) || restaurant.address.streetAddress.match(/75019/g)) {
      testID = `restaurantMatches:${this.matchingCounter}`
      this.matchingCounter += 1
    }

    return (
      <TouchableOpacity
        onPress={ () => this.props.onItemClick(restaurant) }
        testID={ testID }>
        <View style={ styles.item }>
          <View style={{ flex: 1, width: '66.6666%', padding: 15, paddingBottom: 25 }}>
            <OneLineText style={ [ styles.restaurantNameText ] }>{ restaurant.name }</OneLineText>
            <OneLineText note numberOfLines={ 2 }>{ getRestaurantCaption(restaurant) }</OneLineText>
            <View style={ [ styles.badge, { backgroundColor: isFast(restaurant) ? '#2ed573' : '#ffa502' } ] }>
              <Icon type="FontAwesome" name="clock-o" style={ [ styles.badgeText, { fontSize: 20, marginRight: 5 } ] } />
              <Text style={ styles.badgeText }>{ getNextShippingTimeAsText(restaurant) }</Text>
            </View>
          </View>
          <View style={{ width: '33.3333%' }}>
            <Image style={{ flex: 1, height: undefined, width: undefined }} resizeMode="cover" source={{ uri: restaurant.image }} />
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  render() {

    return (
      <View style={ styles.container }>
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
