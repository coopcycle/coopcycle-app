import React, { Component } from 'react'
import { TouchableOpacity, View, StyleSheet } from 'react-native'
import { Picker } from '@react-native-community/picker'
import { Text } from 'native-base'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import _ from 'lodash'
import moment from 'moment'

import { setDate, setDateAsap, setFulfillmentMethod } from '../../redux/Checkout/actions'
import { selectShippingDate,
  selectIsShippingAsap, selectCartFulfillmentMethod,
  selectIsDeliveryEnabled, selectIsCollectionEnabled } from '../../redux/Checkout/selectors'
import FooterButton from './components/FooterButton'



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

const FulfillmentMethodButtons = withTranslation()(({ fulfillmentMethod, isDeliveryEnabled, isCollectionEnabled, setFulfillmentMethod }) => {

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
          type={ type }
          active={ fulfillmentMethod === type }
          enabled={ enabled[type] }
          onPress={ () => setFulfillmentMethod(type) } />
      )) }
    </View>
  )
})

class ShippingDate extends Component {

  constructor(props) {
    super(props)

    const defaultDate = props.dates[0]
    const date = props.isAsap ? defaultDate : moment.parseZone(props.shippingDate).format('LL')
    const time = props.isAsap ? props.timesByDate[defaultDate][0] : moment.parseZone(props.shippingDate).format('LT')

    this.state = {
      date,
      time,
    }
  }

  _onDateChange(itemValue, itemIndex) {
    this.setState({
      date: itemValue,
      time: this.props.timesByDate[itemValue][0],
    })
  }

  _onTimeChange(itemValue, itemIndex) {
    this.setState({ time: itemValue })
  }

  _resolveDate(date, time) {
    return _.findKey(this.props.hash, item => item[0] === date && item[1] === time)
  }

  _onSubmit() {
    const date = this._resolveDate(this.state.date, this.state.time)
    this.props.setDate(date, () => {
      this.props.navigation.goBack()
    })
  }

  _onAsap() {
    this.props.setDateAsap(() => {
      this.props.navigation.goBack()
    })
  }

  render() {

    const { dates } = this.props

    const times = this.props.timesByDate[this.state.date] || this.props.timesByDate[dates[0]]

    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <FulfillmentMethodButtons
            fulfillmentMethod={ this.props.fulfillmentMethod }
            isDeliveryEnabled={ this.props.isDeliveryEnabled }
            isCollectionEnabled={ this.props.isCollectionEnabled }
            setFulfillmentMethod={ this.props.setFulfillmentMethod } />
          <View style={{ alignItems: 'center', justifyContent: 'center', padding: 20, backgroundColor: '#ecf0f1' }}>
            <Text>{ this.props.t('CHECKOUT_PICK_DATE') }</Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'row' }}>
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
                  <Picker.Item key={ time } label={ time } value={ time } />
                )) }
              </Picker>
            </View>
          </View>
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
    paddingVertical: 20
  },
})

function mapStateToProps(state) {

  const availabilities = state.checkout.timing.choices

  const hash = _.zipObject(availabilities, _.map(availabilities, item => ([
    moment.parseZone(item).format('LL'),
    moment.parseZone(item).format('LT'),
  ])))

  const groupBy = _.groupBy(availabilities, item => moment.parseZone(item).format('LL'))
  const timesByDate = _.mapValues(groupBy, items => _.map(items, item => moment.parseZone(item).format('LT')))

  return {
    date: state.checkout.date ? state.checkout.date : state.checkout.timing.asap,
    dates: _.keys(groupBy),
    timesByDate,
    hash,
    isAsap: selectIsShippingAsap(state),
    shippingDate: selectShippingDate(state),
    fulfillmentMethod: selectCartFulfillmentMethod(state),
    isDeliveryEnabled: selectIsDeliveryEnabled(state),
    isCollectionEnabled: selectIsCollectionEnabled(state),
  }
}

function mapDispatchToProps(dispatch) {

  return {
    setDate: (date, cb) => dispatch(setDate(date, cb)),
    setDateAsap: (cb) => dispatch(setDateAsap(cb)),
    setFulfillmentMethod: (method, cb) => dispatch(setFulfillmentMethod(method, cb)),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(ShippingDate))
