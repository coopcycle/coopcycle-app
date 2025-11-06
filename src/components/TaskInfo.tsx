import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Task } from '../types/task';
import FAIcon from './Icon';

import {
  DropoffIcon,
} from '../navigation/task/styles/common';
import { getDropoffCount, getDropoffPosition } from '../shared/src/utils';
import { greyColor, yellowColor } from '../styles/common';
import { TaskPriorityStatus } from './TaskPriorityStatus';
import { TaskStatusIcon } from './TaskStatusIcon';
import TaskTagsList from './TaskTagsList';
import { useSelector } from 'react-redux';
import { selectFilteredTasksByOrder as selectTasksByOrderCourier } from '../redux/Courier/taskSelectors';
import { selectIncomingTasksReordered } from '../redux/logistics/selectors';
import { getOrderNumber } from '../utils/tasks';
import { getTaskTitleForOrder } from '../navigation/order/utils';
import { getTimeFrame } from '../navigation/task/components/utils';
import { useTaskListsContext } from '../navigation/courier/contexts/TaskListsContext';

const cardBorderRadius = 2.5;
const maxDropoffArrowsToShow = 3;

export const styles = StyleSheet.create({
  text: {
    fontSize: 14,
  },
  titleText: {
    fontSize: 16,
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  // This one is used just for dev and e2e tests purposes
  invisibleText: __DEV__ ? { fontSize: 12 } : { color: 'transparent', fontSize: 0 },
  hasIncident: {
    borderColor: yellowColor,
  },
  packageText: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
  },
  row: {
    flexWrap: 'wrap',
  },
  rowRight: {
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
});

interface DropoffArrowsProps {
  count: number;
  size: string;
}

const DropoffArrows = ({ count, size = 'xs' }: DropoffArrowsProps) => {
  const len = count > maxDropoffArrowsToShow ? 1 : count;
  return (<HStack className="items-center" style={{ justifyContent: 'flex-end' }}>
    {Array.from({ length: len }, (_, index) => (
      <Icon
        key={index}
        as={DropoffIcon}
        size={size}
        style={{ marginLeft: index > 0 ? 2 : 0 }}
      />
    ))}
    {len !== count ? <Text numberOfLines={1}>x{count}</Text> : null}
  </HStack>)
};

interface ITaskInfoProps {
  task: Task;
  isPickup: boolean;
  taskTestId: string;
}

function TaskInfo({ task, isPickup, taskTestId }: ITaskInfoProps) {
  const { t } = useTranslation();
  const context = useTaskListsContext();
  const selectSelector = context?.isFromCourier
  ? selectTasksByOrderCourier
  : selectIncomingTasksReordered;
  const orderTasks = useSelector(selectSelector(getOrderNumber(task)));
  const taskTitle = getTaskTitleForOrder(task);
  const alignedTextStyle = isPickup
    ? [styles.text, { textAlign: 'right' as const }]
    : [styles.text];

  const alignedTitleStyle = [
    styles.titleText,
    !isPickup && { color: greyColor },
    { flex: 1, marginRight: 8 },
    ...(isPickup ? [{ textAlign: 'right' as const }] : []),
  ];

  const packagesText = task.packages?.length
    ? task.packages.map(p => `${p.quantity} x ${p.short_code}`).join('   ')
    : '';

  // TODO check if we should replace by SVG icons (css rotation not working on load)
  const pickupRotation = useRef(new Animated.Value(0)).current;
  const dropoffRotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(pickupRotation, {
      toValue: 90,
      duration: 0,
      useNativeDriver: true,
    }).start();

    Animated.timing(dropoffRotation, {
      toValue: 90,
      duration: 0,
      useNativeDriver: true,
    }).start();
  }, [dropoffRotation, pickupRotation]);

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
        className="py-3 px-2"
        style={{
          flex: 1,
          ...(isPickup ? { alignItems: 'flex-end', marginEnd: 8 } : {}),
        }}>
        <HStack className="justify-between items-center">
          <Text
            testID={`${taskTestId}:title`}
            style={alignedTitleStyle}
            numberOfLines={1}>
            {task.orgName}
            <Text style={styles.invisibleText}>{` (task #${task.id})`}</Text>
          </Text>
          {/* status and incidents icons */}
          <HStack space="xs" className="items-center">
            <TaskStatusIcon task={task} />
          </HStack>
        </HStack>

        {isPickup ? (
          <HStack space="md">
            <Text numberOfLines={1} style={{ flex: 1, textAlign: 'right' }} italic={!taskTitle}>{taskTitle || `(${t('UNNAMED')})`}</Text>
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
              {getDropoffPosition(task, orderTasks)}
              <Text italic={!taskTitle}> {taskTitle || `(${t('UNNAMED')})`}</Text>
            </Text>
          </HStack>
        )}

        <Text numberOfLines={1} style={alignedTextStyle}>
          {task.address.streetAddress}
        </Text>
        <HStack className="items-center" style={isPickup ? styles.rowRight : styles.row}>
          {isPickup ? (
            <>
              {packagesText && (
                <View style={styles.packageText}>
                  <Text style={{ textAlign: 'right' }}>
                    {packagesText} |
                  </Text>
                </View>
              )}
              <Text style={{ textAlign: 'right' }}> {getTimeFrame(task)} </Text>
              {task.comments && <FAIcon name="comments" />}
            </>
          ) : (
            <>
              <Text>{getTimeFrame(task)} </Text>
              {packagesText && (
                <View style={styles.packageText}>
                  <Text>
                    | {packagesText}
                  </Text>
                </View>
              )}
              {task.comments && <FAIcon name="comments" />}
            </>
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
