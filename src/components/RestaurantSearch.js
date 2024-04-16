import { Text, useColorModeValue } from 'native-base';
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

function RestaurantSearch(props) {
  const navigation = useNavigation();
  const backgroundColor = useColorModeValue('#fff', '#201E1E');
  const fill = useColorModeValue('#201E1E', '#fff');
  const borderColor = useColorModeValue(
    'rgba(0,0,0,.25)',
    'rgba(255,255,255,.25)',
  );

  return (
    <View
      style={[styles.container, { width: props.width }, { backgroundColor }]}>
      <TouchableNativeFeedback
        onPress={() => {
          navigation.navigate('AccountAddresses', { action: 'search' });
        }}>
        <View style={[styles.input, { borderColor }]}>
          <Svg
            width="13"
            height="17"
            viewBox="0 0 13 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <Path
              d="M6.15877 16.3022C1.6182 9.71972 0.775391 9.04416 0.775391 6.625C0.775391 3.31128 3.46167 0.625 6.77539 0.625C10.0891 0.625 12.7754 3.31128 12.7754 6.625C12.7754 9.04416 11.9326 9.71972 7.39202 16.3022C7.09405 16.7326 6.4567 16.7326 6.15877 16.3022ZM6.77539 9.125C8.15611 9.125 9.27539 8.00572 9.27539 6.625C9.27539 5.24428 8.15611 4.125 6.77539 4.125C5.39467 4.125 4.27539 5.24428 4.27539 6.625C4.27539 8.00572 5.39467 9.125 6.77539 9.125Z"
              fill={fill}
            />
          </Svg>
          <Text fontSize={'md'} numberOfLines={1}>
            {props.defaultValue?.streetAddress}
          </Text>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
}

export default withTranslation()(RestaurantSearch);
