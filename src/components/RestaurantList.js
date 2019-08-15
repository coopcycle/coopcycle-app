import React, { Component } from 'react'
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Text, Thumbnail } from 'native-base'
import { withTranslation } from 'react-i18next'

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#fff',
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  restaurantNameText: {
    marginBottom: 5,
  },
  itemSeparator: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
    backgroundColor: '#e7e7e7',
  },
})

const ItemSeparatorComponent = () => (
  <View style={ styles.itemSeparator } />
)

const OneLineText = (props) => (
  <Text numberOfLines={ 1 } ellipsizeMode="tail" { ...props }>
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
      <TouchableOpacity style={ styles.item }
        onPress={ () => this.props.onItemClick(restaurant) }
        testID={ testID }>
        <View style={{ flex: 1 }}>
          <OneLineText style={ [ styles.restaurantNameText ] }>{ restaurant.name }</OneLineText>
          <OneLineText note>{ restaurant.address.streetAddress }</OneLineText>
        </View>
        <Thumbnail size={ 60 } source={{ uri: restaurant.image }} />
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
          renderItem={ ({ item, index }) => this.renderItem(item, index) }
          ItemSeparatorComponent={ ItemSeparatorComponent } />
      </View>
    )
  }
}

export default withTranslation()(RestaurantList)
