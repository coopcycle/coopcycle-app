import React, { Component } from 'react';

import WebView from 'react-native-webview';
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux';

class Delivery extends Component {
  render() {
    return (
      <WebView
        source={{
          uri: 'https://demo.coopcycle.org/es/forms/re10dJzd7Wk2',
        }}
      />
    );
  }
}

function mapStateToProps(state) {
  return {}
}

function mapDispatchToProps(dispatch) {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Delivery))
