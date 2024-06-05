import React from 'react';
import DeliveryAddress from '@/src/navigation/store/NewDeliveryAddress';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';

export default function Dashboard() {
  const navigation = useNavigation();
  const router = useRouter();

  return <DeliveryAddress navigation={navigation} router={router} />;
}
