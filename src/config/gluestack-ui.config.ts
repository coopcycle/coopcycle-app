import { config } from '@gluestack-ui/config';
import { createConfig } from '@gluestack-style/react';
import {
  blackColor,
  blueColor,
  darkGreyColor,
  darkRedColor,
  fontTitleName,
  greenColor,
  greyColor,
  headerFontSize,
  lightGreyColor,
  mediumGreyColor,
  orangeColor,
  primaryColor,
  redColor,
  whiteColor,
  yellowColor,
} from '../styles/common';

const customColors = {
  // from common.ts
  primary: primaryColor, // '#e4022d'
  white: whiteColor, // '#fff'
  black: blackColor, // '#000'
  blue: blueColor, // '#3498DB'
  green: greenColor, // '#2ECC71'
  red: redColor, // '#E74C3C'
  yellow: yellowColor, // '#F1C40F'
  orange: orangeColor, // '#d35400'
  darkRed: darkRedColor, // '#7D0A0A'

  // Grey scale
  grey: greyColor, // '#95A5A6'
  lightGrey: lightGreyColor, // '#D0D0D0'
  mediumGrey: mediumGreyColor, // '#D5D1D3'
  darkGrey: darkGreyColor, // '#424242'

  // Semantic colors
  success: greenColor, // '#2ECC71'
  error: redColor, // '#E74C3C'
  warning: orangeColor, // '#d35400'
  info: blueColor, // '#3498DB'

  // Background colors
  background: whiteColor, // '#fff'
  backgroundDark: '#201E1E', // Dark mode background
  backgroundHighlight: '#f2f2f2',
  backgroundHighlightDark: '#353030',

  // Text colors
  text: blackColor, // '#000'
  textLight: whiteColor, // '#fff'
  textSecondary: greyColor, // '#95A5A6'
  textMuted: lightGreyColor, // '#D0D0D0'
};

const customFonts = {
  heading: 'Roboto_medium',
  body: 'Roboto',
  title: fontTitleName, // 'Raleway-Regular' from common.ts
};

const customFontSizes = {
  xs: 12,
  sm: 13,
  md: 14,
  lg: 15,
  xl: 16,
  '2xl': headerFontSize, // 18 from common.ts
  '3xl': 20,
  '4xl': 24,
  '5xl': 28,
  '6xl': 32,
};

// Basic spacing system
const customSpace = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
};

// Basic border radius
const customRadii = {
  none: 0,
  sm: 2,
  md: 4,
  lg: 8,
  xl: 12,
  full: 9999,
};

export const gluestackConfig = createConfig({
  ...config,
  tokens: {
    ...config.tokens,
    colors: {
      ...config.tokens.colors,
      ...customColors,
    },
    fonts: {
      ...config.tokens.fonts,
      ...customFonts,
    },
    fontSizes: {
      ...config.tokens.fontSizes,
      ...customFontSizes,
    },
    space: {
      ...config.tokens.space,
      ...customSpace,
    },
    radii: {
      ...config.tokens.radii,
      ...customRadii,
    },
  },
});
