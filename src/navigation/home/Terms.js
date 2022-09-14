import React, { Component } from 'react'
import { connect } from 'react-redux'
import LegalText from '../../components/LegalText'
import { localeDetector } from '../../i18n'
import { loadTermsAndConditions } from '../../redux/App/actions'

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
        showConfirmationButtons={ this.props.route.params?.showConfirmationButtons } />
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
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Terms)
