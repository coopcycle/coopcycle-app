import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { Container, Content } from 'native-base'

import { LocaleConfig, Calendar } from 'react-native-calendars'
import moment from 'moment'
import { withTranslation } from 'react-i18next'

import { connect } from 'react-redux'
import { localeDetector } from '../../i18n'
import { changeDate } from '../../redux/Dispatch/actions'

const LOCALE = localeDetector()

LocaleConfig.locales[LOCALE] = {
  monthNames: moment.months(),
  monthNamesShort: moment.monthsShort(),
  dayNames: moment.weekdays(),
  dayNamesShort: moment.weekdaysMin(),
};

LocaleConfig.defaultLocale = LOCALE;

class DateScreen extends Component {

  onDateChange(dateString) {
    const { navigate } = this.props.navigation

    this.props.changeDate(moment(dateString))
    this.props.navigation.goBack()
  }

  render() {

    return (
      <Container>
        <Content padder>
          <Calendar
            current={ this.props.date.format('YYYY-MM-DD') }
            onDayPress={ ({ dateString }) => this.onDateChange(dateString) }
            theme={{
              textDayFontSize: 18,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 18,
            }} />
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: '#fff',
    paddingTop: 30,
    paddingHorizontal: 15,
  },
})

function mapStateToProps(state) {
  return {
    date: state.dispatch.date,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    changeDate: date => dispatch(changeDate(date)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(DateScreen))
