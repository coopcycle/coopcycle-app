import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { headerLeft } from '..';
import i18n from '../../i18n';
import { useStackNavigatorScreenOptions } from '../styles';
import { HeaderButtons, HeaderButton } from '../../components/HeaderButton';
import ShiftsHome from '../shift/ShiftsHome';
import MyShiftsPage from '../shift/MyShiftsPage';
import OpenShiftsPage from '../shift/OpenShiftsPage';
import HolidayRequestsPage from '../shift/HolidayRequestsPage';
import NewHolidayRequest from '../shift/NewHolidayRequest';

const Stack = createStackNavigator();

export default () => {
  const screenOptions = useStackNavigatorScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="ShiftsHome"
        component={ShiftsHome}
        options={({ navigation }) => ({
          title: i18n.t('SHIFTS'),
          headerLeft: headerLeft(navigation, 'menuBtnShift'),
        })}
      />
      <Stack.Screen
        name="MyShifts"
        component={MyShiftsPage}
        options={{ title: i18n.t('MY_SHIFTS') }}
      />
      <Stack.Screen
        name="OpenShifts"
        component={OpenShiftsPage}
        options={{ title: i18n.t('OPEN_SHIFTS') }}
      />
      <Stack.Screen
        name="HolidayRequests"
        component={HolidayRequestsPage}
        options={({ navigation }) => ({
          title: i18n.t('HOLIDAY_REQUESTS'),
          headerRight: () => (
            <HeaderButtons>
              <HeaderButton
                iconName="add"
                onPress={() => navigation.navigate('NewHolidayRequest')}
                testID="newHolidayRequestBtn"
              />
            </HeaderButtons>
          ),
        })}
      />
      <Stack.Screen
        name="NewHolidayRequest"
        component={NewHolidayRequest}
        options={{
          title: i18n.t('NEW_HOLIDAY_REQUEST'),
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
};
