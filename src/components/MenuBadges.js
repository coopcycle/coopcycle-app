import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Box, Text } from 'native-base'
import { withTranslation } from 'react-i18next'
import _ from 'lodash'

const RestrictedDiet = ({ items, t }) => {

  if (!Array.isArray(items)) {
    items = _.values(items)
  }

  return (
    <View style={ styles.container }>
      { items.map(item => (
        <Box key={ item } style={ [ styles.item ] } bg="lightBlue.300">
          <Text style={ styles.itemText } color="black">{ t(`RESTRICTED_DIET.${item.replace('http://schema.org/', '')}`) }</Text>
        </Box>
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
        <Box key={ item } style={ [ styles.item ] } bg="amber.300">
          <Text style={ styles.itemText } color="black">{ t(`ALLERGEN.${item}`) }</Text>
        </Box>
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
  },
})

export const AllergenList = withTranslation()(Allergen)
export const RestrictedDietList = withTranslation()(RestrictedDiet)
