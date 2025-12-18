import { Badge } from '@/components/ui/badge';
import { VStack } from '@/components/ui/vstack';
import { Icon } from '@/components/ui/icon';
import { HStack } from '@/components/ui/hstack';
import { List, ListFilter, Map } from 'lucide-react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HeaderBackButton } from '@react-navigation/elements';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { clearSelectedTasks } from '../../redux/Dispatch/updateSelectedTasksSlice';
import { createDeliverySuccess } from '../../redux/Store/actions';
import { DeliveryCallbackProvider } from '../delivery/contexts/DeliveryCallbackContext';
import { NewDeliveryNavigator } from './NewDeliveryNavigator';
import { selectKeywordFilters } from '../../redux/Dispatch/selectors';
import { useStackNavigatorScreenOptions } from '../styles';
import HeaderRightButton from '../dispatch/HeaderRightButton';
import i18n from '../../i18n';
import KeyboardAdjustView from '../../components/KeyboardAdjustView';
import NavigationHolder from '../../NavigationHolder';
import OrderNavigator from './OrderNavigator';
import screens, { headerLeft } from '..';
import SearchInput from '../../components/SearchInput';
import TaskNavigator from './TaskNavigator';
import { TaskListsProvider, useTaskListsContext } from '../courier/contexts/TaskListsContext';
import { HeaderButtons, HeaderButton } from '../../components/HeaderButton';
import { TaskActionsMenu } from '../dispatch/TaskActionsMenu';

const Tab = createBottomTabNavigator();

function CustomTabBar({ navigation }) {
  const keywordFilters = useSelector(selectKeywordFilters);

  const [searchQuery, setSearchQuery] = useState('');
  const [showMapButton, setShowMapButton] = useState(true);
  const insets = useSafeAreaInsets();

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      navigation.navigate('DispatchTasksSearchResults', { searchQuery });
      setSearchQuery('');
    }
  };

  const goToTasksMap = () => {
    setShowMapButton(false);
    navigation.navigate('DispatchTasksMap');
  };

  const goToTasksList = () => {
    setShowMapButton(true);
    navigation.navigate('DispatchAllTasks');
  };

  return (
    <HStack
      className="items-center justify-between p-4 bg-background-50"
      style={{ paddingBottom: insets.bottom }}>
      <TouchableOpacity
        style={customTabBarStyles.tabButton}
        onPress={showMapButton ? goToTasksMap : goToTasksList}
        testID="toggleTasksMapListButton">
        <Icon
          as={showMapButton ? Map : List}
          size="xl"
        />
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
        testID="showTasksFiltersButton">
        <VStack>
          {keywordFilters.length > 0 && (
            <Badge
              className="z-10 self-end h-[12px] w-[12px] bg-red-600 rounded-full -mb-3 -mr-2"
              variant="solid" />
          )}
          <Icon as={ListFilter} size="xl" />
        </VStack>
      </TouchableOpacity>
    </HStack>
  );
}

const customTabBarStyles = StyleSheet.create({
  tabButton: {
    padding: 10,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 10,
  },
});

function Tabs() {
  return (
    <KeyboardAdjustView style={{ flex: 1 }}>
      <Tab.Navigator
        tabBar={props => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
        }}>
        <Tab.Screen
          name="DispatchAllTasks"
          component={screens.DispatchAllTasks}
          options={() => ({
            title: false,
            tabBarButtonTestID: 'dispatchAllTasks',
          })}
        />
        <Tab.Screen
          name="DispatchTasksMap"
          component={screens.DispatchTasksMap}
          options={() => ({
            title: false,
            tabBarButtonTestID: 'dispatchTasksMap',
          })}
        />
      </Tab.Navigator>
    </KeyboardAdjustView>
  );
}

const RootStack = createNativeStackNavigator();

const HeaderLeftButton = ({navigation}) => {
  const context = useTaskListsContext();
  const dispatch = useDispatch();

  const handleExitEditMode = () => {
    context?.clearSelectedTasks();
    dispatch(clearSelectedTasks());
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

  return headerLeft(navigation, 'menuBtnDispatch')();
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
          assign: true,
          cancel: true,
          reportIncident: true,
        }}
      />
      :
      <HeaderRightButton
        onPress={() => navigation.navigate('DispatchDate')}
      />}
    </>
  );
};

export default function DispatchNavigator({ navigation }) {
  const taskListsContext = useTaskListsContext();
  const dispatch = useDispatch();
  const screenOptions = useStackNavigatorScreenOptions({
    // Do *NOT* use presentation = modal,
    // to avoid conflicting with gestures to close the modal when signing proofs of delivery.
    // gestureEnabled should be used for this, but it doesn't work as expected.
    presentation: 'card',
  });

  useEffect(() => {
    const clearSelectedTasksState = navigation.addListener('blur', () => {
      dispatch(clearSelectedTasks());
    });
    return clearSelectedTasksState;
  }, [navigation, dispatch]);

  const deliveryCallback = newDelivery => {
    navigation.navigate('DispatchAllTasks');
    dispatch(createDeliverySuccess(newDelivery));
  };
  const deliveryCallbackOptions = {
    allowManualPrice: true,
  };

  return (
    <DeliveryCallbackProvider callback={deliveryCallback} options={deliveryCallbackOptions}>
      <TaskListsProvider defaultIsFromCourier={false}>
        <RootStack.Navigator screenOptions={screenOptions}>
          <RootStack.Screen
            name="DispatchHome"
            component={Tabs}
            options={({ navigation }) => ({
              title: i18n.t('DISPATCH'),
              headerLeft: () => <HeaderLeftButton navigation={navigation} />,
              headerRight: () => (
                <HeaderRightBody
                  isEditMode={taskListsContext?.isEditMode}
                  navigation={navigation}/>
              ),
            })}
          />
          <RootStack.Screen
            name="DispatchTasksSearchResults"
            component={screens.DispatchTasksSearchResults}
            options={() => ({
              tabBarButtonTestID: 'dispatchTasksSearchResults',
              title: i18n.t('DISPATCH_SEARCH_RESULTS'),
            })}
          />
          <RootStack.Screen
            name="DispatchTasksFilters"
            component={screens.DispatchTasksFilters}
            options={() => ({
              tabBarButtonTestID: 'dispatchTasksFilters',
              title: i18n.t('DISPATCH_TASKS_FILTERS'),
            })}
          />
          <RootStack.Screen
            name="DispatchKeywordsFilters"
            component={screens.DispatchKeywordsFilters}
            options={() => ({
              tabBarButtonTestID: 'dispatchKeywordsFilters',
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
          <RootStack.Screen
            name="Order"
            component={OrderNavigator}
            options={{
              headerShown: false,
            }}
          />
        </RootStack.Navigator>
      </TaskListsProvider>
    </DeliveryCallbackProvider>
  );
}
