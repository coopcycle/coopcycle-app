import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { StyleProp, ViewStyle } from 'react-native';

export interface IconProps {
  name: string; // Icon name
  color?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
  useFontAwesome?: boolean; // If true, uses FontAwesome, otherwise FontAwesome5 (default)
}

const Icon: React.FC<IconProps> = ({
  name,
  color,
  size,
  style,
  useFontAwesome = false,
  ...rest
}) => {
  const IconComponent = useFontAwesome ? FontAwesome : FontAwesome5;

  return (
    <IconComponent
      name={name}
      color={color}
      size={size}
      style={style}
      {...rest}
    />
  );
};

export default Icon;
