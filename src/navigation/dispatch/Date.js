import React, { Component } from 'react'
import { Container, Content } from 'native-base'

import { Calendar } from 'react-native-calendars'
import moment from 'moment'
import { withTranslation } from 'react-i18next'

import { connect } from 'react-redux'
import { changeDate } from '../../redux/Dispatch/actions'
import { selectSelectedDate } from 'coopcycle-frontend-js/dispatch/redux'

class DateScreen extends Component {

  onDateChange(dateString) {
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

function mapStateToProps(state) {
  return {
    date: selectSelectedDate(state),
  }
}

function mapDispatchToProps(dispatch) {
  return {
    changeDate: date => dispatch(changeDate(date)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(DateScreen))
