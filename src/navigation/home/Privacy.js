import React, { Component } from 'react'
import { connect } from 'react-redux'
import LegalText from '../../components/LegalText'
import { localeDetector } from '../../i18n'
import { acceptPrivacyPolicy, loadPrivacyPolicy } from '../../redux/App/actions'

class Privacy extends Component {

  componentDidMount() {
    if (!this.props.loadingPrivacyPolicy && !this.props.privacyPolicyText) {
      this.props.loadPrivacyPolicy(this.props.language)
    }
  }

  render() {
    return (
      <LegalText
        type="privacy"
        loading={ this.props.loadingPrivacyPolicy }
        text={ this.props.privacyPolicyText }
        showConfirmationButtons={this.props.route.params?.showConfirmationButtons}
        dispatchAccept={ (accepted) => this.props.acceptPrivacyPolicy(accepted) } />
    )
  }
}

function mapStateToProps(state) {
  return {
    language: localeDetector(),
    loadingPrivacyPolicy: state.app.loadingPrivacyPolicy,
    privacyPolicyText: state.app.privacyPolicyText,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadPrivacyPolicy: (lang) => dispatch(loadPrivacyPolicy(lang)),
    acceptPrivacyPolicy: (accepted) => dispatch(acceptPrivacyPolicy(accepted)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Privacy)
