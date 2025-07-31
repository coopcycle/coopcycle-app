import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Text } from 'native-base';
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
  }, [ dispatch, route.params.po_id ]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{ t('PAYGREEN_RETURN_TEXT') }</Text>
    </View>
  )
}
