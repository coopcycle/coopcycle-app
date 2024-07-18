import React, { Component } from 'react';
import { connect } from 'react-redux';

import { checkout } from '../../redux/Checkout/actions';
import { selectCart } from '../../redux/Checkout/selectors';
import CreditCard from './components/CreditCard';
import HeaderHeightAwareKeyboardAvoidingView from '../../components/HeaderHeightAwareKeyboardAvoidingView'

class PaymentMethodCard extends Component {
  _onSubmit(values) {
    const { cardholderName, savedCardSelected, saveCard, paygreenPaymentOrderId } = values;

    this.props.checkout(cardholderName, savedCardSelected, saveCard, paygreenPaymentOrderId);
  }

  render() {
    const { cart, errors } = this.props;

    return (
      <HeaderHeightAwareKeyboardAvoidingView>
        <CreditCard
          cart={cart}
          errors={errors}
          onSubmit={this._onSubmit.bind(this)}
        />
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
  return {
    checkout: (cardholderName, savedCardSelected, saveCard, paygreenPaymentOrderId) =>
      dispatch(checkout(cardholderName, savedCardSelected, saveCard, paygreenPaymentOrderId)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentMethodCard);
