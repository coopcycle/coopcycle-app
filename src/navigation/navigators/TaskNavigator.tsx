import { HeaderBackButton } from '@react-navigation/elements';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import React from 'react';

import screens from '..';
import i18n from '../../i18n';
import { useStackNavigatorScreenOptions } from '../styles';

import ProofOfDeliveryTabs from './TaskAttachmentsNavigator';
import { getTaskTitle } from '../../components/TaskTitle';

const CompleteStack = createNativeStackNavigator();

const completeTitle = routeParams => {
  if (routeParams) {
    if (routeParams.task) {
      return getTaskTitle(routeParams.task);
    }
    if (routeParams.tasks) {
      return i18n.t('COMPLETE_TASKS');
    }
  }
};

const CompleteNavigator = () => {
  const screenOptions = useStackNavigatorScreenOptions();

  return (
    <CompleteStack.Navigator screenOptions={screenOptions}>
      <CompleteStack.Screen
        name="ReportIncidentHome"
        component={screens.Report}
        options={({ route, navigation }) => ({
          title: completeTitle(route.params),
          headerShown: true,
          headerLeft: props => (
          <HeaderBackButton {...props} onPress={() => navigation.goBack()} />),
        })}
      />
      <CompleteStack.Screen
        name="TaskCompleteHome"
        component={screens.TaskComplete}
        options={({ navigation, route }) => ({
          title: completeTitle(route.params),
          headerLeft: props => <HeaderBackButton {...props} displayMode="minimal" onPress={() => navigation.goBack()} />,
        })}
      />
      <CompleteStack.Screen
        name="TaskCompleteProofOfDelivery"
        component={ProofOfDeliveryTabs}
        options={({ route }) => ({
          title: completeTitle(route.params),
        })}
      />
    </CompleteStack.Navigator>
  );
};

const RootStack = createNativeStackNavigator();

export default () => {

  const navigation = useNavigation();

  const screenOptions = useStackNavigatorScreenOptions({
    // Do *NOT* use presentation = modal,
    // to avoid conflicting with gestures to close the modal when signing proofs of delivery.
    // gestureEnabled should be used for this, but it doesn't work as expected.
    presentation: 'card',
  });

  return (
    <RootStack.Navigator screenOptions={screenOptions}>
      <RootStack.Screen
        name="TaskHome"
        component={screens.TaskHome}
        options={({ route }) => ({
          headerTitle: getTaskTitle(route.params?.task),
          headerLeft: props => <HeaderBackButton {...props} displayMode="minimal" onPress={() => navigation.goBack()} />
        })}
      />
      <RootStack.Screen
        name="TaskComplete"
        component={CompleteNavigator}
        options={{
          headerShown: false,
        }}
      />
    </RootStack.Navigator>
  );
};
