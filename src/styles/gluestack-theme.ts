import { useColorMode } from '@gluestack-style/react';
import { primaryColor } from './common';

const useColorModeValue = <T>(lightValue: T, darkValue: T): T => {
  const colorMode = useColorMode();
  return colorMode === 'dark' ? darkValue : lightValue;
};

export const usePrimaryColor = () => {
  return useColorModeValue(primaryColor, '#ff1744');
};

export const useBlackAndWhiteTextColor = () => {
  return useColorModeValue('#000000', '#FFFFFF');
};

export const useBaseTextColor = () => {
  return useColorModeValue('#202124', '#ffffffdf');
};

export const useSecondaryTextColor = () => {
  return useColorModeValue('#95A5A6', '#B0BEC5');
};

// Background container color - for cards, modals (as used on NativeBase)
export const useBackgroundContainerColor = () => {
  return useColorModeValue('#FFFFFF', '#201E1E');
};

// Background highlight color (as used on NativeBase)
export const useBackgroundHighlightColor = () => {
  return useColorModeValue('#f2f2f2', '#353030');
};

// (as used on NativeBase)
export const useSolidButtonTextColor = () => {
  return useColorModeValue('#FFFFFF', '#FFFFFF');
};

// IconText component
export const useIconColor = () => {
  return useColorModeValue('#424242', '#B0BEC5');
};
