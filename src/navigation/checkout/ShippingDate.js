import React, { Component } from 'react'
import { Picker, View } from 'react-native'
import { Footer, FooterTab, Text, Button } from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import _ from 'lodash'
import moment from 'moment'

import { setDate } from '../../redux/Checkout/actions'
import FooterButton from './components/FooterButton'

class ShippingDate extends Component {

  constructor(props) {
    super(props)

    const date = props.dates[0]

    this.state = {
      date,
      time: props.timesByDate[date][0],
      times: [],
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

  render() {

    const { availabilities, dates } = this.props

    const date = this._resolveDate(this.state.date, this.state.time)
    const times = this.props.timesByDate[this.state.date]

    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>{ moment.parseZone(date).format('LL LT') }</Text>
        </View>
        <View style={{ flex: 3 }}>
          <Grid>
            <Row>
              <Col>
                <Picker
                  selectedValue={ this.state.date }
                  style={{ height: 50 }}
                  onValueChange={ this._onDateChange.bind(this) }>
                  { dates.map(d => (
                    <Picker.Item key={ d } label={ d } value={ d } />
                  )) }
                </Picker>
              </Col>
              <Col>
                <Picker
                  selectedValue={ this.state.time }
                  style={{ height: 50 }}
                  onValueChange={ this._onTimeChange.bind(this) }>
                  { times.map(time => (
                    <Picker.Item key={ time } label={ time } value={ time } />
                  )) }
                </Picker>
              </Col>
            </Row>
          </Grid>
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
    availabilities,
    hash,
  }
}

function mapDispatchToProps(dispatch) {

  return {
    setDate: (date, cb) => dispatch(setDate(date, cb)),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(ShippingDate))
