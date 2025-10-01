import { Icon, CloseIcon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import React from 'react';
import { TouchableOpacity } from 'react-native';

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
        as={CloseIcon}
        style={{ color: 'white' }}
      />
    </TouchableOpacity>
  );
}
