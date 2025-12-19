import React from 'react';
import { StyleSheet } from 'react-native';
import { Text } from '@/components/ui/text';

type Props = {
  text: string;
};

export const SectionTitleText = ({ text }: Props) => {
  return (
    <Text className="text-typography-950" style={styles.text}>
      {text}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontWeight: 'bold',
    fontSize: 20,
  },
});
