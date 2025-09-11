import React from 'react';
import { useColorScheme } from 'react-native';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';

interface UIProviderProps {
  children: React.ReactNode;
}
/**
 * Dual UI Provider for gradual migration from NativeBase to Gluestack
 * This allows both libraries to coexist
 */
export const UIProvider: React.FC<UIProviderProps> = ({ children }) => {
  const colorScheme = useColorScheme();

  return (
    <GluestackUIProvider mode={colorScheme || 'light'}>
        {children}
    </GluestackUIProvider>
  );
};

export default UIProvider;
