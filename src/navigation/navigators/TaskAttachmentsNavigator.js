import React, { Component } from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { connect } from 'react-redux'

import i18n from '../../i18n'
import screens from '..'
import { stackNavigatorScreenOptions } from '../styles'
import { selectSignatureScreenFirst } from '../../redux/Courier'

const Tab = createMaterialTopTabNavigator()

const TabNavigator = ({ initialRouteName }) => (
  <Tab.Navigator
    screenOptions={ stackNavigatorScreenOptions }
    backBehavior="history"
    // Disable swipe to avoid swiping when signing
    swipeEnabled={ false }
    initialRouteName={ initialRouteName }>
    <Tab.Screen
      name="TaskPhoto"
      component={ screens.TaskPhoto }
      options={{
        title: i18n.t('PHOTO'),
      }}
    />
    <Tab.Screen
      name="TaskSignature"
      component={ screens.TaskSignature }
      options={{
        title: i18n.t('SIGNATURE'),
      }}
    />
  </Tab.Navigator>
)

const PreferencesAwareNavigator = ({ signatureScreenFirst }) => (
  <TabNavigator
    initialRouteName={ signatureScreenFirst ? 'TaskSignature' : 'TaskPhoto' } />
)

const mapStateToProps = (state) => ({
  signatureScreenFirst: selectSignatureScreenFirst(state),
})

export default connect(mapStateToProps)(PreferencesAwareNavigator)
