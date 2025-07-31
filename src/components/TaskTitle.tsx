import React from 'react';
import { useTranslation } from 'react-i18next';
import { DatadogLogger } from '../Datadog';

const TaskTitle = ({ task }) => {
  const { t } = useTranslation();

  // fallback when task is not defined, not sure if it can happen
  if (!task) {
    DatadogLogger.warn('Task props in TaskTitle is not defined')
    return <>{t('TASK')}</>
  }

  return (
    <React.Fragment>
      { task.metadata?.order_number ?
        <>
          {
            task.metadata?.delivery_position ?
            <>{t('ORDER_NUMBER', { number: task.metadata.order_number })}-{task.metadata.delivery_position}</>
            : <>{t('ORDER_NUMBER', { number: task.metadata.order_number })}</>
          }
        </>
        : <>{t('TASK_WITH_ID', { id: task.id })}</>
      }
    </React.Fragment>
  );
};

export default TaskTitle;
