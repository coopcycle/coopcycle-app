import { Text } from '@/components/ui/text';
import { useTranslation } from 'react-i18next';
import Task from '@/src/types/task';

type Props = {
  tasks: Task[];
};

export const MultipleTasksLabel = ({ tasks }: Props) => {
  const { t } = useTranslation();

  if (!tasks || tasks.length === 0) {
    return null;
  }

  return (
    <Text className="my-4 ml-3">
      {tasks.reduce(
        (label, task, idx) => {
          const taskIdentifier = task?.metadata?.order_number
            ? `${task.metadata.order_number}-${task?.metadata?.delivery_position}`
            : task.id;
          return `${label}${idx !== 0 ? ',' : ''} #${taskIdentifier}`;
        },
        `${t('COMPLETE_TASKS')}: `,
      )}
    </Text>
  );
};
