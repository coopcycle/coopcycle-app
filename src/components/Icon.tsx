import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { StyleProp, ViewStyle } from 'react-native';
import { useIconColor } from '../styles/theme';

export interface IconProps {
  name: string; // Icon name
  color?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
  useFontAwesome?: boolean; // If true, uses FontAwesome, otherwise FontAwesome5 (default)
  testID?: string;
}

const FAIcon: React.FC<IconProps> = ({
  name,
  color,
  size,
  style,
  useFontAwesome = false,
  ...rest
}) => {
  const IconComponent = useFontAwesome ? FontAwesome : FontAwesome5;
  const defaultIconColor = useIconColor();

  return (
    <IconComponent
      name={name}
      color={color || defaultIconColor}
      size={size}
      style={style}
      {...rest}
    />
  );
};

export default FAIcon;
