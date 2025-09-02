import { Icon, AddIcon } from '@/components/ui/icon';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
});

export default ({ children, ...props }) => {
  return (
    <TouchableOpacity iconLeft full {...props} style={styles.container}>
      {children}
      <Icon as={AddIcon} name="plus" size="xl" />
    </TouchableOpacity>
  );
};
