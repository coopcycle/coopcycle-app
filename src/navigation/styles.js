import { useColorModeValue } from 'native-base';
import { fontTitleName } from '../styles/common';
import { useBackgroundContainerColor } from '../styles/theme';

function StackNavigatorScreenOptions() {
  const backgroundColor = useBackgroundContainerColor();
  const color = useColorModeValue('black', 'white');

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
    headerBackTitleVisible: false,
  };
}
export { StackNavigatorScreenOptions as stackNavigatorScreenOptions };
