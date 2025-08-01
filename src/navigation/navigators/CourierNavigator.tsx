import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Icon } from 'native-base';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

import screens, { headerLeft } from '..';
import TrackingIcon from '../../components/TrackingIcon';
import i18n from '../../i18n';
import { useBaseTextColor } from '../../styles/theme';
import { useStackNavigatorScreenOptions } from '../styles';
import OrderNavigator from './OrderNavigator';
import TaskNavigator from './TaskNavigator';
import { useSelector } from 'react-redux';
import { selectIsBarcodeEnabled } from '../../redux/App/selectors';

const Tab = createBottomTabNavigator();

const Tabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarShowLabel: false,
    }}>
    <Tab.Screen
      name="CourierTasks"
      component={screens.CourierTasksPage}
      options={({ navigation }) => ({
        title: i18n.t('TASKS'),
        tabBarTestID: 'messengerTabMap',
        tabBarIcon: ({ color }) => {
          return <Icon as={FontAwesome} name="map" style={{ color }} />;
        },
      })}
    />
    <Tab.Screen
      name="CourierTaskList"
      component={screens.CourierTaskListPage}
      options={({ navigation }) => ({
        title: i18n.t('TASK_LIST'),
        tabBarTestID: 'messengerTabList',
        tabBarIcon: ({ color }) => {
          return <Icon as={FontAwesome} name="list" style={{ color }} />;
        },
      })}
    />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  buttonBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    paddingHorizontal: 10,
  },
});

const ButtonWithIcon = ({ name, onPress }) => {
  const color = useBaseTextColor();

  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Icon as={Ionicons} name={name} style={{ color }} />
    </TouchableOpacity>
  );
};

const MainStack = createStackNavigator();

function HeaderButtons({ nav }) {
  const isBarcodeEnabled = useSelector(selectIsBarcodeEnabled);
  return (
    <View style={styles.buttonBar}>
      {isBarcodeEnabled && (
        <ButtonWithIcon
          name="barcode-sharp"
          onPress={() => nav.navigate('CourierBarcode')}
        />
      )}
      <ButtonWithIcon
        name="settings-sharp"
        onPress={() => nav.navigate('CourierSettings')}
      />
      <TouchableOpacity style={styles.button}>
        <TrackingIcon />
      </TouchableOpacity>
    </View>
  );
}

const MainNavigator = () => {
  const screenOptions = useStackNavigatorScreenOptions();

  return (
    <MainStack.Navigator screenOptions={screenOptions}>
      <MainStack.Screen
        name="CourierHome"
        component={Tabs}
        options={({ navigation }) => ({
          title: i18n.t('COURIER'),
          headerLeft: headerLeft(navigation, 'menuBtnCourier'),
          headerRight: () => <HeaderButtons nav={navigation} />,
        })}
      />
      <MainStack.Screen
        name="Task"
        component={TaskNavigator}
        options={{
          headerShown: false,
        }}
      />
      <MainStack.Screen
        name="CourierDate"
        component={screens.CourierDate}
        options={{
          title: i18n.t('DISPATCH_DATE'),
          presentation: 'modal',
        }}
      />
    </MainStack.Navigator>
  );
};

const BarcodeStack = createStackNavigator();
const BarcodeNavigator = () => {
  const screenOptions = useStackNavigatorScreenOptions();

  return (
    <BarcodeStack.Navigator screenOptions={screenOptions}>
      <BarcodeStack.Screen
        name="CourierBarcodeScanner"
        component={screens.CourierBarcodePage}
        options={{
          title: false,
          headerShown: false,
        }}
      />
      <BarcodeStack.Group screenOptions={{ presentation: 'modal' }}>
        <BarcodeStack.Screen
          name="CourierBarcodeReport"
          component={screens.CourierBarcodeReportPage}
          options={{ title: false }}
        />
        <BarcodeStack.Screen
          name="CourierReportIncident"
          component={screens.CourierBarcodeIncidentPage}
          options={{ title: i18n.t('REPORT_AN_INCIDENT') }}
        />
      </BarcodeStack.Group>
    </BarcodeStack.Navigator>
  );
};

const SettingsStack = createStackNavigator();

const SettingsNavigator = () => {
  const screenOptions = useStackNavigatorScreenOptions();

  return (
    <SettingsStack.Navigator screenOptions={screenOptions}>
      <SettingsStack.Screen
        name="CourierSettingsHome"
        component={screens.CourierSettings}
        options={{
          title: i18n.t('SETTINGS'),
        }}
      />
      <SettingsStack.Screen
        name="CourierSettingsTags"
        component={screens.CourierSettingsTags}
        options={{
          title: i18n.t('FILTER_BY_TAGS'),
        }}
      />
    </SettingsStack.Navigator>
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
        name="Main"
        component={MainNavigator}
        options={{
          headerShown: false,
        }}
      />
      <RootStack.Screen
        name="CourierSettings"
        component={SettingsNavigator}
        options={{
          headerShown: false,
        }}
      />
      <RootStack.Screen
        name="CourierBarcode"
        component={BarcodeNavigator}
        options={{
          headerShown: false,
        }}
      />
      <RootStack.Screen
        name="Order"
        component={OrderNavigator}
        options={{
          headerShown: false,
        }}
      />
    </RootStack.Navigator>
  );
};
