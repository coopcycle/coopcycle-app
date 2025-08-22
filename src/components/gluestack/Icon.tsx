import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import { StyleProp, ViewStyle } from 'react-native';

export interface IconProps {
  name: string; // FontAwesome icon name
  color?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

const Icon: React.FC<IconProps> = ({ name, color, size, style, ...rest }) => {
  return (
    <FontAwesome
      name={name}
      color={color}
      size={size}
      style={style}
      {...rest}
    />
  );
};

export default Icon;
