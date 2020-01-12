import React, { Component } from 'react'
import { Animated, ActivityIndicator, SectionList, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Icon, Text } from 'native-base';
import { Col, Grid } from 'react-native-easy-grid'
import _ from 'lodash'
import {withCollapsible} from 'react-navigation-collapsible'

const AnimatedSectionList = Animated.createAnimatedComponent(SectionList);

import { formatPrice } from '../utils/formatting'

const styles = StyleSheet.create({
  sectionHeader: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderTopColor: '#f1f1f1',
  },
  sectionHeaderText: {
    fontFamily: 'Raleway-Regular',
    color: '#d9d9d9',
    fontSize: 14,
    fontWeight: 'bold',
  },
  item: {
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  disabledText: {
    color: '#a7a7a7',
  },
  itemPrice: {
    color: '#828282',
    fontSize: 14,
  },
  rightCol: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  rightIcon: {
    color: '#747474',
    fontSize: 22,
  },
});

const collapsibleParams = {
  collapsibleComponent: GroupImageHeader,
  collapsibleBackgroundStyle: {
    height: 200,
    backgroundColor: '#061',
    disableFadeoutInnerComponent: true,
  },
};

// eslint-disable-next-line no-unused-vars
const GroupImageHeader = ({ navigation, collapsible }) => {

  console.log('GroupImageHeader', collapsible)

  const restaurant = navigation.getParam('restaurant')

  // eslint-disable-next-line no-unused-vars
  const { translateY, translateOpacity, translateProgress } = collapsible;

  return (
    <View style={{ width: '100%', height: '100%', justifyContent: 'center' }}>
      <Image
        source={{ uri: restaurant.image }}
        resizeMode="cover"
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          opacity: 0.5,
        }}
      />
      <Animated.Image
        source={{ uri: restaurant.image }}
        resizeMode="cover"
        style={{
          transform: [{scale: translateOpacity}],
          alignSelf: 'center',
          width: 100,
          height: 100,
          borderWidth: 4,
          borderColor: 'white',
          borderRadius: 50,
        }}
      />
    </View>
  );
};

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
        <Grid>
          <Col size={ 4 }>
            <Text style={ itemNameStyle }>{ item.name }</Text>
            { item.description && ( <Text note>{ item.description }</Text> ) }
            <Text style={ itemPriceStyle }>{ formatPrice(item.offers.price) } €</Text>
          </Col>
          <Col size={ 1 } style={ styles.rightCol }>
            { !isLoading && <Icon type="FontAwesome" name={ rightIconName } style={ rightIconStyle } /> }
            { isLoading  && <ActivityIndicator size="small" /> }
          </Col>
        </Grid>
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
          data: menuSection.hasMenuItem,
          index,
        })
      })
    }

    return (
      <AnimatedSectionList
        contentContainerStyle={{paddingTop: paddingHeight}}
        scrollIndicatorInsets={{top: paddingHeight}}
        // _mustAddThis={animatedY}
        onScroll={onScroll}
        testID="menu"
        sections={ sections }
        renderItem={ ({ item, index, section }) => this.renderItem(item, index, section) }
        renderSectionHeader={ ({ section }) => this.renderSectionHeader(section) }
        keyExtractor={ (item, index) => index }
        initialNumToRender={ 15 } />
    )
  }
}

// export default withCollapsible(Menu, collapsibleParams);

export default Menu
