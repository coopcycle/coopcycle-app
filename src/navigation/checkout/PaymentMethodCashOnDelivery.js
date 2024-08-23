import React, { Component } from 'react';
import { connect } from 'react-redux';

import CashOnDelivery from './components/CashOnDelivery';

class PaymentMethodCashOnDelivery extends Component {
  render() {
    return <CashOnDelivery />;
  }
}

function mapStateToProps(state) {
  return {
    errors: state.checkout.errors,
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PaymentMethodCashOnDelivery);
