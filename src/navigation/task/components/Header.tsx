import { Box } from '@/components/ui/box';
import { Divider } from '@/components/ui/divider';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import TaskTypeIcon from '@/src/components/TaskTypeIcon';
import { getTaskTimeFrame } from '../../order/components/OrderAccordeon';
import { useTranslation } from 'react-i18next';
import { getTaskTitleForOrder } from '../../order/utils';
import { useSelector } from 'react-redux';
import { selectTimezone } from '@/src/utils/timezone';

export const Header = ({ task }) => {
  const { t } = useTranslation();
  const timezone = useSelector(selectTimezone);
  const taskTitle = getTaskTitleForOrder(task);
  const address = task.address.streetAddress;

  return (
    <Box className="flex-0 flex-col">
      <HStack space="xs" className="mb-2 mt-4 px-4">
        <TaskTypeIcon
          color={task.type === 'DROPOFF' ? 'green' : 'red'}
          task={task}
        />
        <Text
          className="text-typography-950"
          style={{
            lineHeight: 22,
            textTransform: 'uppercase',
            marginLeft: 12,
          }}
        >
          {taskTitle || (task.type === 'PICKUP' ? t('PICKUP') : t('DROPOFF'))}
        </Text>
      </HStack>
      <HStack
        space="md"
        style={{
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingBottom: 8,
        }}
      >
        <Text bold className="text-typography-950">
          {getTaskTimeFrame(task, '\n', timezone)}
        </Text>
        <Divider orientation="vertical" className="h-8" />
        <Text bold className="text-typography-950" style={{ flexShrink: 1 }}>
          {address}
        </Text>
      </HStack>
    </Box>
  );
};
