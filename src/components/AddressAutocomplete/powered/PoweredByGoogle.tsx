import { Image, View, useColorScheme } from 'react-native';

export default function PoweredByGoogle({ style }) {
  const colorScheme = useColorScheme();
  return (
    <View style={style}>
      {colorScheme !== 'dark' && (
        <Image
          resizeMode="contain"
          source={require('../../../../assets/images/powered_by_google_on_white.png')}
        />
      )}
      {colorScheme === 'dark' && (
        <Image
          resizeMode="contain"
          source={require('../../../../assets/images/powered_by_google_on_non_white.png')}
        />
      )}
    </View>
  );
}
