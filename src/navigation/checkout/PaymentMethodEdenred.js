import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Button, Text, VStack, HStack, Box, Skeleton } from 'native-base';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import _ from 'lodash';
import {
  checkout,
  loadPaymentDetailsOrAuthorizeEdenred,
} from '../../redux/Checkout/actions';
import {
  selectCart,
} from '../../redux/Checkout/selectors';
import CreditCard from './components/CreditCard';
import { formatPrice } from '../../utils/formatting'
import HeaderHeightAwareKeyboardAvoidingView from '../../components/HeaderHeightAwareKeyboardAvoidingView';

const Edenred = ({ cart, paymentDetailsLoaded, paymentDetails, errors, checkout, loadPaymentDetailsOrAuthorizeEdenred }) => {

  const navigation = useNavigation();
  const { t } = useTranslation();

  useEffect(() => {
    loadPaymentDetailsOrAuthorizeEdenred();
  }, [ cart.hasEdenredCredentials, loadPaymentDetailsOrAuthorizeEdenred ]);

  if (paymentDetailsLoaded && paymentDetails.payments.length === 2) {

    const cardPayment    = _.find(paymentDetails.payments, p => p.method.code === 'CARD');
    const edenredPayment = _.find(paymentDetails.payments, p => p.method.code === 'EDENRED')

    return (
      <HeaderHeightAwareKeyboardAvoidingView>
        <VStack p="2" flex={1} justifyContent="space-between">
          <VStack>
            <HStack justifyContent="space-between">
              <Text fontSize="md">{ t('TOTAL') }</Text>
              <Text fontSize="md">{ formatPrice(cart.total) }</Text>
            </HStack>
            <HStack justifyContent="space-between">
              <Text fontSize="md" fontWeight="bold">{ t('EDENRED_ELIGIBLE_AMOUNT') }</Text>
              <Text fontSize="md" fontWeight="bold">{ formatPrice(edenredPayment.amount) }</Text>
            </HStack>
            <HStack justifyContent="space-between">
              <Text fontSize="md">{ t('EDENRED_COMPLEMENT') }</Text>
              <Text fontSize="md">{ formatPrice(cardPayment.amount) }</Text>
            </HStack>
          </VStack>
          <CreditCard
            cart={ cart }
            errors={ errors }
            shouldLoadPaymentDetails={ false }
            total={ cardPayment.amount }
            onSubmit={ (values) => {
              const { cardholderName, savedCardSelected, saveCard } = values;
              checkout(cardholderName, savedCardSelected, saveCard);
            }}
          />
        </VStack>
      </HeaderHeightAwareKeyboardAvoidingView>
    )
  }

  return (
    <VStack flex={ 1 } p="2" justifyContent="space-between">
      <Skeleton.Text />
      <HStack p="3">
        <Skeleton startColor="primary.300" />
      </HStack>
    </VStack>
  )
}

function mapStateToProps(state) {
  return {
    cart: selectCart(state)?.cart,
    paymentDetailsLoaded: state.checkout.paymentDetailsLoaded,
    paymentDetails: state.checkout.paymentDetails,
    errors: state.checkout.errors,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    checkout: (cardholderName, savedCardSelected, saveCard) => dispatch(checkout(cardholderName, savedCardSelected, saveCard, true)),
    loadPaymentDetailsOrAuthorizeEdenred: () => dispatch(loadPaymentDetailsOrAuthorizeEdenred()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps,)(Edenred);
