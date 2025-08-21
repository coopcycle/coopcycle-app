import { Text } from 'native-base';
import {  } from 'react-native';
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

export const OrderInfo = ({ task, color, width, onPress, isCourier = false, isDispatch = false }) => {
  const cardBorderRadius = 2.5;
  const isDefaultColor = color === '#ffffff';
  const backgroundColor = isDefaultColor ? lightGreyColor : color;
  const textColor = isDefaultColor ? blackColor : whiteColor;
  const orderId = getOrderIdWithPosition(task);

  const shouldShowTotal = () => {
    return (isCourier && isCashPayment(task)) || isDispatch;
  }
  const isCashPayment = (task: Task) => {
    return task.metadata.payment_method === 'CASH';
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
      {orderId ? (
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
          {task.metadata?.order_total && shouldShowTotal() ? (
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