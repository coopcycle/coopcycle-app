import { Text } from "@/components/ui/text";
import { useTranslation } from "react-i18next";

export const MultipleTasksLabel = ({ tasks }) => {
  const { t } = useTranslation();

  if (!tasks || tasks.length === 0) {
    return null;
  }

  return (
    <Text mt={2} ml={3}>
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