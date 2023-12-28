import {Image, StyleSheet, View} from 'react-native';
import {Text, useColorModeValue} from 'native-base';
import {TimingBadge} from '../navigation/checkout/components/RestaurantBadges';
import {RestaurantBadge} from './RestaurantBadge';

export const RestaurantTag = ({text}) => {
  const backgroundColor = useColorModeValue(
    'rgba(0,0,0,.05)',
    'rgba(255,255,255,.05)',
  );

  const styles = StyleSheet.create({
    tag: {
      backgroundColor: backgroundColor,
      borderRadius: 8,
      paddingVertical: 2,
      paddingHorizontal: 8,
      whiteSpace: 'nowrap',
      display: 'flex',
      // alignSelf: 'left',
    },
    textTag: {
      fontSize: 14,
    },
  });

  return (
    <View style={styles.tag}>
      <Text style={styles.textTag}>{text}</Text>
    </View>
  );
};
