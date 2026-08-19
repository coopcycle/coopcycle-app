import { Image, View } from 'react-native';

import { useColorModeValue } from '../../../styles/theme';

export default function PoweredByIdealPostcodes({ style }) {
  // the logo is a black shape with an alpha channel, so it can be tinted
  const tintColor = useColorModeValue('#000000', '#FFFFFF');

  return (
    <View style={style}>
      <Image
        resizeMode="contain"
        tintColor={tintColor}
        source={require('../../../../assets/images/ideal_postcodes.png')}
      />
    </View>
  );
}
