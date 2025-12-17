import { DatadogLogger } from '../Datadog';
import i18n from '@/src/i18n';

export const getOrderTitle = (order: string) => {
  const { t } = i18n;

  // fallback when task is not defined, not sure if it can happen
  if (!order) {
    DatadogLogger.warn('order props in orderTitle is not defined');
    return t('ORDER NUMBER');
  }

  return order ? t('ORDER_NUMBER', { number: order }) : t('ORDER');
};
