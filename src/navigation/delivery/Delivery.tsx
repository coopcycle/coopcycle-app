import React, { Component } from 'react';

import { withTranslation } from 'react-i18next';
import WebView from 'react-native-webview';
import { connect } from 'react-redux';

class Delivery extends Component {
  render() {
    return <WebView source={{ uri: this.props.defaultDeliveryFormUrl }} />;
  }
}

function mapStateToProps(state) {
  return {
    defaultDeliveryFormUrl: state.app.settings.default_delivery_form_url,
  };
}

export default connect(mapStateToProps)(withTranslation()(Delivery));
