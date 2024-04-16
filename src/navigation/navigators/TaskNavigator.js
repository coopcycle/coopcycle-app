import { HeaderBackButton } from '@react-navigation/elements';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import screens from '..';
import i18n from '../../i18n';
import { stackNavigatorScreenOptions } from '../styles';

import ProofOfDeliveryTabs from './TaskAttachmentsNavigator';

const CompleteStack = createStackNavigator();

const completeTitle = routeParams => {
  if (routeParams) {
    if (routeParams.task) {
      return `${i18n.t('TASK')} #${routeParams.task.id}`;
    }
    if (routeParams.tasks) {
      return i18n.t('COMPLETE_TASKS');
    }
  }
};

const CompleteNavigator = () => (
  <CompleteStack.Navigator screenOptions={stackNavigatorScreenOptions}>
    <CompleteStack.Screen
      name="TaskCompleteHome"
      component={screens.TaskComplete}
      options={({ navigation, route }) => ({
        title: completeTitle(route.params),
        headerLeft: props => (
          <HeaderBackButton {...props} onPress={() => navigation.goBack()} />
        ),
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

const RootStack = createStackNavigator();

export default () => (
  <RootStack.Navigator
    screenOptions={{ ...stackNavigatorScreenOptions, presentation: 'modal' }}>
    <RootStack.Screen
      name="TaskHome"
      component={screens.TaskHome}
      options={({ route }) => ({
        title: `${i18n.t('TASK')} #${route.params?.task.id}`,
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
