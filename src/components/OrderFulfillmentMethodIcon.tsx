import { Icon } from '@/components/ui/icon';
import { Bike, Box as BoxIcon } from 'lucide-react-native'
import React from 'react';

import { resolveFulfillmentMethod } from '../utils/order';

export default ({ order, small }) => {
  const fulfillmentMethod = resolveFulfillmentMethod(order);

  return (
    <Icon
      as={fulfillmentMethod === 'collection' ? BoxIcon : Bike}
      size={small ? "sm" : "xxl"}
    />
  );
};
