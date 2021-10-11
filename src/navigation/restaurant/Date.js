import React, { Component } from 'react'
import { Center } from 'native-base'

import { Calendar } from 'react-native-calendars'
import moment from 'moment'
import { withTranslation } from 'react-i18next'

import { connect } from 'react-redux'
import { changeDate } from '../../redux/Restaurant/actions'

class DateScreen extends Component {

  onDateChange(dateString) {
    this.props.changeDate(moment(dateString))
    this.props.navigation.goBack()
  }

  render() {

    return (
      <Center flex={1}>
        <Calendar
          current={ this.props.date.format('YYYY-MM-DD') }
          onDayPress={ ({ dateString }) => this.onDateChange(dateString) }
          theme={{
            textDayFontSize: 18,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 18,
          }} />
      </Center>
    )
  }
}

function mapStateToProps(state) {
  return {
    date: state.restaurant.date,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    changeDate: date => dispatch(changeDate(date)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(DateScreen))
