import React, { Component } from 'react'
import { Animated, ActivityIndicator, SectionList, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Icon, Text } from 'native-base';
import { Col, Grid } from 'react-native-easy-grid'
import _ from 'lodash'

const AnimatedSectionList = Animated.createAnimatedComponent(SectionList);

import { formatPrice } from '../utils/formatting'

const styles = StyleSheet.create({
  sectionHeader: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#f7f7f7'
  },
  sectionHeaderText: {
    color: '#3e3e3e',
    fontSize: 15,
    textAlign: 'center'
  },
  item: {
    paddingRight: 10,
    paddingLeft: 25,
    paddingVertical: 15,
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
    marginRight: 10
  },
  rightCol: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 20,
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
});

const ItemSeparatorComponent = () => (
  <View style={ styles.itemSeparator } />
)

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

    let rightIconName = 'plus'
    let rightIconStyle = [ styles.rightIcon ]

    if (enabled) {
      itemProps = {
        onPress: () => this.props.onItemClick(item),
      }
    } else {
      itemNameStyle.push(styles.disabledText)
      itemPriceStyle.push(styles.disabledText)

      rightIconName = 'ban'
      rightIconStyle.push(styles.disabledText)
    }

    const isLoading = this.props.isItemLoading(item)

    return (
      <TouchableOpacity style={ styles.item } { ...itemProps } testID={ `menuItem:${section.index}:${index}` }>
        <View style={{ flex: 3 }}>
          <Text style={ itemNameStyle }>{ item.name }</Text>
          { (item.description && item.description.length > 0) && (
            <Text note numberOfLines={4} ellipsizeMode="tail">{ item.description }</Text>
          )}
        </View>

        <View style={ styles.rightCol }>
          <Text style={ itemPriceStyle }>{ `${formatPrice(item.offers.price)}€` }</Text>
          { isLoading && <ActivityIndicator size="small" style={{ position: 'absolute', right: 0 }} /> }
        </View>
      </TouchableOpacity>
    )
  }

  render() {

    const { menu } = this.props
    const {paddingHeight, animatedY, onScroll} = this.props.collapsible;

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
        contentContainerStyle={{paddingTop: paddingHeight}}
        scrollIndicatorInsets={{top: paddingHeight}}
        onScroll={onScroll}
        testID="menu"
        sections={ sections }
        renderItem={ ({ item, index, section }) => this.renderItem(item, index, section) }
        renderSectionHeader={ ({ section }) => this.renderSectionHeader(section) }
        keyExtractor={ (item, index) => index }
        initialNumToRender={ 15 }
        ItemSeparatorComponent={ ItemSeparatorComponent } />
    )
  }
}

export default Menu
