import React from 'react';
import { StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
  itemSeparator: {
    height: 4,
    width: '100%',
  },
});

export default () => <View style={styles.itemSeparator} />;
