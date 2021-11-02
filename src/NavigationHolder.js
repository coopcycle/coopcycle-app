// @see https://reactnavigation.org/docs/navigating-without-navigation-prop

import { CommonActions } from '@react-navigation/native'

export default class NavigationHolder {

  static navigationRef

  static setNavigationRef(navigationRef) {
    this.navigationRef = navigationRef
  }

  static navigate(routeName, params) {
    return this.navigationRef.current?.navigate(routeName, params)
  }

  static dispatch(action) {
    return this.navigationRef.current?.dispatch(action)
  }

  static goBack() {
    return this.navigationRef.current?.dispatch(
      CommonActions.goBack()
    )
  }
}
