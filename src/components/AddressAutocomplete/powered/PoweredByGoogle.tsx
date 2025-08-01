import { useColorMode } from 'native-base';
import { Image, View } from 'react-native';

export default function PoweredByGoogle({ style }) {
  const { colorMode } = useColorMode();
  return (
    <View style={style}>
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
