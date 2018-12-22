import React, { Component } from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import Spinner from 'react-native-loading-spinner-overlay'

import { selectIsTasksLoading } from '../redux/Courier/'

class SpinnerWrapper extends Component {

  render() {

    return (
      <Spinner visible={ this.props.loading } />
    )
  }
}

function mapStateToProps(state) {

  return {
    loading: selectIsTasksLoading(state) || state.dispatch.isFetching || state.restaurant.isFetching || false
  }
}

export default connect(mapStateToProps)(translate()(SpinnerWrapper))
