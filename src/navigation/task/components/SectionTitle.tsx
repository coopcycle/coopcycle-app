import React from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
  children: React.ReactNode;
};

export const SectionTitle = ({ children }: Props) => {
  return <View style={styles.sectionTitle}>{children}</View>;
};

const styles = StyleSheet.create({
  sectionTitle: {
    marginTop: 12,
    marginBottom: 4,
  },
});
