// @see https://reactnavigation.org/docs/navigating-without-navigation-prop
import * as React from 'react'

export const navigationRef = React.createRef()

export default class NavigationHolder {

  static navigate(routeName, params) {
    navigationRef.current?.navigate(routeName, params)
  }

  static dispatch(action) {
    // return this.topLevelNavigator.dispatch(action)
  }

  static goBack() {
    // return this.topLevelNavigator.dispatch(
    //   NavigationActions.back({
    //     key: null,
    //   })
    // )
  }

}
