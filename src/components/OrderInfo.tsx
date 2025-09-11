import { Text } from '@/components/ui/text';
import _ from 'lodash';
import { ItemTouchable } from './ItemTouchable';
import { getOrderIdWithPosition } from '../utils/tasks';
import { formatPrice } from '../utils/formatting';
import CoopcycleLogo from '../../assets/images/logo.svg';
import {
  blackColor,
  lightGreyColor,
  whiteColor
} from '../styles/common';
import { Task } from '../types/Task';
import { useCourier } from '../navigation/courier/contexts/CourierContext';

export const OrderInfo = ({ task, color, width, onPress }) => {
  const cardBorderRadius = 2.5;
  const isDefaultColor = color === '#ffffff';
  const backgroundColor = isDefaultColor ? lightGreyColor : color;
  const textColor = isDefaultColor ? blackColor : whiteColor;
  const orderId = getOrderIdWithPosition(task);
  const context = useCourier();
  const isFromCourier = context && context.isFromCourier;

  const shouldDisplayPrice = (task: Task) : boolean => {
    return isFromCourier ? task.metadata?.order_total && task.metadata.payment_method === 'CASH' : task.metadata?.order_total;
  }

  return (
    <ItemTouchable
      onPress={() => onPress()}
      style={{
        alignItems: 'center',
        backgroundColor,
        borderBottomLeftRadius: cardBorderRadius,
        borderTopLeftRadius: cardBorderRadius,
        gap: 12,
        height: '100%',
        justifyContent: 'center',
        width,
      }}>
      {!_.isEmpty(orderId) ? (
        <>
          <Text
            style={{
              color: textColor,
              fontSize: 24,
              fontWeight: 700,
              lineHeight: 24,
            }}>
            {orderId}
          </Text>
          {shouldDisplayPrice(task) ? (
            <Text
              style={{
                color: textColor,
                fontSize: 15,
                fontWeight: 700,
                lineHeight: 15,
              }}>
              {formatPrice(task.metadata.order_total)}
            </Text>
          ) : null}
        </>
      ) : (
        <CoopcycleLogo width={width * 0.5} height={width * 0.5} />
      )}
    </ItemTouchable>
  );
};
