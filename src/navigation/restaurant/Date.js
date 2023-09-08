import React, { Component } from 'react'
import { Center } from 'native-base'

import { withTranslation } from 'react-i18next'

import { connect } from 'react-redux'
import { changeDate } from '../../redux/Restaurant/actions'
import { Calendar } from '../../components/Calendar'

class DateScreen extends Component {

  onDateChange(date) {
    this.props.changeDate(date)
    this.props.navigation.goBack()
  }

  render() {

    return (
      <Center flex={1}>
        <Calendar
          initialDate={this.props.date.format('YYYY-MM-DD')}
          markedDates={{
            [this.props.date.format('YYYY-MM-DD')]: { selected: true },
          }}
          onDateSelect={(momentDate) => {this.onDateChange(momentDate)}}
        />
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
