import React, { Component } from 'react'
import { Animated, ActivityIndicator, SectionList, StyleSheet, TouchableOpacity, View, ImageBackground, TextInput } from 'react-native'
import { Text } from 'native-base'
import _ from 'lodash'
import {
  useCollapsibleStack,
  CollapsibleStackSub,
} from 'react-navigation-collapsible'

import { AllergenList, RestrictedDietList } from './MenuBadges'

import { formatPrice } from '../utils/formatting'

const GroupImageHeader = (props) => {

  const { restaurant, translateY, opacity, progress } = props

  return (
    <Animated.View style={{
      width: '100%',
      height: 160,
      opacity: opacity }}>
      <ImageBackground source={{ uri: restaurant.image }} style={{ width: '100%', height: '100%' }}>
        <View style={ styles.overlay }>
          <Animated.Image
            source={{ uri: restaurant.image }}
            resizeMode="cover"
            style={{
              transform: [{ scale: opacity }],
              opacity: opacity,
              alignSelf: 'center',
              width: 80,
              height: 80,
              borderWidth: 1,
              borderColor: 'white',
              borderRadius: 50,
            }}
          />
          <Text style={ styles.restaurantName } numberOfLines={ 1 }>{ restaurant.name }</Text>
        </View>
      </ImageBackground>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#f7f7f7',
  },
  sectionHeaderText: {
    color: '#3e3e3e',
    fontSize: 15,
    textAlign: 'center',
  },
  itemContainer: {
    paddingVertical: 15,
  },
  item: {
    paddingRight: 10,
    paddingLeft: 25,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  disabledText: {
    color: '#a7a7a7',
  },
  itemPrice: {
    color: '#333',
    fontSize: 18,
    marginRight: 10,
  },
  leftCol: {
    width: '75%',
  },
  rightCol: {
    width: '25%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  rightIcon: {
    color: '#747474',
    fontSize: 22,
  },
  itemSeparator: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
    backgroundColor: '#e7e7e7',
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  restaurantName: {
    color: '#ffffff',
    fontFamily: 'Raleway-Regular',
    marginTop: 5,
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },
});

const ItemSeparatorComponent = () => (
  <View style={ styles.itemSeparator } />
)

const MySearchBar = () => (
  <View style={{ padding: 15, width: '100%', height: 60, backgroundColor: 'red' }}>
    <TextInput placeholder="search here" />
  </View>
);

class Menu extends Component {

  renderSectionHeader(section) {
    return (
      <View style={ styles.sectionHeader }>
        <Text style={ styles.sectionHeaderText }>{ section.title }</Text>
      </View>
    )
  }

  renderItem(item, index, section) {

    // If the "enabled" key does not exist, fallback to true
    const enabled = item.hasOwnProperty('enabled') ? item.enabled : true

    let itemProps = {}
    let itemNameStyle = []
    let itemPriceStyle = [ styles.itemPrice ]

    if (enabled) {
      itemProps = {
        onPress: () => this.props.onItemClick(item),
      }
    } else {
      itemNameStyle.push(styles.disabledText)
      itemPriceStyle.push(styles.disabledText)
    }

    const isLoading = this.props.isItemLoading(item)
    const hasBadges = !!item.suitableForDiet || !!item.allergens

    return (
      <TouchableOpacity style={ styles.itemContainer } { ...itemProps } testID={ `menuItem:${section.index}:${index}` }>
        <View style={ styles.item }>
          <View style={ styles.leftCol }>
            <Text style={ itemNameStyle }>{ item.name }</Text>
            { (item.description && item.description.length > 0) ? (
              <Text note numberOfLines={ 4 } ellipsizeMode="tail">{ item.description }</Text>
            ) : null }
          </View>
          <View style={ styles.rightCol }>
            <Text style={ itemPriceStyle }>{ `${formatPrice(item.offers.price)}` }</Text>
            { isLoading && <ActivityIndicator size="small" style={{ position: 'absolute', right: 0 }} /> }
          </View>
        </View>
        { hasBadges && (
          <View style={{ paddingHorizontal: 25, marginVertical: 5 }}>
            { item.suitableForDiet && (<RestrictedDietList items={ item.suitableForDiet } />) }
            { item.allergens && (<AllergenList items={ item.allergens } />) }
          </View>
        ) }
      </TouchableOpacity>
    )
  }

  render() {

    const { restaurant, menu, onScroll, containerPaddingTop, scrollIndicatorInsetTop, opacity } = this.props

    let sections = []
    if (menu) {
      _.forEach(menu.hasMenuSection, (menuSection, index) => {
        sections.push({
          title: menuSection.name,
          data: _.filter(menuSection.hasMenuItem, it => it.enabled),
          index,
        })
      })
    }

    return (
      <>
        <Animated.SectionList
          contentContainerStyle={{ paddingTop: containerPaddingTop }}
          scrollIndicatorInsets={{ top: scrollIndicatorInsetTop }}
          onScroll={ onScroll }
          testID="menu"
          sections={ sections }
          renderItem={ ({ item, index, section }) => this.renderItem(item, index, section) }
          renderSectionHeader={ ({ section }) => this.renderSectionHeader(section) }
          keyExtractor={ (item, index) => index }
          initialNumToRender={ 15 }
          ItemSeparatorComponent={ ItemSeparatorComponent } />
        <CollapsibleStackSub>
          <GroupImageHeader restaurant={ restaurant } opacity={ opacity } />
        </CollapsibleStackSub>
      </>
    )
  }
}

export default Menu
