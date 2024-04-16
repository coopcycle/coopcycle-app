import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import screens, { headerLeft } from '..';
import i18n from '../../i18n';
import AccountRegisterConfirm from '../account/RegisterConfirm';
import AccountResetPasswordNewPassword from '../account/ResetPasswordNewPassword';
import { stackNavigatorScreenOptions } from '../styles';

const Stack = createStackNavigator();

export const AccountRegisterConfirmScreen = 'AccountRegisterConfirm';
export const AccountResetPasswordNewPasswordScreen =
  'AccountResetPasswordNewPassword';

export default () => (
  <Stack.Navigator screenOptions={stackNavigatorScreenOptions}>
    <Stack.Screen
      name="AccountHome"
      component={screens.AccountHome}
      options={({ navigation }) => ({
        title: i18n.t('MY_ACCOUNT'),
        headerLeft: headerLeft(navigation),
      })}
    />
    {/*FIXME: AccountAddresses and AddressDetails also exist in CheckoutNavigator, get rid from this duplication */}
    <Stack.Screen
      name="AccountAddresses"
      component={screens.AccountAddressesPage}
      options={{
        title: i18n.t('MY_ADDRESSES'),
      }}
    />
    <Stack.Screen
      name="AddressDetails"
      component={screens.AddressDetails}
      options={{
        title: i18n.t('MY_ADDRESSES'),
      }}
    />
    <Stack.Screen
      name="AccountDetails"
      component={screens.AccountDetailsPage}
      options={{
        title: i18n.t('MY_DETAILS'),
      }}
    />
    <Stack.Screen
      name="AccountRegisterCheckEmail"
      component={screens.AccountRegisterCheckEmail}
      options={{
        title: i18n.t('REGISTER_CHECK_EMAIL'),
      }}
    />
    <Stack.Screen
      name={AccountRegisterConfirmScreen}
      component={AccountRegisterConfirm}
      options={{
        title: i18n.t('REGISTER_CONFIRM'),
      }}
    />
    <Stack.Screen
      name="AccountForgotPassword"
      component={screens.AccountForgotPassword}
      options={{
        title: i18n.t('FORGOT_PASSWORD'),
      }}
    />
    <Stack.Screen
      name="AccountResetPasswordCheckEmail"
      component={screens.AccountResetPasswordCheckEmail}
      options={{
        title: i18n.t('RESET_PASSWORD_CHECK_EMAIL'),
      }}
    />
    <Stack.Screen
      name={AccountResetPasswordNewPasswordScreen}
      component={AccountResetPasswordNewPassword}
      options={{
        title: i18n.t('RESET_PASSWORD_NEW_PASSWORD'),
      }}
    />
  </Stack.Navigator>
);
