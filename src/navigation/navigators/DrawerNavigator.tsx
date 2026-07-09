import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { connect } from 'react-redux';

import { headerLeft } from '..';
import i18n from '../../i18n';
import {
  selectInitialRouteName,
  selectIsAuthenticated,
  selectShowRestaurantsDrawerItem,
  selectUser,
} from '../../redux/App/selectors';
import { useStackNavigatorScreenOptions } from '../styles';

import DrawerContent from '../components/DrawerContent';

import { HeaderBackButton } from '@react-navigation/elements';
import About from '../home/About';
import FeatureFlags from '../home/FeatureFlags';
import Privacy from '../home/Privacy';
import Terms from '../home/Terms';
import AccountNavigator from './AccountNavigator';
import CheckoutNavigator from './CheckoutNavigator';
import CourierNavigator from './CourierNavigator';
import DeliveryNavigator from './DeliveryNavigator';
import DispatchNavigator from './DispatchNavigator';
import RestaurantNavigator from './RestaurantNavigator';
import StoreNavigator from './StoreNavigator';

const AboutStack = createStackNavigator();

const AboutNavigator = () => {
  const screenOptions = useStackNavigatorScreenOptions();

  return (
    <AboutStack.Navigator screenOptions={screenOptions}>
      <AboutStack.Screen
        name="AboutHome"
        component={About}
        options={({ navigation }) => ({
          title: i18n.t('ABOUT'),
          headerLeft: headerLeft(navigation),
        })}
      />
    </AboutStack.Navigator>
  );
};

const FeatureFlagsStack = createStackNavigator();

const FeatureFlagsNavigator = () => {
  const screenOptions = useStackNavigatorScreenOptions();

  return (
    <FeatureFlagsStack.Navigator screenOptions={screenOptions}>
      <FeatureFlagsStack.Screen
        name="FeatureFlagsHome"
        component={FeatureFlags}
        options={({ navigation }) => ({
          title: i18n.t('FEATURE_FLAGS'),
          headerLeft: props => (
            <HeaderBackButton {...props} onPress={() => navigation.goBack()} />
          ),
        })}
      />
    </FeatureFlagsStack.Navigator>
  );
};

function mapStateToProps(state) {
  const user = selectUser(state);

  return {
    isAuthenticated: selectIsAuthenticated(state),
    user,
    initialRouteName: selectInitialRouteName(state),
    showRestaurantsDrawerItem: selectShowRestaurantsDrawerItem(state),
  };
}

const Drawer = createDrawerNavigator();

const DrawerNav = ({
  initialRouteName,
  user,
  isAuthenticated,
  showRestaurantsDrawerItem,
}) => {
  return (
    <Drawer.Navigator
      drawerContent={props => <DrawerContent {...props} />}
      initialRouteName={initialRouteName}
      screenOptions={{
        headerShown: false,
      }}>
      <Drawer.Screen name="CheckoutNav" component={CheckoutNavigator} />
      <Drawer.Screen name="DeliveryNav" component={DeliveryNavigator} />
      <Drawer.Screen name="AccountNav" component={AccountNavigator} />
      <Drawer.Screen name="AboutNav" component={AboutNavigator} />
      <Drawer.Screen name="FeatureFlagsNav" component={FeatureFlagsNavigator} />

      {isAuthenticated && user.hasRole('ROLE_COURIER') && (
        <Drawer.Screen name="CourierNav" component={CourierNavigator} />
      )}
      {showRestaurantsDrawerItem && (
        <Drawer.Screen name="RestaurantNav" component={RestaurantNavigator} />
      )}
      {isAuthenticated && user.hasRole('ROLE_STORE') && (
        <Drawer.Screen name="StoreNav" component={StoreNavigator} />
      )}
      {isAuthenticated &&
        (user.hasRole('ROLE_DISPATCHER') || user.hasRole('ROLE_ADMIN')) && (
          <Drawer.Screen name="DispatchNav" component={DispatchNavigator} />
        )}
    </Drawer.Navigator>
  );
};

const ConnectedDrawerNav = connect(mapStateToProps)(DrawerNav);

const RootStack = createStackNavigator();

// The drawer sits inside a root stack so Terms & Privacy can be presented as
// modals over *any* screen (the registration forms and the drawer menu)
// without switching the drawer's active screen — which previously lost the
// user's place / half-filled form when navigating "back".
const RootNavigator = () => {
  const screenOptions = useStackNavigatorScreenOptions();

  return (
    <RootStack.Navigator screenOptions={screenOptions}>
      <RootStack.Screen
        name="Main"
        component={ConnectedDrawerNav}
        options={{ headerShown: false }}
      />
      <RootStack.Group screenOptions={{ presentation: 'modal' }}>
        <RootStack.Screen
          name="TermsModal"
          component={Terms}
          options={{ title: i18n.t('TERMS_OF_SERVICE') }}
        />
        <RootStack.Screen
          name="PrivacyModal"
          component={Privacy}
          options={{ title: i18n.t('PRIVACY') }}
        />
      </RootStack.Group>
    </RootStack.Navigator>
  );
};

export default RootNavigator;
