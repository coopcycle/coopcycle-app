import React, { Component } from 'react';

import WebView from 'react-native-webview';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import _ from 'lodash';

class Delivery extends Component {
  render() {
    return (
      <WebView
        source={{ uri: this.props.defaultDeliveryFormUrl }}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    defaultDeliveryFormUrl: state.app.settings.default_delivery_form_url,
  }
}

export default connect(mapStateToProps)(withTranslation()(Delivery))
