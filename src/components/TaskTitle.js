import React from 'react';
import { useTranslation } from 'react-i18next';

const TaskTitle = ({ task }) => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      {t('TASK_WITH_ID', { id: task.id })}
      {task.metadata &&
        task.metadata.order_number &&
        ' | ' + t('ORDER_NUMBER', { number: task.metadata.order_number })}
    </React.Fragment>
  );
};

export default TaskTitle;
