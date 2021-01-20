import React, { Component } from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { createCompatNavigatorFactory, NavigationActions } from '@react-navigation/compat'

import i18n from '../../i18n'
import screens from '..'

const routeConfigs = {
  TaskPhoto: {
    screen: screens.TaskPhoto,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('PHOTO'),
    }),
  },
  TaskSignature: {
    screen: screens.TaskSignature,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('SIGNATURE'),
    }),
  },
}

const tabNavigatorConfig = {
  // Disable swipe to avoid swiping when signing
  swipeEnabled: false,
  backBehavior: 'history',
}

const TopTabNavigator = createCompatNavigatorFactory(createMaterialTopTabNavigator)(routeConfigs, tabNavigatorConfig)

// @see https://reactnavigation.org/docs/en/custom-navigators.html

class PreferencesAwareNavigator extends Component {

  static router = {
    ...TopTabNavigator.router,
    getStateForAction: (action, inputState) => {
      const state = TopTabNavigator.router.getStateForAction(action, inputState)

      if (action.type === NavigationActions.INIT) {
        if (action.params && action.params.signatureScreenFirst) {

          return {
            ...state,
            index: 1,
          }
        }
      }

      return state
    },
  }

  render() {
    return <TopTabNavigator navigation={ this.props.navigation } />
  }
}

export default PreferencesAwareNavigator
