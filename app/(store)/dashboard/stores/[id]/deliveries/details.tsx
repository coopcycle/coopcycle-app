import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import { selectAddresses } from '@/src/redux/Store/selectors';
import DeliveryForm from '@/src/navigation/store/NewDeliveryForm';

export default function Dashboard() {
  const navigation = useNavigation();
  const router = useRouter();

  const { address } = useLocalSearchParams();

  const adresses = useSelector(selectAddresses);
  const match = adresses.find(el => el['@id'] === address);

  const route = {
    params: {
      address: match,
    },
  };

  return <DeliveryForm navigation={navigation} route={route} router={router} />;
}
