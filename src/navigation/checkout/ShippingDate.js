import React, { Component } from 'react'
import { TouchableOpacity, View, StyleSheet } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { Text, HStack, Heading } from 'native-base'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import _ from 'lodash'
import moment from 'moment'

import { setDate, setDateAsap, setFulfillmentMethod } from '../../redux/Checkout/actions'
import FooterButton from './components/FooterButton'
import {selectCartFulfillmentMethod, selectIsCollectionEnabled, selectIsDeliveryEnabled} from '../../utils/checkout';

const FulfillmentMethodButton = withTranslation()(({ type, enabled, active, onPress, t }) => {

  const titleStyle = [{ fontWeight: '700' }]
  if (active) {
    titleStyle.push({ color: 'white' })
  }
  if (!enabled) {
    titleStyle.push({ textDecorationLine: 'line-through', textDecorationStyle: 'solid' })
  }

  return (
    <TouchableOpacity style={ [ styles.fmBtn, { backgroundColor: active ? '#3498db' : 'transparent' } ] }
      onPress={ () => (enabled && !active) ? onPress() : null }>
      <Text style={ titleStyle }>
        { t(`FULFILLMENT_METHOD.${type}`) }
      </Text>
      <Text note style={ active ? { color: 'white' } : [] }>
        { active ? t('SELECTED') : ( enabled ? t('AVAILABLE') : t('COMING_SOON') ) }
      </Text>
    </TouchableOpacity>
  )
})

const FulfillmentMethodButtons = withTranslation()(({ fulfillmentMethod, isDeliveryEnabled, isCollectionEnabled, setValue }) => {

  const types = (isCollectionEnabled && !isDeliveryEnabled) ?
    ['collection', 'delivery'] : ['delivery', 'collection']

  const enabled = {
    delivery: isDeliveryEnabled,
    collection: isCollectionEnabled,
  }

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
      { _.map(types, (type) => (
        <FulfillmentMethodButton
          key={ type }
          type={ type }
          active={ fulfillmentMethod === type }
          enabled={ enabled[type] }
          onPress={ () => setValue(type) } />
      )) }
    </View>
  )
})

const rangeAsDateLabel = (range) => moment.parseZone(range[0]).format('LL')
const rangeAsTimeLabel = (range) => `${moment.parseZone(range[0]).format('LT')} - ${moment.parseZone(range[1]).format('LT')}`

const rangeAsString = (range) => range.join('/')
const stringAsRange = (text) => text.split('/')

class ShippingDate extends Component {

  constructor(props) {
    super(props)

    const defaultDate = props.dates[0]

    const date = props.shippingTimeRange ? rangeAsDateLabel(props.shippingTimeRange) : defaultDate
    const time = props.shippingTimeRange ? rangeAsString(props.shippingTimeRange)    : _.first(props.timesByDate[defaultDate])

    this.state = {
      date,
      time,
    }
  }

  _onDateChange(itemValue, itemIndex) {
    this.setState({
      date: itemValue,
      time: rangeAsTimeLabel(this.props.timesByDate[itemValue][0]),
    })
  }

  _onTimeChange(itemValue, itemIndex) {
    this.setState({ time: itemValue })
  }

  _onSubmit() {
    this.props.setDate(stringAsRange(this.state.time), this.props.cart, () => {
      this.props.navigation.goBack()
    })
  }

  _onAsap() {
    this.props.setDateAsap(this.props.cart, () => {
      this.props.navigation.goBack()
    })
  }

  render() {

    console.log(this.props)

    const { dates } = this.props

    const times = this.props.timesByDate[this.state.date] || this.props.timesByDate[dates[0]]

    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <FulfillmentMethodButtons
            fulfillmentMethod={ this.props.fulfillmentMethod }
            isDeliveryEnabled={ this.props.isDeliveryEnabled }
            isCollectionEnabled={ this.props.isCollectionEnabled }
            setValue={ method => {
              //console.log(method, this.props.cart)
              this.props.setFulfillmentMethod(method, this.props.cart)
            } } />
          <Heading textAlign="center" size="md" p="2">{ this.props.t('CHECKOUT_PICK_DATE') }</Heading>
          <HStack>
            <View style={{ flex: 1 }}>
              <Picker
                selectedValue={ this.state.date }
                style={{ height: 50 }}
                onValueChange={ this._onDateChange.bind(this) }>
                { dates.map(d => (
                  <Picker.Item key={ d } label={ d } value={ d } />
                )) }
              </Picker>
            </View>
            <View style={{ flex: 1 }}>
              <Picker
                selectedValue={ this.state.time }
                style={{ height: 50 }}
                onValueChange={ this._onTimeChange.bind(this) }>
                { times.map(time => (
                  <Picker.Item key={ time.value } label={ time.label } value={ time.value } />
                )) }
              </Picker>
            </View>
          </HStack>
          <View style={{ flex: 0, paddingVertical: 30, justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity onPress={ this._onAsap.bind(this) }>
              <Text>{ this.props.t('DELIVERY_ASAP') }</Text>
            </TouchableOpacity>
          </View>
        </View>
        <FooterButton
          text={ this.props.t('SUBMIT') }
          onPress={ () => this._onSubmit() } />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  fmBtn: {
    width: '50%',
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
})

function mapStateToProps(state, ownProps) {
  const cart = ownProps.route.params?.cart || state.checkout.cart
  const restaurant = ownProps.route.params?.restaurant
  const ranges = state.checkout.timing.ranges
  const groupBy = _.groupBy(ranges, item => rangeAsDateLabel(item))
  const timesByDate = _.mapValues(groupBy, items => _.map(items, item => ({
    label: rangeAsTimeLabel(item),
    value: rangeAsString(item),
  })))

  return {
    cart,
    restaurant,
    dates: _.keys(groupBy),
    timesByDate,
    shippingTimeRange: cart.shippingTimeRange,
    fulfillmentMethod: selectCartFulfillmentMethod(restaurant, cart),
    isDeliveryEnabled: selectIsDeliveryEnabled(restaurant),
    isCollectionEnabled: selectIsCollectionEnabled(restaurant),
  }
}

function mapDispatchToProps(dispatch) {

  return {
    setDate: (date, cart, cb) => dispatch(setDate(date, cart, cb)),
    setDateAsap: (cart, cb) => dispatch(setDateAsap(cart, cb)),
    setFulfillmentMethod: (method, cart) => dispatch(setFulfillmentMethod(method, cart)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(ShippingDate))
