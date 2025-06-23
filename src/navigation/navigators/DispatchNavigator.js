import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { HeaderBackButton } from '@react-navigation/elements';
import { Icon } from 'native-base';
import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { createDeliverySuccess } from '../../redux/Store/actions';
import { DeliveryCallbackProvider } from '../delivery/contexts/DeliveryCallbackContext';
import { NewDeliveryNavigator } from './NewDeliveryNavigator';
import { useDispatch } from 'react-redux';
import { useStackNavigatorScreenOptions } from '../styles';
import HeaderRightButton from '../dispatch/HeaderRightButton';
import i18n from '../../i18n';
import NavigationHolder from '../../NavigationHolder';
import screens, { headerLeft } from '..';
import SearchInput from '../../components/SearchInput';
import TaskNavigator from './TaskNavigator';


const Tab = createBottomTabNavigator();

function CustomTabBar({ navigation }) {
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
    <View style={customTabBarStyles.tabBarContainer}>
      { showMapButton
        ? (
          <TouchableOpacity
            style={customTabBarStyles.tabButton}
            onPress={goToTasksMap}
          >
            <Icon as={FontAwesome} name="map" />
          </TouchableOpacity>
        )
        : (
          <TouchableOpacity
            style={customTabBarStyles.tabButton}
            onPress={goToTasksList}
          >
            <Icon as={FontAwesome} name="list" />
          </TouchableOpacity>
        )
      }
      <SearchInput
        style={customTabBarStyles.searchInput}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearchSubmit}
        placeholder="Search"
        value={searchQuery}
      />
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
  searchInput: {
    flex: 1,
    marginHorizontal: 10,
    paddingLeft: 15,
  },
});

function Tabs() {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => {
        const calculated = e.endCoordinates.height - 92;
        setKeyboardHeight(calculated);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [insets.bottom]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'android' ? 'height' : 'padding'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={
        Platform.OS === 'android'
          ? -keyboardHeight
          : insets.bottom
      }
    >
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
    </KeyboardAvoidingView>
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
          name="DispatchKeywordsFilters"
          component={screens.DispatchKeywordsFilters}
          options={() => ({
            tabBarTestID: 'dispatchKeywordsFilters',
            title: i18n.t('DISPATCH_KEYWORDS_FILTERS'),
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
