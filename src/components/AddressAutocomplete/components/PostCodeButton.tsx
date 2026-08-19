import { Icon, CloseIcon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import React from 'react';
import { TouchableOpacity } from 'react-native';

import { useColorModeValue } from '../../../styles/theme';

export default function PostCodeButton({ postcode, onPress }) {
  const backgroundColor = useColorModeValue('#E4E4E7', '#3F3F46');
  const color = useColorModeValue('#18181B', '#FAFAFA');

  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 6,
        paddingVertical: 4,
        position: 'absolute',
        right: 6,
        top: 6,
        bottom: 6,
        backgroundColor,
        borderRadius: 999,
      }}
      onPress={onPress}>
      <Text
        style={{
          marginRight: 4,
          fontWeight: '700',
          fontSize: 13,
          color,
          fontFamily: 'RobotoMono-Regular',
        }}>
        {postcode}
      </Text>
      <Icon as={CloseIcon} size="sm" style={{ color }} />
    </TouchableOpacity>
  );
}
