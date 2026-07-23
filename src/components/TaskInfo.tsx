import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { Task } from '../types/task';
import { MessageCircleMore, Recycle } from 'lucide-react-native';

import { Divider } from '@/components/ui/divider';
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
import { selectTimezone } from '../utils/timezone';
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
  hasIncident: {
    borderColor: yellowColor,
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

export default function TaskInfo({ task, isPickup, taskTestId }: ITaskInfoProps) {
  const { t } = useTranslation();
  const context = useTaskListsContext();
  const selectSelector = context?.isFromCourier
  ? selectTasksByOrderCourier
  : selectIncomingTasksReordered;
  const orderTasks = useSelector(selectSelector(getOrderNumber(task)));
  const timezone = useSelector(selectTimezone);
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
            // Exposes the task identity to E2E tests independently of what is
            // shown on screen. The visible task id below is dev-only (and the
            // title is uppercased), so tests cannot rely on the rendered text
            // to tell one task from another — they match this label instead.
            accessibilityLabel={`${task.orgName} (task #${task.id})`}
            style={alignedTitleStyle}
            numberOfLines={1}>
            {task.orgName}
            <Text className={ classNames({ 'hidden': !__DEV__ }) }>{` (task #${task.id})`}</Text>
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
          </HStack>
        ) : (
          <HStack space="md">
            <Text numberOfLines={1} style={{ flex: 1 }}>
              {getDropoffPosition(task, orderTasks)}
              <Text italic={!taskTitle}> {taskTitle || `(${t('UNNAMED')})`}</Text>
            </Text>
          </HStack>
        )}

        <Text numberOfLines={1} style={alignedTextStyle}>
          {task.address.streetAddress}
        </Text>
        <HStack className={classNames('items-center flex-wrap gap-2', { 'justify-end': isPickup })}>
          {isPickup ? (
            <>
              {packagesText && (
                <>
                  <Text className="text-right">{packagesText}</Text>
                  <Divider orientation="vertical" />
                </>
              )}
              <Text className="text-right">{getTimeFrame(task, timezone)}</Text>
            </>
          ) : (
            <>
              <Text>{getTimeFrame(task, timezone)}</Text>
              {packagesText && (
                <>
                  <Divider orientation="vertical" />
                  <Text>{packagesText}</Text>
                </>
              )}
            </>
          )}
          {task.comments && <Icon as={MessageCircleMore} size="sm" />}
          {(task.metadata?.zero_waste || task.metadata?.has_loopeat_returns) && <Icon as={Recycle} size="sm" /> }
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
};
