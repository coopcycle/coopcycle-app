import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { useStackNavigatorScreenOptions } from '../styles';
import screens from '..';
import TaskTitle from '@/src/components/TaskTitle';
import i18next from 'i18next';

const RootStack = createStackNavigator();

const completeTitle = routeParams => {
  if (routeParams) {
    if (routeParams.task) {
      return <TaskTitle task={routeParams.task} />;
    }
    if (routeParams.tasks) {
      return i18next.t('COMPLETE_TASKS');
    }
  }
};

export default () => {
  const screenOptions = useStackNavigatorScreenOptions({
    presentation: 'modal',
  });

  return (
    <RootStack.Navigator screenOptions={screenOptions}>
      <RootStack.Screen
        name="ReportIncidentHome"
        component={screens.Report}
        options={({ route, navigation }) => ({
          title: completeTitle(route.params),
          headerShown: true,
        })}
      />
    </RootStack.Navigator>
  );
};
