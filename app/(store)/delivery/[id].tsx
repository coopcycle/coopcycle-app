import { useNavigation } from '@react-navigation/native';
import StoreDelivery from '@/src/navigation/store/Delivery';
import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { selectDeliveries } from '@/src/redux/Store/selectors';
import _ from 'lodash';
import { useSelector } from 'react-redux';

export default function Delivery() {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();

  const deliveries = useSelector(selectDeliveries);
  const match = _.find(deliveries, d => d.id === Number(id));

  const route = {
    params: {
      delivery: match,
    },
  };

  return <StoreDelivery navigation={navigation} route={route} />;
}
