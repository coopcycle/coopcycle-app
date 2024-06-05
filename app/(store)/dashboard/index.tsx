import React from 'react';
import StoreDashboard from '@/src/navigation/store/Dashboard';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';

export default function Dashboard() {
  const navigation = useNavigation();
  const router = useRouter();

  return <StoreDashboard navigation={navigation} router={router} />;
}
