import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Recycle } from 'lucide-react-native';
import moment from 'moment';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
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
import { selectTasksByOrder } from '../redux/logistics/selectors';
import { getOrderId } from '../utils/tasks';
import { getTaskTitleForOrder } from '../navigation/order/utils';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const orderTasks = useSelector(selectTasksByOrder(getOrderId(task)));
  const taskDropoffTitle = getTaskTitleForOrder(task, t);
  const alignedTextStyle = isPickup
    ? [styles.text, { textAlign: 'right' as const }]
    : [styles.text];

  // Animated rotation values
  const pickupRotation = useRef(new Animated.Value(0)).current;
  const dropoffRotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate to 90 degrees
    Animated.timing(pickupRotation, {
      toValue: 90,
      duration: 0, // Immediate
      useNativeDriver: true,
    }).start();

    Animated.timing(dropoffRotation, {
      toValue: 90,
      duration: 0, // Immediate
      useNativeDriver: true,
    }).start();
  }, [dropoffRotation, pickupRotation]);

  // Interpolate animated values to string format
  const pickupRotationInterpolated = pickupRotation.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  const dropoffRotationInterpolated = dropoffRotation.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });
  return (
    <HStack>
      <VStack
        className="py-3 px-1"
        style={{
          flex: 1,
          ...(isPickup ? { alignItems: 'flex-end', marginEnd: 8 } : {}),
        }}>
        <HStack className="justify-between items-center">
          <Text
            testID={`${taskTestId}:title`}
            style={[
              styles.titleText,
              !isPickup && { color: greyColor },
              { flex: 1, marginRight: 8 },
            ]}
            numberOfLines={1}>
            {task.orgName}
          </Text>
          {/* status and incidents icons */}
          <HStack space="md" className="items-center">
            {task.hasIncidents && (
              <Icon
                as={IncidentIcon}
                size={24}
                style={{
                  borderRadius: 5,
                  color: redColor,
                }}
              />
            )}
            <TaskStatusIcon task={task} />
          </HStack>
        </HStack>

        {isPickup ? (
          <HStack space="md">
            <DropoffArrows size="lg" count={getDropoffCount(orderTasks)} />
            <Animated.View
              style={{
                transform: [{ rotate: pickupRotationInterpolated }],
              }}>
              <FAIcon name="level-down-alt" size={18} />
            </Animated.View>
          </HStack>
        ) : (
          <HStack space="md">
            <Animated.View
              style={{
                transform: [
                  { rotate: dropoffRotationInterpolated },
                  { scaleY: -1 },
                ],
              }}>
              <FAIcon name="level-down-alt" size={18} />
            </Animated.View>
            <Text numberOfLines={1} style={{ flex: 1 }}>
              {`${getDropoffPosition(task, orderTasks)} ${taskDropoffTitle}`}
            </Text>
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
