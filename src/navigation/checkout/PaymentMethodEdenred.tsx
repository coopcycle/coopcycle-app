import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import _ from 'lodash';
import {
  checkout,
  loadPaymentDetailsOrAuthorizeEdenred,
} from '../../redux/Checkout/actions';
import { selectCart } from '../../redux/Checkout/selectors';
import CreditCard from './components/CreditCard';
import { formatPrice } from '../../utils/formatting';
import HeaderHeightAwareKeyboardAvoidingView from '../../components/HeaderHeightAwareKeyboardAvoidingView';

const Edenred = ({
  cart,
  paymentDetailsLoaded,
  paymentDetails,
  errors,
  checkout,
  loadPaymentDetailsOrAuthorizeEdenred,
}) => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  useEffect(() => {
    loadPaymentDetailsOrAuthorizeEdenred();
  }, [cart.hasEdenredCredentials, loadPaymentDetailsOrAuthorizeEdenred]);

  if (paymentDetailsLoaded && paymentDetails.payments.length === 2) {
    const cardPayment = _.find(
      paymentDetails.payments,
      p => p.method.code === 'CARD',
    );
    const edenredPayment = _.find(
      paymentDetails.payments,
      p => p.method.code === 'EDENRED',
    );

    return (
      <HeaderHeightAwareKeyboardAvoidingView>
        <VStack className="p-2 justify-between"flex={1} >
          <VStack>
            <HStack className="justify-between">
              <Text size="md">{t('TOTAL')}</Text>
              <Text size="md">{formatPrice(cart.total)}</Text>
            </HStack>
            <HStack className="justify-between">
              <Text size="md" fontWeight="bold">
                {t('EDENRED_ELIGIBLE_AMOUNT')}
              </Text>
              <Text size="md" fontWeight="bold">
                {formatPrice(edenredPayment.amount)}
              </Text>
            </HStack>
            <HStack className="justify-between">
              <Text size="md">{t('EDENRED_COMPLEMENT')}</Text>
              <Text size="md">{formatPrice(cardPayment.amount)}</Text>
            </HStack>
          </VStack>
          <CreditCard
            cart={cart}
            errors={errors}
            shouldLoadPaymentDetails={false}
            total={cardPayment.amount}
            onSubmit={values => {
              const { cardholderName, savedCardSelected, saveCard } = values;
              checkout(cardholderName, savedCardSelected, saveCard);
            }}
          />
        </VStack>
      </HeaderHeightAwareKeyboardAvoidingView>
    );
  }

  return (
    <HeaderHeightAwareKeyboardAvoidingView>
      <VStack flex={1} className="p-2 justify-between">
        <SkeletonText className="h-2" _lines={3} />
        <Skeleton className="h-10" />
      </VStack>
    </HeaderHeightAwareKeyboardAvoidingView>
  );
};

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
    checkout: (cardholderName, savedCardSelected, saveCard) =>
      dispatch(checkout(cardholderName, savedCardSelected, saveCard, true)),
    loadPaymentDetailsOrAuthorizeEdenred: () =>
      dispatch(loadPaymentDetailsOrAuthorizeEdenred()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Edenred);
