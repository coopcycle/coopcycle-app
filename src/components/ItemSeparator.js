import React from 'react';
import { StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
  itemSeparator: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
    backgroundColor: '#CCCCCC',
  },
});

export default () => <View style={styles.itemSeparator} />;
