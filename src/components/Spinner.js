import React, { Component, PureComponent } from 'react'
import { connect } from 'react-redux'
import Spinner from 'react-native-loading-spinner-overlay'

import {
  selectIsLoading,
  selectIsSpinnerDelayEnabled,
} from '../redux/App/selectors'

class SpinnerWrapper extends PureComponent {

  constructor(props) {

    super(props)

    this.state = {
      isLoading: props.loading,
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.loading !== this.props.loading) {
      if (this.props.isSpinnerDelayEnabled) {
        if (prevProps.loading && !this.props.loading) {
          // https://github.com/joinspontaneous/react-native-loading-spinner-overlay/issues/30
          setTimeout(() => this.setState({ isLoading: this.props.loading }), 250)
        } else {
          this.setState({ isLoading: this.props.loading })
        }
      } else {
        this.setState({ isLoading: this.props.loading })
      }
    }
  }

  render() {
    return (
      <Spinner visible={ this.state.isLoading } />
    )
  }
}

function mapStateToProps(state) {

  return {
    loading: selectIsLoading(state),
    isSpinnerDelayEnabled: selectIsSpinnerDelayEnabled(state)
  }
}

export default connect(mapStateToProps)(SpinnerWrapper)
