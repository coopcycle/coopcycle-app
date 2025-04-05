import { HeaderBackButton } from '@react-navigation/elements';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import screens from '..';
import i18n from '../../i18n';
import { useStackNavigatorScreenOptions } from '../styles';

import ProofOfDeliveryTabs from './TaskAttachmentsNavigator';
import TaskTitle from '../../components/TaskTitle';

const CompleteStack = createStackNavigator();

const completeTitle = routeParams => {
  if (routeParams) {
    if (routeParams.task) {
      return <TaskTitle task={routeParams.task} />;
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
};

const RootStack = createStackNavigator();

export default () => {
  const screenOptions = useStackNavigatorScreenOptions({
    presentation: 'modal',
  });

  return (
    <RootStack.Navigator screenOptions={screenOptions}>
      <RootStack.Screen
        name="TaskHome"
        component={screens.TaskHome}
        options={({ route }) => ({
          title: <TaskTitle task={route.params?.task} />,
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
