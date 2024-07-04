import React, { Component } from 'react';
import { connect } from 'react-redux';

import { checkout } from '../../redux/Checkout/actions';
import { selectCart } from '../../redux/Checkout/selectors';
import CreditCard from './components/CreditCard';
import HeaderHeightAwareKeyboardAvoidingView from '../../components/HeaderHeightAwareKeyboardAvoidingView'

class PaymentMethodCard extends Component {
  _onSubmit(values) {
    const { cardholderName, savedCardSelected, saveCard } = values;

    this.props.checkout(cardholderName, savedCardSelected, saveCard);
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
    checkout: (cardholderName, savedCardSelected, saveCard) =>
      dispatch(checkout(cardholderName, savedCardSelected, saveCard)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentMethodCard);
