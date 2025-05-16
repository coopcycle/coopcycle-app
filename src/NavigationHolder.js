// @see https://reactnavigation.org/docs/navigating-without-navigation-prop

import { CommonActions, createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export default class NavigationHolder {

  static navigate(routeName, params) {
    return navigationRef.navigate(routeName, params);
  }

  static dispatch(action) {
    return navigationRef.dispatch(action);
  }

  static goBack() {
    return navigationRef.dispatch(CommonActions.goBack());
  }
}
