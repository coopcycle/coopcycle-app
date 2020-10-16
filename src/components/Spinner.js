import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import Spinner from 'react-native-loading-spinner-overlay'

import { selectIsTasksLoading } from '../redux/Courier/'
import { selectIsDispatchFetching } from '../redux/Dispatch/selectors'

class SpinnerWrapper extends Component {

  render() {

    return (
      <Spinner visible={ this.props.loading } />
    )
  }
}

function mapStateToProps(state) {

  return {
    loading: state.app.loading
      || selectIsTasksLoading(state)
      || selectIsDispatchFetching(state)
      || state.restaurant.isFetching
      || state.checkout.isFetching
      || false,
  }
}

export default connect(mapStateToProps)(withTranslation()(SpinnerWrapper))
