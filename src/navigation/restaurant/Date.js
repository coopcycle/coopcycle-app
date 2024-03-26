import React, { Component } from 'react'

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
      <Calendar
        initialDate={this.props.date.format('YYYY-MM-DD')}
        markedDates={{
          [this.props.date.format('YYYY-MM-DD')]: { selected: true },
        }}
        onDateSelect={(momentDate) => {this.onDateChange(momentDate)}}
      />
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
