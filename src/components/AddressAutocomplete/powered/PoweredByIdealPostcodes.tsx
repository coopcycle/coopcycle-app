import { Image, View } from 'react-native';

export default function PoweredByIdealPostcodes({ style }) {
  return (
    <View style={style}>
      <Image
        resizeMode="contain"
        source={require('../../../../assets/images/ideal_postcodes.png')}
      />
    </View>
  );
}
