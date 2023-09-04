import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Box, Text } from 'native-base'
import { useTranslation } from 'react-i18next'
import _ from 'lodash'

const Badge = ({ color, text }) => {
  return (
    <Box style={ [styles.item] } bg={ color }>
      <Text style={ styles.itemText } color="black">{ text }</Text>
    </Box>
  )
}

const RestrictedDiet = ({ items }) => {

  const { t } = useTranslation()

  if (!Array.isArray(items)) {
    items = _.values(items)
  }

  return (
    <View style={ styles.container }>
      { items.map(item => (
        <Badge key={ item }
          color="lightBlue.200"
          text={ t(`RESTRICTED_DIET.${item.replace('http://schema.org/', '')}`) } />
      )) }
    </View>
  )
}

const Allergen = ({ items }) => {

  const { t } = useTranslation()

  if (!Array.isArray(items)) {
    items = _.values(items)
  }

  return (
    <View style={ styles.container }>
      { items.map(item => (
        <Badge key={ item }
          color="amber.200"
          text={ t(`ALLERGEN.${item}`) } />
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
    borderRadius: 4,
    marginRight: 4,
    marginVertical: 2,
  },
  itemText: {
    fontSize: 10,
  },
})

export const AllergenList = Allergen
export const RestrictedDietList = RestrictedDiet
export const ZeroWasteBadge = () => {

  const { t } = useTranslation()

  return (
    <View style={ styles.container }>
      <Badge
        color="green.400"
        text={ t('ZERO_WASTE') } />
    </View>
  )
}
