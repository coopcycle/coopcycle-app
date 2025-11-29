import React from 'react';
import { Text } from '@/components/ui/text';
import { connect } from 'react-redux';

import Paygreen from './CreditCard/Paygreen'
import Stripe from './CreditCard/Stripe'

import {
  selectPaymentGateway,
} from '../../../redux/Checkout/selectors';

const CreditCard = ({ paymentGateway }) => {

  if (paymentGateway === 'paygreen') {

    return (
      <Paygreen />
    )
  }

  return (
    <Stripe />
  )
}

function mapStateToProps(state) {

  return {
    paymentGateway: selectPaymentGateway(state),
  };
}

export default connect(mapStateToProps)(CreditCard);
