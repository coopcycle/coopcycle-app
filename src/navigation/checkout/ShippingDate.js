import React, { Component } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { Picker } from '@react-native-community/picker'
import { Text } from 'native-base'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import _ from 'lodash'
import moment from 'moment'

import { setDate, setDateAsap } from '../../redux/Checkout/actions'
import { selectShippingDate, selectIsShippingAsap } from '../../redux/Checkout/selectors'
import FooterButton from './components/FooterButton'

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

    const date = this._resolveDate(this.state.date, this.state.time)
    const times = this.props.timesByDate[this.state.date]

    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
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
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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
  }
}

function mapDispatchToProps(dispatch) {

  return {
    setDate: (date, cb) => dispatch(setDate(date, cb)),
    setDateAsap: (cb) => dispatch(setDateAsap(cb)),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(ShippingDate))
