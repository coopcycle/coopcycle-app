import { fontTitleName } from '../styles/common';
import { useBackgroundContainerColor, useBaseTextColor } from '../styles/theme';

export function useStackNavigatorScreenOptions(props = {}) {
  const backgroundColor = useBackgroundContainerColor();
  const color = useBaseTextColor();

  return {
    headerStyle: {
      backgroundColor: backgroundColor,
    },
    headerBackTitleStyle: {
      color: color,
      fontWeight: 'normal',
      fontFamily: fontTitleName,
    },
    headerTintColor: color,
    headerTitleStyle: {
      color: color,
      // fontWeight needs to be defined or it doesn't work
      // @see https://github.com/react-community/react-navigation/issues/542#issuecomment-345289122
      fontWeight: 'normal',
      fontFamily: fontTitleName,
    },
    headerTitleAlign: 'center',
    headerBackButtonDisplayMode: 'minimal',
    ...props,
  };
}
