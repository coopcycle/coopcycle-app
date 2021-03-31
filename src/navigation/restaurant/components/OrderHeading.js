import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import { Icon, Text } from 'native-base'

import material from '../../../../native-base-theme/variables/material'
import OrderButtons from './OrderButtons'
import { resolveFulfillmentMethod } from '../../../utils/order'
import OrderFulfillmentMethodIcon from '../../../components/OrderFulfillmentMethodIcon'

const fallbackFormat = 'dddd D MMM'

const styles = StyleSheet.create({
  fulfillment: {
    backgroundColor: '#f9ca24',
    paddingHorizontal: material.contentPadding,
    paddingVertical: (material.contentPadding * 1.5),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  timeline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: material.contentPadding,
    marginBottom: 10,
  },
});

const OrderHeading = ({ order, isPrinterConnected, onPrinterClick, printOrder }) => {

  const { t } = useTranslation()

  const preparationExpectedAt = moment.parseZone(order.preparationExpectedAt)
  const pickupExpectedAt      = moment.parseZone(order.pickupExpectedAt)

  return (
    <View style={{ borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#CCCCCC' }}>
      <View style={ styles.fulfillment }>
        <OrderFulfillmentMethodIcon order={ order } />
        <Text style={{ fontWeight: '700' }}>{ moment(pickupExpectedAt).calendar(null, {
          lastDay : fallbackFormat,
          sameDay: `[${t('TODAY')}]`,
          nextDay: `[${t('TOMORROW')}]`,
          lastWeek : fallbackFormat,
          nextWeek : fallbackFormat,
          sameElse : fallbackFormat,
        }) }</Text>
        <Text>{ t(`FULFILLMENT_METHOD.${resolveFulfillmentMethod(order)}`) }</Text>
      </View>
      <View style={ styles.timeline }>
        <Icon type="FontAwesome" name="clock-o" />
        <View style={{ alignItems: 'flex-end' }}>
          <Text>{ t('RESTAURANT_ORDER_PREPARATION_EXPECTED_AT', { date: preparationExpectedAt.format('LT') }) }</Text>
          <Text>{ t('RESTAURANT_ORDER_PICKUP_EXPECTED_AT',      { date: pickupExpectedAt.format('LT') }) }</Text>
        </View>
      </View>
      <View style={{ marginBottom: 15 }}>
        <OrderButtons
          order={ order }
          isPrinterConnected={ isPrinterConnected }
          onPrinterClick={ onPrinterClick }
          printOrder={ printOrder } />
      </View>
    </View>
  )
}

export default OrderHeading
