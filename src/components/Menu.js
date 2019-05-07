import React, { Component } from 'react'
import { Dimensions, Image, SectionList, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Icon, Text } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid'
import _ from 'lodash'
import moment from 'moment'

import { formatPrice } from '../Cart'

const styles = StyleSheet.create({
  sectionHeader: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderTopColor: '#f1f1f1'
  },
  sectionHeaderText: {
    fontFamily: 'Raleway-Regular',
    color: '#d9d9d9',
    fontSize: 14,
    fontWeight: 'bold'
  },
  item: {
    marginBottom: 10,
    paddingHorizontal: 15
  },
  heading: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  }
});

export default class Menu extends Component {

  renderSectionHeader(section) {
    return (
      <View style={ styles.sectionHeader }>
        <Text style={ styles.sectionHeaderText }>{ section.title }</Text>
      </View>
    )
  }

  renderItem(item) {
    return (
      <TouchableOpacity style={ styles.item } onPress={ () => this.props.onItemClick(item) }>
        <Grid>
          <Col size={ 4 }>
            <Text>{ item.name }</Text>
            { item.description && (<Text note>{ item.description }</Text>) }
            <Text style={{ color: '#828282', fontSize: 14 }}>{ formatPrice(item.offers.price) } €</Text>
          </Col>
          <Col size={ 1 } style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
            <Icon name="md-add" style={{ color: '#747474', fontSize: 22 }} />
          </Col>
        </Grid>
      </TouchableOpacity>
    )
  }

  render() {

    const { width } = Dimensions.get('window')
    const { date, menu, restaurant } = this.props

    let sections = []
    if (menu) {
      _.forEach(menu.hasMenuSection, menuSection => {
        sections.push({
          title: menuSection.name,
          data: menuSection.hasMenuItem
        })
      })
    }

    return (
      <View style={{ backgroundColor: '#fff' }}>
        <SectionList
          sections={ sections }
          renderItem={ ({ item }) => this.renderItem(item) }
          renderSectionHeader={ ({ section }) => this.renderSectionHeader(section) }
          keyExtractor={ (item, index) => index }
          initialNumToRender={ 15 }
          ListHeaderComponent={(
            <View style={{ flex: 1 }}>
              <Image
                style={{ flex: 1, width, height: 50 }}
                source={{ uri: restaurant.image }}
                resizeMode="cover" />
              <View style={ styles.heading }>
                <Text style={{ flex: 2, fontFamily: 'Raleway-Regular' }}>{ restaurant.name }</Text>
                <Text style={{ flex: 1, fontFamily: 'Raleway-Regular', textAlign: 'right' }}>{ moment(date).format('ddd LT') }</Text>
              </View>
            </View>
          )}
        />
      </View>
    )
  }
}
