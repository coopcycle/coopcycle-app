import React, { useEffect } from 'react';
import { Center } from '@/components/ui/center';
import { Text } from '@/components/ui/text';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { checkout } from '../../redux/Checkout/actions';

export default () => {
  const route = useRoute();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const paymentOrderId = route.params?.po_id;

  useEffect(() => {
    dispatch(checkout('', null, false, route.params.po_id));
  }, [dispatch, route.params.po_id]);

  return (
    <Center flex={1} className="p-4">
      <Text>{t('PAYGREEN_RETURN_TEXT')}</Text>
    </Center>
  );
};
