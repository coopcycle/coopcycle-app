import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { X } from 'lucide-react-native';
import React from 'react';
import { TouchableOpacity } from 'react-native';

import screens from '..';
import i18n from '../../i18n';
import { useStackNavigatorScreenOptions } from '../styles';
import { usePrimaryContentColor } from '@/src/styles/theme';
import ProductOptions from './ProductOptions';

function CloseButton() {
  const navigation = useNavigation();
  const iconColor = usePrimaryContentColor();
  return (
    <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 10 }}>
      <X color={iconColor} size={22} />
    </TouchableOpacity>
  );
}

const RootStack = createStackNavigator();

export default () => {
  const screenOptions = useStackNavigatorScreenOptions();

  return (
    <RootStack.Navigator screenOptions={screenOptions}>
      <RootStack.Screen
        name="RestaurantSettingsHome"
        component={screens.RestaurantSettings}
        options={{
          title: i18n.t('SETTINGS'),
          headerLeft: () => <CloseButton />,
        }}
      />
      <RootStack.Screen
        name="RestaurantProducts"
        component={screens.RestaurantProducts}
        options={{
          title: i18n.t('RESTAURANT_PRODUCTS'),
        }}
      />
      <RootStack.Screen
        name="RestaurantProductOptions"
        component={ProductOptions}
        options={{
          title: i18n.t('RESTAURANT_PRODUCT_OPTIONS'),
        }}
      />
      <RootStack.Screen
        name="RestaurantOpeningHours"
        component={screens.RestaurantOpeningHours}
        options={{
          title: i18n.t('RESTAURANT_OPENING_HOURS'),
        }}
      />
      <RootStack.Screen
        name="RestaurantMenus"
        component={screens.RestaurantMenus}
        options={{
          title: i18n.t('RESTAURANT_SETTINGS_MENUS'),
        }}
      />
      <RootStack.Screen
        name="RestaurantPrinter"
        component={screens.RestaurantPrinter}
        options={{
          title: i18n.t('RESTAURANT_SETTINGS_PRINTER'),
        }}
      />
    </RootStack.Navigator>
  );
};
