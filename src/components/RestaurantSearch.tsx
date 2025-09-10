import { useColorModeValue } from '../styles/theme';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { MapPin } from 'lucide-react-native';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { Platform, StyleSheet, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { TouchableNativeFeedback } from 'react-native-gesture-handler';
import Svg, { Path } from 'react-native-svg';

const textInputContainerHeight = 54;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    padding: 16,
    //TODO: color
    ...Platform.select({
      android: {
        flex: 1,
        top: 0,
        right: 0,
        left: 0,
        zIndex: 1,
      },
      ios: {
        top: 0,
        left: 0,
        zIndex: 10,
        overflow: 'visible',
      },
    }),
  },
  input: {
    borderColor: 'black',
    borderWidth: 0.5,
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    paddingRight: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  text: {
    flex: 1,
  },
});

function RestaurantSearch(props) {
  const navigation = useNavigation();
  const borderColor = useColorModeValue(
    'rgba(0,0,0,.25)',
    'rgba(255,255,255,.25)',
  );

  return (
    <Box
      className="bg-background-50"
      style={[styles.container, { width: props.width }]}>
      <TouchableNativeFeedback
        onPress={() => {
          navigation.navigate('AccountAddresses', { action: 'search' });
        }}>
        <View style={[styles.input, { borderColor }]}>
          <Icon as={MapPin} size="sm" />
          <Text
            style={styles.text}
            size="lg"
            numberOfLines={1}
            ellipsizeMode="tail">
            {props.defaultValue?.streetAddress}
          </Text>
        </View>
      </TouchableNativeFeedback>
    </Box>
  );
}

export default withTranslation()(RestaurantSearch);
