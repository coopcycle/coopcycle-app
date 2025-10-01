import { Icon } from '@/components/ui/icon';
import { Bike, Cube } from 'lucide-react-native'
import React from 'react';

import { resolveFulfillmentMethod } from '../utils/order';

export default ({ order, small }) => {
  const fulfillmentMethod = resolveFulfillmentMethod(order);

  return (
    <Icon
      as={fulfillmentMethod === 'collection' ? Cube : Bike}
      size={small ? "sm" : "xxl"}
    />
  );
};
