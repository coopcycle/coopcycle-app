import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Recycle } from 'lucide-react-native';
import moment from 'moment';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Task } from '../types/task';
import FAIcon from './Icon';

import {
  CommentsIcon,
  DropoffIcon,
  IncidentIcon,
} from '../navigation/task/styles/common';
import { getDropoffCount, getDropoffPosition } from '../shared/src/utils';
import { greyColor, redColor, yellowColor } from '../styles/common';
import { PaymentMethodInList } from './PaymentMethodInfo';
import { TaskPriorityStatus } from './TaskPriorityStatus';
import { TaskStatusIcon } from './TaskStatusIcon';
import TaskTagsList from './TaskTagsList';
import { useSelector } from 'react-redux';
import { selectFilteredTasksByOrder as selectTasksByOrderCourier } from '../redux/Courier/taskSelectors';
import { selectTasksByOrder as selectTasksByOrderLogistics } from '../redux/logistics/selectors';
import { getOrderId } from '../utils/tasks';
import { getTaskTitleForOrder } from '../navigation/order/utils';
import { useTranslation } from 'react-i18next';
import { useTaskListsContext } from '../navigation/courier/contexts/TaskListsContext';

const cardBorderRadius = 2.5;

export const styles = StyleSheet.create({
  text: {
    fontSize: 14,
  },
  titleText: {
    fontSize: 16,
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  hasIncident: {
    borderColor: yellowColor,
  },
});

interface DropoffArrowsProps {
  count: number;
  size: string;
}

const DropoffArrows = ({ count, size = 'xs' }: DropoffArrowsProps) => (
  <HStack className="items-center" style={{ justifyContent: 'flex-end' }}>
    {Array.from({ length: count }, (_, index) => (
      <Icon
        key={index}
        as={DropoffIcon}
        size={size}
        style={{ marginLeft: index > 0 ? 2 : 0 }}
      />
    ))}
  </HStack>
);

interface ITaskInfoProps {
  task: Task;
  isPickup: boolean;
  taskTestId: string;
}

function TaskInfo({ task, isPickup, taskTestId }: ITaskInfoProps) {
  const context = useTaskListsContext();
  const selectSelector = context?.isFromCourier
  ? selectTasksByOrderCourier
  : selectTasksByOrderLogistics;
  const { t } = useTranslation();
  const orderTasks = useSelector(selectSelector(getOrderId(task)));
  // TODO check if we use this
  const taskDropoffTitle = getTaskTitleForOrder(task, t);
  const alignedTextStyle = isPickup
    ? [styles.text, { textAlign: 'right' as const }]
    : [styles.text];
  return (
    <HStack>
      <VStack
        className="py-3 px-1"
        style={{
          flex: 1,
          ...(isPickup ? { alignItems: 'flex-end', marginEnd: 8 } : {}),
        }}>
        <HStack className="justify-between">
          <Text
            testID={`${taskTestId}:title`}
            style={[styles.titleText, !isPickup && { color: greyColor }]}
            numberOfLines={1}>
            {/* {!isPickup && (
            <Text style={[styles.titleText, { color: greyColor }]}>IMB / </Text>
          )} */}
            {task.orgName}
          </Text>
          {task.hasIncidents && (
            <Icon
              as={IncidentIcon}
              size={24}
              style={{
                borderRadius: 5,
                color: redColor,
                marginRight: 12,
              }}
            />
          )}
        </HStack>

        {isPickup ? (
          <HStack space="md">
            <DropoffArrows size="lg" count={getDropoffCount(orderTasks)} />
            <FAIcon
              name="level-down-alt"
              size={18}
              style={{ transform: [{ rotate: '90deg' }] }}
            />
          </HStack>
        ) : (
          <HStack space="md">
            <FAIcon
              name="level-down-alt"
              size={18}
              style={{ transform: [{ rotate: '90deg' }, { scaleY: -1 }] }}
            />
            <Text>{`${getDropoffPosition(task, orderTasks)} ${taskDropoffTitle}`}</Text>
          </HStack>
        )}

        <Text numberOfLines={1} style={alignedTextStyle}>
          {task.address?.streetAddress}
        </Text>
        <HStack
          className="items-center"
          style={isPickup ? { justifyContent: 'flex-end' } : undefined}>
          <Text className="pr-2" style={alignedTextStyle}>
            {`${moment(task.doneAfter).format('LT')} - ${moment(task.doneBefore).format('LT')}`}
          </Text>
          <TaskStatusIcon task={task} />
          {task.address?.description && task.address?.description.length ? (
            <Icon className="mr-2" as={CommentsIcon} size="xs" />
          ) : null}
          {task.metadata && task.metadata?.payment_method && (
            <PaymentMethodInList paymentMethod={task.metadata.payment_method} />
          )}
          {task.metadata && task.metadata.zero_waste && (
            <Icon as={Recycle} size="sm" />
          )}
        </HStack>
        {task.tags && task.tags.length ? (
          <View style={isPickup ? { alignSelf: 'flex-end' } : undefined}>
            <TaskTagsList taskTags={task.tags} />
          </View>
        ) : null}
      </VStack>

      <TaskPriorityStatus task={task} cardBorderRadius={cardBorderRadius} />
    </HStack>
  );
}

export default TaskInfo;
