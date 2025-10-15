import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { connect } from 'react-redux';

import screens from '..';
import i18n from '../../i18n';
import { selectSignatureScreenFirst } from '../../redux/Courier';
import { Icon } from '@/components/ui/icon';
import { Camera, Signature } from 'lucide-react-native'

const Tab = createBottomTabNavigator();

const TabNavigator = ({ initialRouteName, initialParams }) => {

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
      backBehavior="history"
      initialRouteName={initialRouteName}>
      <Tab.Screen
        name="TaskPhoto"
        component={screens.TaskPhoto}
        options={{
          tabBarLabel: i18n.t('PHOTO'),
          tabBarIcon: ({ color }) => {
            return <Icon as={Camera} size="xl" style={{ color }} />;
          },
        }}
        initialParams={initialParams}
      />
      <Tab.Screen
        name="TaskSignature"
        component={screens.TaskSignature}
        options={{
          tabBarLabel: i18n.t('SIGNATURE'),
          tabBarIcon: ({ color }) => {
            return <Icon as={Signature} size="xl" style={{ color }} />;
          },
        }}
        initialParams={initialParams}
      />
    </Tab.Navigator>
  );
};

// The params are *NOT* passed to the child tab navigator
// https://stackoverflow.com/a/68651234/333739
const PreferencesAwareNavigator = ({ signatureScreenFirst, route }) => (
  <TabNavigator
    initialRouteName={signatureScreenFirst ? 'TaskSignature' : 'TaskPhoto'}
    initialParams={route.params}
  />
);

const mapStateToProps = state => ({
  signatureScreenFirst: selectSignatureScreenFirst(state),
});

export default connect(mapStateToProps)(PreferencesAwareNavigator);
