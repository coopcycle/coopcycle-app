import React, { Component } from 'react';
import { connect } from 'react-redux';

import { checkoutWithCash } from '../../redux/Checkout/actions';
import CashOnDelivery from './components/CashOnDelivery';

class PaymentMethodCashOnDelivery extends Component {
  _onSubmit() {
    this.props.checkoutWithCash();
  }

  render() {
    return <CashOnDelivery onSubmit={this._onSubmit.bind(this)} />;
  }
}

function mapStateToProps(state) {
  return {
    errors: state.checkout.errors,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    checkoutWithCash: () => dispatch(checkoutWithCash()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PaymentMethodCashOnDelivery);
