import React from 'react';
import { connect } from 'react-redux';

import { selectPaymentGateway } from '../../../redux/Checkout/selectors';
import CreditCardStripe from './CreditCardStripe'
import CreditCardPaygreen from './CreditCardPaygreen'

const CreditCard = (props) => {
    console.log('props', props)
    if (props.paymentGateway === 'paygreen') {
        return <CreditCardPaygreen { ...props } />
    }

    return <CreditCardStripe { ...props } />
}

const mapStateToProps = (state) => ({
  paymentGateway: selectPaymentGateway(state),
});

export default connect(mapStateToProps)(CreditCard);
