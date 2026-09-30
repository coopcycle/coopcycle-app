import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import {
  useIconColor,
} from '../styles/theme';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import FAIcon from './Icon';
import LinkifiedText from './LinkifiedText';

export interface IconTextProps {
  iconName: string;
  label?: string | null | undefined;
  text: string;
  iconColor?: string;
  iconSize?: number;
  textSize?: number;
  gap?: number;
  onPress?: () => void;
  /* turn urls, emails & phone numbers found in `text` into tappable links */
  linkify?: boolean;
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
  linkify = false,
  disabled = false,
  testID,
}) => {
  const defaultIconColor = useIconColor();
  const content = (
    <HStack style={[styles.container, { opacity: disabled ? 0.5 : 1 }]}>
      <FAIcon
        name={iconName}
        color={iconColor || defaultIconColor}
        size={iconSize}
        style={{ paddingTop: 4 }}
      />
      <Box style={{ flexDirection: 'column', flex: 1 }}>
        {label && (
          <Text
            size="sm"
            className="text-black dark:text-white"
            style={{
              lineHeight: 22,
              textTransform: 'uppercase',
              fontWeight: 500,
            }}>
            {label}
          </Text>
        )}
        {linkify ? (
          <LinkifiedText
            size={textSize}
            className="text-typography-950"
            style={{ lineHeight: 22 }}>
            {text}
          </LinkifiedText>
        ) : (
          <Text
            size={textSize}
            className="text-typography-950"
            style={{ lineHeight: 22 }}>
            {text}
          </Text>
        )}
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
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  touchable: {
    flex: 1,
  },
});

export default IconText;
