import React, { Component } from 'react'
import { connect } from 'react-redux'
import LegalText from '../../components/LegalText'
import { localeDetector } from '../../i18n'
import { acceptTermsAndConditions, loadTermsAndConditions } from '../../redux/App/actions'

class Terms extends Component {

  componentDidMount() {
    if (!this.props.loadingTerms && !this.props.termsAndConditionsText) {
      this.props.loadTermsAndConditions(this.props.language)
    }
  }

  render() {
    return (
      <LegalText
        type="terms"
        loading={ this.props.loadingTerms }
        text={ this.props.termsAndConditionsText }
        showConfirmationButtons={ this.props.route.params?.showConfirmationButtons }
        dispatchAccept={ (accepted) => this.props.acceptTermsAndConditions(accepted) } />
    )
  }
}

function mapStateToProps(state) {
  return {
    language: localeDetector(),
    loadingTerms: state.app.loadingTerms,
    termsAndConditionsText: state.app.termsAndConditionsText,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadTermsAndConditions: (lang) => dispatch(loadTermsAndConditions(lang)),
    acceptTermsAndConditions: (accepted) => dispatch(acceptTermsAndConditions(accepted)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Terms)
