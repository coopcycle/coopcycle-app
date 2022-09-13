import React, { Component } from 'react'
import LegalText from '../../components/LegalText'

class Terms extends Component {

  render() {
    return (
      <LegalText
        type="terms"
        showConfirmationButtons={this.props.route.params?.showConfirmationButtons} />
    )
  }
}

export default Terms
