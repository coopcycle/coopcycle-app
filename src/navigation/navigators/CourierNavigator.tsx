import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { Icon } from '@/components/ui/icon';
import { List, Map, ScanBarcode, Settings, X } from 'lucide-react-native'
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import screens, { headerLeft } from '..';
import i18n from '../../i18n';
import { useStackNavigatorScreenOptions } from '../styles';
import { usePrimaryContentColor } from '@/src/styles/theme';
import OrderNavigator from './OrderNavigator';
import TaskNavigator from './TaskNavigator';
import { useSelector } from 'react-redux';
import { selectIsBarcodeEnabled } from '../../redux/App/selectors';
import { selectHasCustomTaskFilters } from '../../redux/Courier';
import { redColor, whiteColor } from '../../styles/common';
import { TaskListsProvider, useTaskListsContext } from '../courier/contexts/TaskListsContext';
import { HeaderButtons, HeaderButton } from '../../components/HeaderButton';
import { TaskActionsMenu } from '../dispatch/TaskActionsMenu';
import { useResetDateOnDayChange } from '../../hooks/useResetDateOnDayChange';
import {
  TasksFilterSheetProvider,
  useTasksFilterSheet,
} from '../courier/TasksFilterSheet';

const styles = StyleSheet.create({
  // Sits on the corner of the funnel icon; the border keeps it readable
  // whatever colour the header happens to be.
  filtersChip: {
    backgroundColor: redColor,
    borderColor: whiteColor,
    borderRadius: 5,
    borderWidth: 1,
    height: 10,
    position: 'absolute',
    right: 2,
    top: 0,
    width: 10,
  },
});

const Tab = createBottomTabNavigator();

const Tabs = () => {

  const screenOptions = useStackNavigatorScreenOptions();

  return (
    <TasksFilterSheetProvider>
      <Tab.Navigator
        // Map screens must not be detached/re-attached: see
        // DrawerNavigator and https://github.com/coopcycle/coopcycle-app/issues/2113
        detachInactiveScreens={false}
        screenOptions={({ navigation }) => ({
          ...screenOptions,
          tabBarShowLabel: false,
          headerTitle: i18n.t('COURIER'),
          headerLeft: () => <HeaderLeftButton navigation={navigation} />,
          headerRight: () => <HeaderRightBody navigation={navigation} />,
        })}>
        <Tab.Screen
          name="CourierTaskMap"
          component={screens.CourierTaskMapPage}
          options={({ navigation }) => ({
            tabBarLabel: i18n.t('TASKS'),
            tabBarButtonTestID: 'messengerTabMap',
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
            tabBarButtonTestID: 'messengerTabList',
            tabBarIcon: ({ color }) => {
              return <Icon as={List} size="xl" style={{ color }} />;
            },
          })}
        />
      </Tab.Navigator>
    </TasksFilterSheetProvider>
  );
};

const MainStack = createStackNavigator();

function HeaderCourierButtons({ navigation }) {
  const isBarcodeEnabled = useSelector(selectIsBarcodeEnabled);
  const hasCustomFilters = useSelector(selectHasCustomTaskFilters);
  const filterSheet = useTasksFilterSheet();

  return (
    <HeaderButtons>
      {isBarcodeEnabled &&
      <HeaderButton iconName="scan" onPress={() => navigation.navigate('CourierBarcode')} /> }
      {/*
      Tasks can be filtered out of a screen that otherwise looks complete, so
      the button says when any filter beyond the defaults is on.
      */}
      <View>
        <HeaderButton
          iconName={hasCustomFilters ? 'funnel' : 'funnel-outline'}
          onPress={() => filterSheet?.openFilters()}
          testID="courierFiltersBtn"
        />
        {hasCustomFilters && (
          <View
            style={styles.filtersChip}
            pointerEvents="none"
            testID="courierFiltersChip"
          />
        )}
      </View>
      <HeaderButton iconName="settings-outline" onPress={() => navigation.navigate('CourierSettings')} />
    </HeaderButtons>
  )
}

const MainNavigator = () => {
  const screenOptions = useStackNavigatorScreenOptions();

  return (
    <MainStack.Navigator
      detachInactiveScreens={false}
      screenOptions={screenOptions}>
      <MainStack.Screen
        name="CourierHome"
        component={Tabs}
        options={({ navigation }) => ({
          headerShown: false,
        })}
      />
      <MainStack.Screen
        name="Task"
        component={TaskNavigator}
        options={{
          headerShown: false,
          gestureEnabled: false,
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

function CloseButton() {
  const navigation = useNavigation();
  const iconColor = usePrimaryContentColor();
  return (
    <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 10 }}>
      <X color={iconColor} size={22} />
    </TouchableOpacity>
  );
}

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
          headerLeft: () => <CloseButton />,
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

const HeaderRightBody = ({ navigation }) => {
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
      <HeaderCourierButtons navigation={navigation} />}
    </>
  );
};

const RootStack = createStackNavigator();

export default () => {
  const screenOptions = useStackNavigatorScreenOptions({
    presentation: 'modal',
  });

  // The task list must not still be on the day this session was opened on.
  useResetDateOnDayChange();

  return (
    <TaskListsProvider>
      <RootStack.Navigator
      // Map screens must not be detached/re-attached: see
      // DrawerNavigator and https://github.com/coopcycle/coopcycle-app/issues/2113
        detachInactiveScreens={false}
        screenOptions={screenOptions}>
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
