import React from 'react';
import { View, useColorScheme } from 'react-native';

export default ({ children, as }) => {
  const colorScheme = useColorScheme();

  const Component = as ? as : View;

  return (
    <Component
      style={{ backgroundColor: colorScheme === 'dark' ? 'black' : 'white' }}>
      {children}
    </Component>
  );
};
