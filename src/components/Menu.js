import React, { Component } from 'react'
import { ActivityIndicator, SectionList, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Column, Flex, Heading, Image, Row, Text } from 'native-base';
import _ from 'lodash'


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

const SectionHeader = ({ section }) => {

  if (section.data.length === 0) {
    return <></>
  }

  return (
    <Heading
      _dark={{ color: 'white', bg: 'black' }}
      _light={{ color: '#3e3e3e', bg: 'white' }}
      textAlign="center"
      size="md"
      py="2">{ section.title }</Heading>
  )
}

class Menu extends Component {
  shouldComponentUpdate(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean {
    //TODO: Update on itemsStackHandler change
    return false
  }

  renderItem(item, index, section) {

    // If the "enabled" key does not exist, fallback to true
    const enabled = item.hasOwnProperty('enabled') ? item.enabled : true

    let itemProps = {}
    let itemNameStyle = [{ fontSize: 16 }]
    let itemDescriptionStyle = [styles.descriptionText]
    let itemPriceStyle = [{ paddingTop: 3 }]

    if (enabled) {
      itemProps = {
        onPress: () => this.props.onItemClick(item),
      }
    } else {
      itemNameStyle.push(styles.disabledText)
      itemPriceStyle.push(styles.disabledText)
      itemDescriptionStyle.push(styles.disabledText)
    }

    const isLoading = this.props.isItemLoading(item)

    const image1x1 = item.images && Array.isArray(item.images)
      && _.find(item.images, image => image.ratio === '1:1')

    return (
      <TouchableOpacity style={ styles.itemContainer } { ...itemProps } testID={ `menuItem:${section.index}:${index}` }>
        <Flex mx="2" flexDirection="row" justifyContent="space-between">
          <Column flexShrink="1">
            <Text style={ itemNameStyle }>{ item.name }</Text>
            { item.description && item.description.length > 0 &&
              <Text style={ itemDescriptionStyle } note numberOfLines={ 3 } ellipsizeMode="tail">{ item.description }</Text>
            }
            <Row>
              <Text pr="2" fontSize="lg" style={ itemPriceStyle }>{ `${formatPrice(item.offers.price)}` }</Text>
              { isLoading && <ActivityIndicator color="#c7c7c7" size="small" style={ styles.loadingIndicator } /> }
            </Row>
          </Column>
          <Column>
            { image1x1 &&
              <Image size="lg" resizeMode="cover" borderRadius={5} source={{ uri: image1x1.url }} alt="Product" />
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
      <SectionList
        testID="menu"
        sections={ sections }
        renderItem={ ({ item, index, section }) => this.renderItem(item, index, section) }
        renderSectionHeader={ ({ section }) => <SectionHeader section={ section } /> }
        keyExtractor={ (item, index) => index }
        initialNumToRender={ 15 }
        ItemSeparatorComponent={ ItemSeparator }
        stickySectionHeadersEnabled={ true } />
    )
  }
}

export default Menu
