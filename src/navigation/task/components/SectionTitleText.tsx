import React from 'react';
import { StyleSheet } from 'react-native';
import { Text } from '@/components/ui/text';
import { useBaseTextColor } from '@/src/styles/theme';

type Props = {
  text: string;
};

export const SectionTitleText = ({ text }: Props) => {
  const textColor = useBaseTextColor();

  return <Text style={[styles.text, { color: textColor }]}>{text}</Text>;
};

const styles = StyleSheet.create({
  text: {
    fontWeight: 'bold',
    fontSize: 20,
  },
});
