import React, { Component } from 'react'
import { Animated, ActivityIndicator, SectionList, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Flex, Image, Text, Column, Row } from 'native-base';
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
    fontSize: 15,
    textAlign: 'center',
  },
  itemContainer: {
    paddingVertical: 15,
  },
  disabledText: {
    color: '#a7a7a7',
  },
  descriptionText: {
    fontSize: 14,
    color: '#777777',
  },
});

class Menu extends Component {

  renderSectionHeader(section) {
    return (
      <View style={ styles.sectionHeader }>
        <Text _dark={{color: 'white'}} _light={{color: '#3e3e3e'}} bold style={ styles.sectionHeaderText }>{ section.title }</Text>
      </View>
    )
  }

  renderItem(item, index, section) {

    // If the "enabled" key does not exist, fallback to true
    const enabled = item.hasOwnProperty('enabled') ? item.enabled : true

    let itemProps = {}
    let itemNameStyle = []
    let itemDescriptionStyle = [ styles.descriptionText ]
    let itemPriceStyle = []

    if (this.props.restaurant.isAvailable && enabled) {
      itemProps = {
        onPress: () => this.props.onItemClick(item),
      }
    } else {
      itemNameStyle.push(styles.disabledText)
      itemPriceStyle.push(styles.disabledText)
      itemDescriptionStyle.push(styles.disabledText)
    }

    const isLoading = this.props.isItemLoading(item)
    const hasBadges = !!item.suitableForDiet || !!item.allergens

    const image1x1 = item.images && Array.isArray(item.images)
      && _.find(item.images, image => image.ratio === '1:1')

    return (
      <TouchableOpacity style={ styles.itemContainer } disabled={!this.props.restaurant.isAvailable} { ...itemProps } testID={ `menuItem:${section.index}:${index}` }>
        <Flex mx="2" direction="row" justifyContent="space-between">
          <Column flexShrink="1">
            <Text style={ itemNameStyle }>{ item.name }</Text>
            { item.description && item.description.length > 0 &&
              <Text style={ itemDescriptionStyle } note numberOfLines={ 2 } ellipsizeMode="tail">{ item.description }</Text>
            }
            { hasBadges &&
              <Row my="1">
                { item.suitableForDiet && (<RestrictedDietList items={ item.suitableForDiet } />) }
                { item.allergens && (<AllergenList items={ item.allergens } />) }
              </Row>
            }
            <Row>
              <Text pr="2" fontSize="lg" style={ itemPriceStyle }>{ `${formatPrice(item.offers.price)}` }</Text>
              { isLoading && <ActivityIndicator color="#c7c7c7" size="small" style={ styles.loadingIndicator } /> }
            </Row>
          </Column>
            <Column>
            { image1x1 &&
              <Image size="md" resizeMode="cover" borderRadius={5} source={{ uri: image1x1.url }} alt="Product" />
            }
          </Column>
        </Flex>
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
