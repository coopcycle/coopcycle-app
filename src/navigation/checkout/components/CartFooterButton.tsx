import React, { useEffect, useRef, useCallback } from 'react';
import { Button, ButtonText, ButtonIcon } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react-native'
import { Text } from '@/components/ui/text';
import { withTranslation, useTranslation } from 'react-i18next';
import { Animated, View } from 'react-native';

import { formatPrice } from '../../../utils/formatting';
import {
  isRestaurantOrderingAvailable,
  shouldShowPreOrder,
} from '../../../utils/checkout';

interface CartFooterButtonProps {
  testID: string;
  isLoading?: boolean;
  disabled?: boolean;
  onPress(): unknown;
}

const ButtonLeft = () => {

  return (
    <ButtonIcon
      as={ShoppingCart}
      size="sm"
      className="mr-1"
    />
  );
}

const ButtonRight = ({ opacity, total }) => {

  return (
    <Animated.View style={{ opacity }}>
      <ButtonText>
        {`${formatPrice(total)}`}
      </ButtonText>
    </Animated.View>
  );
}

const CartFooterButton = ({ cart, restaurant, onPress, testID, loading, disabled }: CartFooterButtonProps) => {

  const { t } = useTranslation();

  const opacity = useRef(new Animated.Value(1)).current;

  const animate = useCallback(() => {
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 0.4,
        duration: 500,
        useNativeDriver: false,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: false,
      }),
    ]).start();
  }, [])

  useEffect(animate, [cart.total, opacity]);

  const isAvailable = isRestaurantOrderingAvailable(restaurant);
  const showPreOrder = shouldShowPreOrder(restaurant);

  if (!cart || cart.items.length === 0 || !isAvailable) {
    return <View />;
  }

  const label = showPreOrder
    ? t('SCHEDULE_ORDER')
    : t('ORDER');

  return (
    <Button
      onPress={onPress}
      testID={testID}
      isLoading={loading}
      isDisabled={disabled}
      className="w-full px-4"
      >
        <ButtonLeft />
        <ButtonText>
          {label}
        </ButtonText>
        <ButtonRight opacity={opacity} total={cart.total} />
    </Button>
  );
}

export default withTranslation()(CartFooterButton);
