import React, { useEffect, useCallback } from 'react'
import { FlatList } from 'react-native'
import { Box, Text, HStack, VStack, Heading, Input, Button } from 'native-base'
import { connect } from 'react-redux'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Formik } from 'formik'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'

import { loadLoopeatFormats, updateLoopeatFormats } from '../../redux/Restaurant/actions'

function LoopeatFormats({ route, order, loopeatFormats, loadLoopeatFormats, updateLoopeatFormats }) {

  const { t } = useTranslation()
  const navigation = useNavigation()

  const fetchLoopeatFormats = useCallback(() => {
    loadLoopeatFormats(order)
  }, [ loadLoopeatFormats, order ])

  useEffect(() => {
    fetchLoopeatFormats()
  }, [ fetchLoopeatFormats ])

  if (loopeatFormats.length === 0) {
    return
  }

  const initialValues = { loopeatFormats: loopeatFormats }

  return (
    <SafeAreaView flex={ 1 } edges={[ 'bottom' ]}>
      <Box flex={ 1 }>
        <Text p="3">{ t('RESTAURANT_LOOPEAT_DISCLAIMER') }</Text>
        <Formik
          initialValues={ initialValues }
          onSubmit={ values => {
            updateLoopeatFormats(order, values.loopeatFormats, (updatedOrder) => navigation.navigate('RestaurantOrder', { order: updatedOrder }))
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <>
              <FlatList
                data={ values.loopeatFormats }
                keyExtractor={ (item, index) => `loopeat_format_item_#${index}` }
                renderItem={ ({ item, index }) => (
                  <VStack mb="3" px="3">
                    <Heading size="sm">{ item.orderItem.name }</Heading>
                    { item.formats.map((format, formatIndex) =>
                      <HStack mb="2" key={ `loopeat_format_#${formatIndex}` } alignItems="center" justifyContent="space-between">
                        <Text>{ format.format_name }</Text>
                        <Input
                          w="25%"
                          keyboardType="number-pad"
                          returnKeyType="done"
                          maxLength={ 2 }
                          value={ `${values.loopeatFormats[index]?.formats[formatIndex]?.quantity}` }
                          onChangeText={ handleChange(`loopeatFormats.${index}.formats.${formatIndex}.quantity`) } />
                      </HStack>
                    ) }
                  </VStack>
                ) } />
              <Box px="3">
                <Button onPress={ handleSubmit }>{ t('VALIDATE') }</Button>
              </Box>
            </>
          )}
        </Formik>
      </Box>
    </SafeAreaView>
  )
}

function mapStateToProps(state, ownProps) {

  const order = ownProps.route.params?.order

  return {
    order,
    loopeatFormats: Object.prototype.hasOwnProperty.call(state.restaurant.loopeatFormats, order['@id']) ?
      state.restaurant.loopeatFormats[order['@id']] : [],
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadLoopeatFormats: order => dispatch(loadLoopeatFormats(order)),
    updateLoopeatFormats: (order, loopeatFormats, cb) => dispatch(updateLoopeatFormats(order, loopeatFormats, cb)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoopeatFormats)
