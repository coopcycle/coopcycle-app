import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Button, Text, VStack, HStack, Box, Skeleton } from 'native-base';
import { useTranslation } from 'react-i18next';
import { authorize } from 'react-native-app-auth';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { useNavigation } from '@react-navigation/native';
import Config from 'react-native-config';
import {
  updateEdenredCredentials,
  loadPaymentDetails,
  checkout,
} from '../../redux/Checkout/actions';
import {
  selectCart,
} from '../../redux/Checkout/selectors';
import CreditCard from './components/CreditCard';
import { formatPrice } from '../../utils/formatting'
import HeaderHeightAwareKeyboardAvoidingView from '../../components/HeaderHeightAwareKeyboardAvoidingView';

const Edenred = ({ clientId, baseURL, cart, paymentDetailsLoaded, loadPaymentDetails, paymentDetails, errors, checkout, updateEdenredCredentials, authorizationEndpoint }) => {

  const navigation = useNavigation();
  const { t } = useTranslation();

  useEffect(() => {
    if (cart.hasEdenredCredentials) {
      loadPaymentDetails()
    } else {
      authorize({
        clientId: clientId,
        redirectUrl: `${Config.APP_AUTH_REDIRECT_SCHEME}://edenred`,
        serviceConfiguration: {
          authorizationEndpoint: `${authorizationEndpoint}/connect/authorize`,
          tokenEndpoint: `${baseURL}/edenred/connect/token`,
        },
        additionalParameters: {
          acr_values: 'tenant:fr-ctrtku',
          nonce: uuidv4(),
          ui_locales: 'fr-FR',
        },
        scopes: ['openid', 'edg-xp-mealdelivery-api', 'offline_access'],
        dangerouslyAllowInsecureHttpRequests: __DEV__,
        usePKCE: false,
      }).then(result => {
        updateEdenredCredentials(result.accessToken, result.refreshToken);
      }).catch(error => {
        navigation.navigate('CheckoutCreditCard');
      });
    }
  }, [ baseURL, cart.hasEdenredCredentials, clientId, loadPaymentDetails, navigation, updateEdenredCredentials, authorizationEndpoint ]);

  if (paymentDetailsLoaded && paymentDetails.breakdown) {
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
              <Text fontSize="md" fontWeight="bold">{ formatPrice(paymentDetails.breakdown.edenred) }</Text>
            </HStack>
            <HStack justifyContent="space-between">
              <Text fontSize="md">{ t('EDENRED_COMPLEMENT') }</Text>
              <Text fontSize="md">{ formatPrice(paymentDetails.breakdown.card) }</Text>
            </HStack>
          </VStack>
          <CreditCard
            cart={ cart }
            errors={ errors }
            shouldLoadPaymentDetails={ false }
            total={ paymentDetails.breakdown.card }
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
    clientId: state.app.settings.edenred_client_id,
    baseURL: state.app.baseURL,
    paymentDetailsLoaded: state.checkout.paymentDetailsLoaded,
    paymentDetails: state.checkout.paymentDetails,
    errors: state.checkout.errors,
    authorizationEndpoint: state.app.settings.edenred_authorization_endpoint,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadPaymentDetails: () => dispatch(loadPaymentDetails()),
    updateEdenredCredentials: (accessToken, refreshToken) => dispatch(updateEdenredCredentials(accessToken, refreshToken)),
    checkout: (cardholderName, savedCardSelected, saveCard) => dispatch(checkout(cardholderName, savedCardSelected, saveCard, true)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps,)(Edenred);
