import { HStack } from '@/components/ui/hstack';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native';

import { resolveFulfillmentMethod } from '../../../utils/order';

const OrderAcceptedFooter = ({
  order,
  onPressCancel,
  onPressDelay,
  onPressFulfill,
}) => {
  const { t } = useTranslation();

  const fulfillmentMethod = resolveFulfillmentMethod(order);

  return (
    <HStack>
      <Button
        variant="outline"
        action="negative"
        onPress={onPressCancel}
        className="grow mx-2">
        <ButtonText>
          {t('RESTAURANT_ORDER_BUTTON_CANCEL')}
        </ButtonText>
      </Button>
      <Button
        variant="outline"
        onPress={onPressDelay}
        className="grow mx-2">
        <ButtonText>
          {t('RESTAURANT_ORDER_BUTTON_DELAY')}
        </ButtonText>
      </Button>
      {fulfillmentMethod === 'collection' && (
        <Button
          variant="outline"
          action="positive"
          onPress={onPressFulfill}
          className="grow mx-2">
          <ButtonText>
            {t('RESTAURANT_ORDER_BUTTON_FULFILL')}
          </ButtonText>
        </Button>
      )}
    </HStack>
  );
};

export default OrderAcceptedFooter;
