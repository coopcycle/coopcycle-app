import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

export default () => {

  const navigation = useNavigation();

  useEffect(() => {
    navigation.navigate('CheckoutPayment');
  }, [ navigation ]);

  return null
}
