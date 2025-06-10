import { Box, Icon } from 'native-base';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { HeaderBackButton } from '@react-navigation/elements';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import React from 'react';

import { createDeliverySuccess } from '../../redux/Store/actions';
import { DeliveryCallbackProvider } from '../delivery/contexts/DeliveryCallbackContext';
import { NewDeliveryNavigator } from './NewDeliveryNavigator';
import { useDispatch } from 'react-redux';
import { useStackNavigatorScreenOptions } from '../styles';
import HeaderRightButton from '../dispatch/HeaderRightButton';
import i18n from '../../i18n';
import NavigationHolder from '../../NavigationHolder';
import screens, { headerLeft } from '..';
import TaskNavigator from './TaskNavigator';


const Tab = createBottomTabNavigator();

function CustomTabBar({ navigation }) {
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      navigation.navigate('DispatchTasksSearchResults', { searchQuery });
      setSearchQuery('');
    }
  };

  return (
    <View style={customTabBarStyles.tabBarContainer}>
      <TouchableOpacity
        style={customTabBarStyles.tabButton}
        onPress={() => navigation.navigate('DispatchTasksMap')}
      >
        <Icon as={FontAwesome} name="map" />
      </TouchableOpacity>
      <Box style={customTabBarStyles.searchContainer}>
        <Icon
          as={FontAwesome}
          name="search"
          size={6}
          color="#000000"
          style={customTabBarStyles.searchIcon}
        />
        <TextInput
          style={customTabBarStyles.searchInput}
          placeholder="Search"
          placeholderTextColor="#000000"
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
        <Icon as={FontAwesome} name="filter" />
      </TouchableOpacity>
    </View>
  );
}

const customTabBarStyles = StyleSheet.create({
  tabBarContainer: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopColor: '#ddd',
    borderTopWidth: 1,
    flexDirection: 'row',
    height: 68,
    justifyContent: 'space-between',
    paddingHorizontal: 10,
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
    height: 41,
    marginHorizontal: 10,
    paddingLeft: 15,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    color: '#000000',
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
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
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
            title: 'dispatchTasksSearchResults',
          })}
        />
        <RootStack.Screen
        name="DispatchTasksFilters"
        component={screens.DispatchTasksFilters}
          options={() => ({
            tabBarTestID: 'dispatchTasksFilters',
            title: 'dispatchTasksFilters',
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
