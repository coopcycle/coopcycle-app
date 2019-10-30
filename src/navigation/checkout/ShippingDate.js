import React, { Component } from 'react'
import { Picker, StyleSheet, View } from 'react-native'
import { Container, Content, Footer, FooterTab, Text, Button } from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import _ from 'lodash'
import moment from 'moment'

import { setDate } from '../../redux/Checkout/actions'

class ShippingDate extends Component {

  _onDateChange(itemValue, itemIndex) {

    const { availabilities, date } = this.props

    let value = _.find(availabilities, item =>
      moment(item).format('LL') === itemValue && moment(item).format('LT') === moment(date).format('LT'))
    if (!value) {
      value = _.find(availabilities, item => moment(item).format('LL') === itemValue)
    }

    this.props.setDate(value)
  }

  _onTimeChange(itemValue, itemIndex) {

    const { hash } = this.props
    const key = _.findKey(hash, item => item[1] === itemValue)

    this.props.setDate(key)
  }

  render() {

    const { availabilities, date } = this.props

    const selectedDate = moment(date).format('LL')
    const selectedTime = moment(date).format('LT')

    const groupBy = _.groupBy(availabilities, item => moment(item).format('LL'))

    const dates = _.keys(groupBy)
    const times = _.map(groupBy[selectedDate], item => moment(item).format('LT'))

    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>{ moment(date).format('LL LT') }</Text>
        </View>
        <View style={{ flex: 3 }}>
          <Grid>
            <Row>
              <Col>
                <Picker
      					  selectedValue={ selectedDate }
      					  style={{ height: 50 }}
      					  onValueChange={ this._onDateChange.bind(this) }>
                  { dates.map(date => (
                    <Picker.Item key={ date } label={ date } value={ date } />
                  )) }
      					</Picker>
              </Col>
              <Col>
                <Picker
                  selectedValue={ selectedTime }
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
        <Footer>
          <FooterTab>
            <Button full onPress={ () => this.props.navigation.goBack() }>
              <Text>{ this.props.t('SUBMIT') }</Text>
            </Button>
          </FooterTab>
        </Footer>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  decrement: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
  },
  increment: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 10,
  }
});

function mapStateToProps(state) {

  const availabilities = state.checkout.timing.choices

  const hash = _.zipObject(availabilities, _.map(availabilities, item => ([
    moment(item).format('LL'),
    moment(item).format('LT')
  ])))

  return {
    date: !!state.checkout.date ? state.checkout.date : state.checkout.timing.asap,
    availabilities,
    hash
  }
}

function mapDispatchToProps(dispatch) {

  return {
    setDate: date => dispatch(setDate(date)),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(ShippingDate))
