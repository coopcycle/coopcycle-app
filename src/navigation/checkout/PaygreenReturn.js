import React, { useEffect } from 'react';
import { Text } from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import { checkout } from '../../redux/Checkout/actions';

export default () => {

  const route = useRoute();
  const dispatch = useDispatch();

  const paymentOrderId = route.params.po_id;

  useEffect(() => {
    dispatch(checkout('', null, false, route.params.po_id));
  }, [ dispatch, route.params.po_id ]);

  // TODO Add a waiting text
  return (
    <Text>LOADING</Text>
  )
}
