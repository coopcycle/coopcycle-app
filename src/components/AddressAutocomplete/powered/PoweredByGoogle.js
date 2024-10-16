import { useColorMode } from 'native-base';
import { Image, View } from 'react-native';
import { useBackgroundColor } from '../../../styles/theme';

export default function PoweredByGoogle({ styles }) {
  const { colorMode } = useColorMode();
  const backgroundColor = useBackgroundColor();

  return (
    <View style={[styles, { backgroundColor: backgroundColor }]}>
      {colorMode !== 'dark' && (
        <Image
          resizeMode="contain"
          source={require('../../../../assets/images/powered_by_google_on_white.png')}
        />
      )}
      {colorMode === 'dark' && (
        <Image
          resizeMode="contain"
          source={require('../../../../assets/images/powered_by_google_on_non_white.png')}
        />
      )}
    </View>
  );
}
