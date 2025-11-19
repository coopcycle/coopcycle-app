import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Icon } from '@/components/ui/icon';
import { List, Map, ScanBarcode, Settings } from 'lucide-react-native'
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import screens, { headerLeft } from '..';
import TrackingIcon from '../../components/TrackingIcon';
import i18n from '../../i18n';
import { useBaseTextColor } from '../../styles/theme';
import { useStackNavigatorScreenOptions } from '../styles';
import OrderNavigator from './OrderNavigator';
import TaskNavigator from './TaskNavigator';
import { useSelector } from 'react-redux';
import { selectIsBarcodeEnabled } from '../../redux/App/selectors';
import { TaskListsProvider, useTaskListsContext } from '../courier/contexts/TaskListsContext';
import { HeaderButtons, HeaderButton } from '../../components/HeaderButton';
import { TaskActionsMenu } from '../dispatch/TaskActionsMenu';

const Tab = createBottomTabNavigator();

const Tabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarShowLabel: false,
    }}>
    <Tab.Screen
      name="CourierTaskMap"
      component={screens.CourierTaskMapPage}
      options={({ navigation }) => ({
        tabBarLabel: i18n.t('TASKS'),
        tabBarTestID: 'messengerTabMap',
        tabBarIcon: ({ color }) => {
          return <Icon as={Map} size="xl" style={{ color }} />;
        },
      })}
    />
    <Tab.Screen
      name="CourierTaskList"
      component={screens.CourierTaskListPage}
      options={({ navigation }) => ({
        tabBarLabel: i18n.t('TASK_LIST'),
        tabBarTestID: 'messengerTabList',
        tabBarIcon: ({ color }) => {
          return <Icon as={List} size="xl" style={{ color }} />;
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

const ButtonWithIcon = ({ as, onPress }) => {
  const color = useBaseTextColor();

  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Icon size="xl" as={as} style={{ color }} />
    </TouchableOpacity>
  );
};

const MainStack = createNativeStackNavigator();

function HeaderCourierButtons({ nav }) {
  const isBarcodeEnabled = useSelector(selectIsBarcodeEnabled);
  return (
    <View style={styles.buttonBar}>
      {isBarcodeEnabled && (
        <ButtonWithIcon
          as={ScanBarcode}
          onPress={() => nav.navigate('CourierBarcode')}
        />
      )}
      <ButtonWithIcon
        as={Settings}
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
          headerLeft: () => <HeaderLeftButton navigation={navigation} />,
          headerRight: () => <HeaderRightBody navigation={navigation}/>,
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

const BarcodeStack = createNativeStackNavigator();
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

const SettingsStack = createNativeStackNavigator();

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

const HeaderLeftButton = ({navigation}) => {
  const context = useTaskListsContext();

  const handleExitEditMode = () => {
    context?.clearSelectedTasks();
  };

  if (context?.isEditMode) {
    return (
      <HeaderButtons>
        <HeaderButton
          iconName="close"
          onPress={handleExitEditMode}
          testID="exitEditModeBtn"
          style={{ marginLeft: 16 }}
        />
      </HeaderButtons>
    );
  }

  return headerLeft(navigation, 'menuBtnCourier')();
};

const HeaderRightBody = ({navigation}) => {
  const context = useTaskListsContext();
  const selectedTasks = context?.selectedTasksToEdit || [];
  return (
    <>
      {context?.isEditMode ?
      <TaskActionsMenu
        navigation={navigation}
        tasks={selectedTasks}
        onClearSelection={context?.clearSelectedTasks}
        showCounter={true}
        enabledActions={{
          start: true,
          complete: true,
          reportIncident: true,
        }}
      />
      :
      <HeaderCourierButtons nav={navigation} />}
    </>
  );
};

const RootStack = createNativeStackNavigator();

export default () => {
  const screenOptions = useStackNavigatorScreenOptions({
    presentation: 'modal',
  });

  return (
    <TaskListsProvider>
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
    </TaskListsProvider>
  );
};
