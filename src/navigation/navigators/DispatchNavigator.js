import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HeaderBackButton } from '@react-navigation/elements';
import { createStackNavigator } from '@react-navigation/stack';
import { Box, Icon } from 'native-base';
import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { useDispatch } from 'react-redux';
import screens, { headerLeft } from '..';
import KeyboardAdjustView from '../../components/KeyboardAdjustView';
import i18n from '../../i18n';
import NavigationHolder from '../../NavigationHolder';
import { createDeliverySuccess } from '../../redux/Store/actions';
import { blackColor } from '../../styles/common';
import { useBackgroundContainerColor, useBaseTextColor } from '../../styles/theme';
import { DeliveryCallbackProvider } from '../delivery/contexts/DeliveryCallbackContext';
import HeaderRightButton from '../dispatch/HeaderRightButton';
import { useStackNavigatorScreenOptions } from '../styles';
import { NewDeliveryNavigator } from './NewDeliveryNavigator';
import TaskNavigator from './TaskNavigator';


const Tab = createBottomTabNavigator();

function CustomTabBar({ navigation }) {
  const color = useBaseTextColor();
  const bgColor = useBackgroundContainerColor()
  const [searchQuery, setSearchQuery] = useState('');
  const [showMapButton, setShowMapButton] = useState(true);

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      navigation.navigate('DispatchTasksSearchResults', { searchQuery });
      setSearchQuery('');
    }
  };

  const goToTasksMap = () => {
    setShowMapButton(false);
    navigation.navigate('DispatchTasksMap');
  }

  const goToTasksList = () => {
    setShowMapButton(true);
    navigation.navigate('DispatchAllTasks')
  }

  return (
    <View style={[customTabBarStyles.tabBarContainer, { backgroundColor: bgColor }]}>
      { showMapButton
        ? (
          <TouchableOpacity
            style={customTabBarStyles.tabButton}
            onPress={goToTasksMap}
          >
            <Icon as={FontAwesome} name="map" style={{ color }} />
          </TouchableOpacity>
        )
        : (
          <TouchableOpacity
            style={customTabBarStyles.tabButton}
            onPress={goToTasksList}
          >
            <Icon as={FontAwesome} name="list" style={{ color }} />
          </TouchableOpacity>
        )
      }
      <Box style={customTabBarStyles.searchContainer}>
        <Icon
          as={FontAwesome}
          name="search"
          size={6}
          style={customTabBarStyles.searchIcon}
        />
        <TextInput
          style={customTabBarStyles.searchInput}
          placeholder="Search"
          placeholderTextColor={blackColor}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearchSubmit}
          returnKeyType="search"
        />
      </Box>
      <TouchableOpacity
        style={customTabBarStyles.tabButton}
        onPress={() => navigation.navigate('DispatchTasksFilters')}
      >
        <Icon as={FontAwesome} name="filter" style={{ color }} />
      </TouchableOpacity>
    </View>
  );
}

const customTabBarStyles = StyleSheet.create({
  tabBarContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 10,
  },
  tabButton: {
    padding: 10,
  },
  searchContainer: {
    alignItems: 'center',
    backgroundColor: '#EFEFEF',
    borderRadius: 20.5,
    flex: 1,
    flexDirection: 'row',
    height: 40,
    marginHorizontal: 10,
    paddingLeft: 15,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 14,
    height: '100%',
    marginLeft: -30,
    paddingRight: 30,
    textAlign: 'center',
  },
});

function Tabs() {

  return (
    <KeyboardAdjustView style={{ flex: 1 }} androidBehavior="height">
      <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
        }}>
        <Tab.Screen
          name="DispatchAllTasks"
          component={screens.DispatchAllTasks}
          options={() => ({
            title: false,
            tabBarTestID: 'dispatchAllTasks',
          })}
        />
        <Tab.Screen
          name="DispatchTasksMap"
          component={screens.DispatchTasksMap}
          options={() => ({
            title: false,
            tabBarTestID: 'dispatchTasksMap',
          })}
        />
      </Tab.Navigator>
    </KeyboardAdjustView>
  );
};

const RootStack = createStackNavigator();

export default function DispatchNavigator({
  navigation,
}) {
  const dispatch = useDispatch();
  const screenOptions = useStackNavigatorScreenOptions({
    presentation: 'modal',
  });

  const deliveryCallback = newDelivery => {
    navigation.navigate('DispatchAllTasks');
    dispatch(createDeliverySuccess(newDelivery));
  };

  return (
    <DeliveryCallbackProvider callback={deliveryCallback}>
      <RootStack.Navigator screenOptions={screenOptions}>
        <RootStack.Screen
          name="DispatchHome"
          component={Tabs}
          options={({ navigation }) => ({
            title: i18n.t('DISPATCH'),
            headerLeft: headerLeft(navigation, 'menuBtnDispatch'),
            headerRight: () => (
              <HeaderRightButton
                onPress={() => navigation.navigate('DispatchDate')}
              />
            ),
          })}
        />
        <RootStack.Screen
          name="DispatchTasksSearchResults"
          component={screens.DispatchTasksSearchResults}
          options={() => ({
            tabBarTestID: 'dispatchTasksSearchResults',
            title: i18n.t('DISPATCH_SEARCH_RESULTS'),
          })}
        />
        <RootStack.Screen
        name="DispatchTasksFilters"
        component={screens.DispatchTasksFilters}
          options={() => ({
            tabBarTestID: 'dispatchTasksFilters',
            title: i18n.t('DISPATCH_TASKS_FILTERS'),
          })}
        />
        <RootStack.Screen
          name="Task"
          component={TaskNavigator}
          options={{
            headerShown: false,
          }}
        />
        <RootStack.Screen
          name="DispatchPickUser"
          component={screens.DispatchPickUser}
          options={{
            title: i18n.t('DISPATCH_PICK_USER'),
          }}
        />
        <RootStack.Screen
          name="DispatchNewDelivery"
          component={NewDeliveryNavigator}
          options={{
            title: i18n.t('DISPATCH_NEW_DELIVERY'),
            headerBackTitleVisible: false,
            headerLeft: props => (
              <HeaderBackButton
                {...props}
                onPress={() => NavigationHolder.goBack()}
              />
            ),
          }}
        />
        <RootStack.Screen
          name="DispatchDate"
          component={screens.DispatchDate}
          options={{
            title: i18n.t('DISPATCH_DATE'),
          }}
        />
      </RootStack.Navigator>
    </DeliveryCallbackProvider>
  );
};
