import { Circle, Icon } from 'native-base';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { HeaderBackButton } from '@react-navigation/elements';
import { StyleSheet,TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { createDeliverySuccess } from '../../redux/Store/actions';
import { DeliveryCallbackProvider } from '../delivery/contexts/DeliveryCallbackContext';
import { NewDeliveryNavigator } from './NewDeliveryNavigator';
import { selectKeywordFilters } from '../../redux/Dispatch/selectors';
import { useBackgroundContainerColor, useBaseTextColor } from '../../styles/theme';
import { useStackNavigatorScreenOptions } from '../styles';
import HeaderRightButton from '../dispatch/HeaderRightButton';
import i18n from '../../i18n';
import KeyboardAdjustView from '../../components/KeyboardAdjustView';
import NavigationHolder from '../../NavigationHolder';
import screens, { headerLeft } from '..';
import SearchInput from '../../components/SearchInput';
import TaskNavigator from './TaskNavigator';
import { clearSelectedTasks } from '../../redux/Dispatch/updateSelectedTasksSlice';



const Tab = createBottomTabNavigator();

function CustomTabBar({ navigation }) {
  const color = useBaseTextColor();
  const bgColor = useBackgroundContainerColor();
  const keywordFilters = useSelector(selectKeywordFilters);

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
      <TouchableOpacity
        style={customTabBarStyles.tabButton}
        onPress={showMapButton ? goToTasksMap : goToTasksList}
        testID="toggleTasksMapListButton"
      >
        <Icon as={FontAwesome} name={showMapButton ? "map" : "list"} style={{ color }} />
      </TouchableOpacity>
      <SearchInput
        style={customTabBarStyles.searchInput}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearchSubmit}
        placeholder={i18n.t('SEARCH_TAB')}
        value={searchQuery}
      />
      <TouchableOpacity
        style={customTabBarStyles.tabButton}
        onPress={() => navigation.navigate('DispatchTasksFilters')}
        testID="showTasksFiltersButton"
      >
        <Icon as={FontAwesome} name="filter" style={{ color }} />
        {keywordFilters.length > 0 && (
          <Circle
            size={3}
            style={customTabBarStyles.filtersEnabled}
          />
        )}
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
  searchInput: {
    flex: 1,
    marginHorizontal: 10,
  },
  filtersEnabled: {
    backgroundColor: '#D80000',
    position: 'absolute',
    right: 10,
    top: 10,
  }
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

  useEffect(() => {
    const clearSelectedTasksState = navigation.addListener('blur', () => {
      dispatch(clearSelectedTasks());
    });
    return clearSelectedTasksState;
  }, [navigation, dispatch]);

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
