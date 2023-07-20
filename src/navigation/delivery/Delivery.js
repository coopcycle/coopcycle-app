import React, { Component } from 'react';

import WebView from 'react-native-webview';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import _ from 'lodash';

class Delivery extends Component {
  render() {
    console.log(this.props.defaultDeliveryFormUrl);
    return (
      <WebView
        source={{ uri: this.props.defaultDeliveryFormUrl }}
      />
    );
  }
}

function mapStateToProps(state) {
  const publicServers =
    _.filter(state.app.servers, s => !!s.coopcycle_url)

  const showAbout =
    _.includes(publicServers.map(s => s.coopcycle_url), state.app.baseURL)

  return {
    defaultDeliveryFormUrl: state.app.settings.default_delivery_form_url,
  }
}

export default connect(mapStateToProps)(withTranslation()(Delivery))
