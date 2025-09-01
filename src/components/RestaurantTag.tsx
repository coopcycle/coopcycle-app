import { Text } from '@/components/ui/text';
import { StyleSheet, View } from 'react-native';
import { useBackgroundHighlightColor } from '../styles/theme';

export const RestaurantTag = ({ text }) => {
  const backgroundColor = useBackgroundHighlightColor();

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
