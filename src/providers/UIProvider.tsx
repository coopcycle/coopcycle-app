import React from 'react';
import { NativeBaseProvider } from 'native-base';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { gluestackConfig } from '../config/gluestack-ui.config';
import { nativeBaseTheme } from '../styles/theme';

interface UIProviderProps {
  children: React.ReactNode;
}
/**
 * Dual UI Provider for gradual migration from NativeBase to Gluestack
 * This allows both libraries to coexist
 */
export const UIProvider: React.FC<UIProviderProps> = ({ children }) => {
  return (
    <GluestackUIProvider config={gluestackConfig}>
      <NativeBaseProvider theme={nativeBaseTheme}>
        {children}
      </NativeBaseProvider>
    </GluestackUIProvider>
  );
};

export default UIProvider;
