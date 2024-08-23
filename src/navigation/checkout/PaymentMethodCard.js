import React, { Component } from 'react';
import { connect } from 'react-redux';

import { selectCart } from '../../redux/Checkout/selectors';
import CreditCard from './components/CreditCard';
import HeaderHeightAwareKeyboardAvoidingView from '../../components/HeaderHeightAwareKeyboardAvoidingView';

class PaymentMethodCard extends Component {
  render() {
    const { cart, errors } = this.props;

    return (
      <HeaderHeightAwareKeyboardAvoidingView>
        <CreditCard cart={cart} errors={errors} />
      </HeaderHeightAwareKeyboardAvoidingView>
    );
  }
}

function mapStateToProps(state) {
  const cart = selectCart(state)?.cart;
  return {
    cart,
    errors: state.checkout.errors,
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentMethodCard);
