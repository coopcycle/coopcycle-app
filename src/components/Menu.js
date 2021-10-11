import React, { Component } from 'react'
import { Animated, ActivityIndicator, SectionList, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Text } from 'native-base';
import _ from 'lodash'
import { AllergenList, RestrictedDietList } from './MenuBadges'

const AnimatedSectionList = Animated.createAnimatedComponent(SectionList);

import { formatPrice } from '../utils/formatting'
import ItemSeparator from './ItemSeparator'

const styles = StyleSheet.create({
  sectionHeader: {
    paddingVertical: 10,
    paddingHorizontal: 15,
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
});

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
      <TouchableOpacity style={ styles.itemContainer } { ...itemProps } testID={ `menuItem:${section.index}:${index}` }>
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

    const { menu } = this.props

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
      <AnimatedSectionList
        testID="menu"
        sections={ sections }
        renderItem={ ({ item, index, section }) => this.renderItem(item, index, section) }
        renderSectionHeader={ ({ section }) => this.renderSectionHeader(section) }
        keyExtractor={ (item, index) => index }
        initialNumToRender={ 15 }
        ItemSeparatorComponent={ ItemSeparator } />
    )
  }
}

export default Menu
