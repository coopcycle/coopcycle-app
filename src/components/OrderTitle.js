import React from 'react';
import { useTranslation } from 'react-i18next';
import { DatadogLogger } from '../Datadog';

const OrderTitle = ({ order }) => {
  const { t } = useTranslation();

  // fallback when task is not defined, not sure if it can happen
  if (!order) {
    DatadogLogger.warn('order props in orderTitle is not defined')
    return <>{t('ORDER NUMBER')}</>
  }

  return (
    <React.Fragment>
      { order ?
      <>{t('ORDER_NUMBER', { number: order})}</>
        : <>{t('ORDER')}</>
      }
    </React.Fragment>
  );
};

export default OrderTitle;
