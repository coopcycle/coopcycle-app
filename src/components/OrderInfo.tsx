import { Text } from '@/components/ui/text';
import _ from 'lodash';
import { ItemTouchable } from './ItemTouchable';
import { getOrderNumberWithPosition } from '../utils/tasks';
import { formatPrice } from '../utils/formatting';
import CoopcycleLogo from '../../assets/images/logo.svg';
import { blackColor, lightGreyColor, whiteColor } from '../styles/common';
import { Task } from '../types/task';
import TaskTypeIcon from './TaskTypeIcon';
import { VStack } from '@/components/ui/vstack';
import { useTaskListsContext } from '../navigation/courier/contexts/TaskListsContext';
import { Box } from '@/components/ui/box';

interface IOrderInfoProps {
  task: Task;
  color: string;
  width: number;
  onPress: () => void;
}

export const OrderInfo = ({ task, color, width, onPress }: IOrderInfoProps) => {
  const cardBorderRadius = 2.5;
  const isDefaultColor = color === '#ffffff';
  const backgroundColor = isDefaultColor ? lightGreyColor : color;
  const textColor = isDefaultColor ? blackColor : whiteColor;
  const orderNumber = getOrderNumberWithPosition(task);
  const context = useTaskListsContext();
  const isFromCourier = context && context.isFromCourier;

  const shouldDisplayPrice = (task: Task): boolean => {
    return isFromCourier
      ? task.metadata?.order_total && task.metadata.payment_method === 'CASH'
      : task.metadata?.order_total;
  };

  return (
    <ItemTouchable
      onPress={() => onPress()}
      style={{
        alignItems: 'center',
        backgroundColor,
        borderBottomLeftRadius: cardBorderRadius,
        borderTopLeftRadius: cardBorderRadius,
        height: '100%',
        justifyContent: 'center',
        width,
        gap: 4,
      }}>
      {!_.isEmpty(orderNumber) ? (
        <Box>
          <TaskTypeIcon task={task} size="lg" color="light" />
          <VStack>
            <Text
              style={{
                color: textColor,
                fontSize: 16,
                fontWeight: 700,
                textAlign: 'center',
              }}>
              {orderNumber}
            </Text>
            {shouldDisplayPrice(task) ? (
              <Text
                style={{
                  color: textColor,
                  fontSize: 12,
                  lineHeight: 12,
                  fontWeight: 700,
                  textAlign: 'center',
                }}>
                {formatPrice(task.metadata.order_total)}
              </Text>
            ) : null}
          </VStack>
        </Box>
      ) : (
        <CoopcycleLogo width={width * 0.5} height={width * 0.5} />
      )}
    </ItemTouchable>
  );
};
