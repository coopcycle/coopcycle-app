import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Text } from 'native-base'
import { withTranslation } from 'react-i18next'
import _ from 'lodash'

const RestrictedDiet = ({ items, t }) => {

  if (!Array.isArray(items)) {
    items = _.values(items)
  }

  return (
    <View style={ styles.container }>
      { items.map(item => (
        <View key={ item } style={ [ styles.item, { backgroundColor: '#55efc4' } ] }>
          <Text style={ styles.itemText }>{ t(`RESTRICTED_DIET.${item.replace('http://schema.org/', '')}`) }</Text>
        </View>
      )) }
    </View>
  )
}

const Allergen = ({ items, t }) => {

  if (!Array.isArray(items)) {
    items = _.values(items)
  }

  return (
    <View style={ styles.container }>
      { items.map(item => (
        <View key={ item } style={ [ styles.item, { backgroundColor: '#fdcb6e' } ] }>
          <Text style={ styles.itemText }>{ t(`ALLERGEN.${item}`) }</Text>
        </View>
      )) }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginRight: 4,
    marginVertical: 2,
  },
  itemText: {
    fontSize: 10,
    color: '#ffffff',
  },
})

export const AllergenList = withTranslation()(Allergen)
export const RestrictedDietList = withTranslation()(RestrictedDiet)
