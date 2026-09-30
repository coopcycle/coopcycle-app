import { useNavigation, useRoute } from '@react-navigation/native';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';

import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import TaskType from '@/src/types/task';

import { TaskStatusIcon } from '../../../components/TaskStatusIcon';
import { withLinkedTasks } from '../../../shared/src/logistics/redux/taskUtils';
import { navigateToTask } from '../../utils';
import { taskTypeIcon } from '../styles/common';
import { getAddress } from './utils';

type Props = {
  task?: TaskType;
  /**
   * Every task we hold, courier's own and dispatch's. Used to resolve the
   * delivery `task` belongs to; tasks of that delivery we don't hold simply
   * don't show up.
   */
  allTasks: TaskType[];
  /**
   * The surrounding list this screen was opened with, forwarded as-is so
   * stepping through a delivery keeps the day-list navigation at the bottom
   * of the screen working.
   */
  listTasks: TaskType[];
};

type ChipProps = {
  task: TaskType;
  isCurrent: boolean;
  onPress: () => void;
};

const Chip = ({ task, isCurrent, onPress }: ChipProps) => {
  const { t } = useTranslation();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: isCurrent }}
      testID={`deliveryNav:task:${task.id}`}
      // Not `disabled`: the gluestack pressable dims a disabled child to 40%,
      // which would fade out the very chip we are highlighting.
      onPress={isCurrent ? undefined : onPress}
      className={`mr-2 rounded-lg px-3 py-2 ${
        isCurrent
          ? 'border-2 border-primary-500 bg-background-50'
          : 'border border-outline-200'
      }`}
      style={{ maxWidth: 220 }}>
      <HStack className="items-center" space="xs">
        <Icon as={taskTypeIcon(task)} size="sm" />
        <Text bold={isCurrent} size="sm">
          {t(task.type)}
        </Text>
        <TaskStatusIcon task={task} />
      </HStack>
      {task.address ? (
        <Text className="text-typography-500" size="xs" numberOfLines={1}>
          {getAddress(task)}
        </Text>
      ) : null}
    </Pressable>
  );
};

/**
 * Lets the courier step between the tasks of the delivery they are looking at
 * — the pickup and its dropoff(s) — without going back to the list. Renders
 * nothing for a delivery whose other tasks we don't hold.
 */
const DeliveryNav = ({ task, allTasks, listTasks }: Props) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();

  const deliveryTasks = useMemo(() => {
    if (!task || !task['@id']) {
      return [];
    }

    // `withLinkedTasks` lives in the untyped shared logistics code
    return withLinkedTasks(task, allTasks) as TaskType[];
  }, [task, allTasks]);

  // A delivery of a single task has nowhere to step to
  if (deliveryTasks.length < 2) {
    return null;
  }

  const index = deliveryTasks.findIndex(
    deliveryTask => deliveryTask['@id'] === task?.['@id'],
  );

  return (
    <View className="border-b border-outline-200 px-3 py-2">
      <HStack className="items-center justify-between pb-1">
        <Text className="text-typography-500" size="xs">
          {t('DELIVERY')}
        </Text>
        <Text className="text-typography-500" size="xs">
          {`${index + 1}/${deliveryTasks.length}`}
        </Text>
      </HStack>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {deliveryTasks.map(deliveryTask => (
          <Chip
            key={deliveryTask['@id']}
            task={deliveryTask}
            isCurrent={deliveryTask['@id'] === task?.['@id']}
            onPress={() =>
              navigateToTask(navigation, route, deliveryTask, listTasks)
            }
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default DeliveryNav;
