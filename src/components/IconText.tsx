import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { HStack, Icon, Text } from './gluestack';
import { Text as GluestackText } from '@gluestack-ui/themed';

type TextSizeType = React.ComponentProps<typeof GluestackText>['size'];

export interface IconTextProps {
  iconName: string;
  text: string;
  iconColor?: string;
  iconSize?: number;
  textSize?: TextSizeType;
  gap?: number;
  onPress?: () => void;
  disabled?: boolean;
  testID?: string;
}

const IconText: React.FC<IconTextProps> = ({
  iconName,
  text,
  iconColor,
  iconSize = 16,
  textSize = 'lg',
  onPress,
  disabled = false,
  testID,
}) => {
  const content = (
    <HStack
      alignItems="flex-start"
      space="md"
      style={[styles.container]}
      opacity={disabled ? 0.5 : 1}>
      <Icon
        name={iconName}
        color={iconColor}
        size={iconSize}
        style={{ paddingTop: 2 }}
      />
      <Text
        flex={1}
        size={textSize}
        style={{ lineHeight: parseInt(textSize, 10) - 10 }}
        ellipsizeMode="tail">
        {text}
      </Text>
    </HStack>
  );

  if (onPress && !disabled) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        testID={testID}
        style={styles.touchable}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    minHeight: 24,
  },
  touchable: {
    flex: 1,
  },
});

export default IconText;
