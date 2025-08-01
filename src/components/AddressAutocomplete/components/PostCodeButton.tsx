import { Icon, Text } from 'native-base';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import 'react-native-get-random-values';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export default function PostCodeButton({ postcode, onPress }) {
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        paddingVertical: 5,
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: '#0984e3',
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
      }}
      onPress={onPress}>
      <Text
        style={{
          marginRight: 10,
          fontWeight: '700',
          fontSize: 16,
          color: 'white',
          fontFamily: 'RobotoMono-Regular',
        }}>
        {postcode}
      </Text>
      <Icon
        as={FontAwesome5}
        name="times"
        style={{ fontSize: 18, color: 'white' }}
      />
    </TouchableOpacity>
  );
}
