import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { connect } from 'react-redux'

import i18n from '../../i18n'
import screens from '..'
import { stackNavigatorScreenOptions } from '../styles'
import { selectSignatureScreenFirst } from '../../redux/Courier'

const Tab = createMaterialTopTabNavigator()

const TabNavigator = ({ initialRouteName, initialParams }) => (
  <Tab.Navigator
    screenOptions={{
      ...stackNavigatorScreenOptions,
      // Disable swipe to avoid swiping when signing
      swipeEnabled: false,
    }}
    backBehavior="history"
    initialRouteName={ initialRouteName }>
    <Tab.Screen
      name="TaskPhoto"
      component={ screens.TaskPhoto }
      options={{
        title: i18n.t('PHOTO'),
      }}
      initialParams={ initialParams }
    />
    <Tab.Screen
      name="TaskSignature"
      component={ screens.TaskSignature }
      options={{
        title: i18n.t('SIGNATURE'),
      }}
      initialParams={ initialParams }
    />
  </Tab.Navigator>
)

// The params are *NOT* passed to the child tab navigator
// https://stackoverflow.com/a/68651234/333739
const PreferencesAwareNavigator = ({ signatureScreenFirst, route }) => (
  <TabNavigator
    initialRouteName={ signatureScreenFirst ? 'TaskSignature' : 'TaskPhoto' }
    initialParams={ route.params } />
)

const mapStateToProps = (state) => ({
  signatureScreenFirst: selectSignatureScreenFirst(state),
})

export default connect(mapStateToProps)(PreferencesAwareNavigator)
