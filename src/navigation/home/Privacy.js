import React, { Component } from 'react'
import LegalText from '../../components/LegalText'

class Privacy extends Component {

  render() {
    return (
      <LegalText
        type="privacy"
        showConfirmationButtons={this.props.route.params?.showConfirmationButtons} />
    )
  }
}

export default Privacy
