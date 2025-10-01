import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { Banknote, CreditCard } from 'lucide-react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Foundation from 'react-native-vector-icons/Foundation';

const paymentMethods = {
  CARD: {
    icon: CreditCard,
    description: 'card',
  },
  CASH_ON_DELIVERY: {
    icon: Banknote,
    description: 'cash_on_delivery',
  },
};

export const getIcon = paymentMethod => paymentMethods[paymentMethod]?.icon;

export const loadDescriptionTranslationKey = paymentMethod =>
  `PAYMENT_METHOD.${paymentMethods[paymentMethod]?.description}`;

export const isKnownPaymentMethod = paymentMethod =>
  Object.prototype.hasOwnProperty.call(paymentMethods, paymentMethod);

export const isDisplayPaymentMethodInList = paymentMethod => {
  if (!isKnownPaymentMethod(paymentMethod)) {
    return false;
  }

  return paymentMethod === 'CASH_ON_DELIVERY';
};

export const PaymentMethodInList = ({ paymentMethod }) => {
  if (!isDisplayPaymentMethodInList(paymentMethod)) {
    return null;
  }

  return <Icon as={getIcon(paymentMethod)} />;
};

export const PaymentMethodInOrderDetails = ({ paymentMethod }) => {
  const { t } = useTranslation();

  if (!isKnownPaymentMethod(paymentMethod)) {
    return null;
  }

  return (
    <HStack className="justify-between items-center p-2">
      <Icon size="xl" as={getIcon(paymentMethod)} />
      <Text>{t(loadDescriptionTranslationKey(paymentMethod))}</Text>
    </HStack>
  );
};

