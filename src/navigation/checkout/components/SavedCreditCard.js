import { Flex, Radio, Text } from 'native-base';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { PaymentIcon } from 'react-native-payment-icons';

const SavedCreditCard = ({ card }) => {
  const { t } = useTranslation();

  return (
    <Radio value={card.id} size="md" my="1" key={card.id}>
      <Flex direction="row">
        <PaymentIcon type={card.brand} width={60} />
        <Flex direction="column" ml={2}>
          <Text bold>**** {card.last4}</Text>
          <Text>
            {t('CREDIT_CARD_EXPIRATION')}: {card.expMonth}/{card.expYear}
          </Text>
        </Flex>
      </Flex>
    </Radio>
  );
};

export default SavedCreditCard;
