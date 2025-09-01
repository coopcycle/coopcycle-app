import { Text as GluestackText } from '@gluestack-ui/themed';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import {
  useBaseTextColor,
  useBlackAndWhiteTextColor,
  useIconColor,
} from '../styles/gluestack-theme';
import { Box, HStack, Icon, Text } from './gluestack';

type TextSizeType = React.ComponentProps<typeof GluestackText>['size'];

export interface IconTextProps {
  iconName: string;
  label?: string | null | undefined;
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
  label,
  iconColor,
  iconSize = 18,
  textSize = 'lg',
  onPress,
  disabled = false,
  testID,
}) => {
  // Theme colors
  const textColor = useBaseTextColor();
  const labelTextColor = useBlackAndWhiteTextColor();
  const defaultIconColor = useIconColor();
  const content = (
    <HStack
      alignItems="flex-start"
      space="md"
      style={[styles.container]}
      opacity={disabled ? 0.5 : 1}>
      <Icon
        name={iconName}
        color={iconColor || defaultIconColor}
        size={iconSize}
        style={{ paddingTop: 4 }}
      />
      <Box sx={{ flexDirection: 'column', flex: 1 }}>
        {label && (
          <Text
            size="sm"
            style={{
              lineHeight: 22,
              textTransform: 'uppercase',
              color: labelTextColor,
              fontWeight: 500,
            }}>
            {label}
          </Text>
        )}
        <Text
          size={textSize}
          style={{
            lineHeight: 22,
            color: textColor,
          }}>
          {text}
        </Text>
      </Box>
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
