import {
  Radio,
  RadioGroup,
  RadioIndicator,
  RadioIcon,
  RadioLabel,
} from '@/components/ui/radio';
import { CircleIcon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { PaymentIcon } from 'react-native-payment-icons';

const SavedCreditCard = ({ card }) => {
  const { t } = useTranslation();

  return (
    <Radio value={card.id} size="md" my="1" key={card.id}>
      <HStack className="items-center">
        <RadioIndicator>
          <RadioIcon as={CircleIcon} />
        </RadioIndicator>
        <HStack className="ml-2">
          <PaymentIcon type={card.brand} width={60} />
          <Text bold className="ml-2">**** {card.last4}</Text>
          <Text className="ml-2">
            {t('CREDIT_CARD_EXPIRATION')}: {card.expMonth}/{card.expYear}
          </Text>
        </HStack>
      </HStack>
    </Radio>
  );
};

export default SavedCreditCard;
