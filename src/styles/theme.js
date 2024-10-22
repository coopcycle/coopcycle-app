import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import Color from 'colorjs.io';
import {
  extendTheme,
  useColorModeValue,
  useToken,
  v33xTheme,
} from 'native-base';
import { primaryColor } from './common';

// ideally we should get rid of the v33xTheme theme
// as it's not always correctly overrides the default theme
// making it harder to figure out where a certain style is coming from
export const nativeBaseTheme = extendTheme(v33xTheme, {
  config: {
    useSystemColorMode: true,
  },
  components: {
    Badge: {
      variants: {
        subtle: {
          bg: 'gray.200',
          _dark: {
            bg: 'gray.800',
          },
        },
      },
    },
  },
});

// resolve native-base token to a color value
// to be able to use it in non native-base components
const useColorModeToken = (lightModeToken, darkModeToken) => {
  const [lightModeColor, darkModeColor] = useToken('colors', [
    lightModeToken,
    darkModeToken,
  ]);

  return useColorModeValue(lightModeColor, darkModeColor);
};

export const useBackgroundColor = () => {
  return useColorModeValue(
    DefaultTheme.colors.background,
    DarkTheme.colors.background,
  );
};

function checkContrast(c, background, theme) {
  let color = new Color(c);
  let contrast = color.contrast(background, 'WCAG21');

  while (contrast < 4.5) {
    if (theme === 'dark') {
      color = color.lighten(0.1);
    } else {
      color = color.darken(0.1);
    }
    contrast = color.contrast(background, 'WCAG21');
    if (contrast >= 4.5) {
      break;
    }
  }

  return color.toString({ format: 'hex' });
}

const primaryLight = checkContrast(primaryColor, '#FFFFFF', 'light');
const primaryDark = checkContrast(primaryColor, '#201E1E', 'dark');

export const usePrimaryColor = () => {
  return useColorModeToken(primaryLight, primaryDark);
};

export const useBaseTextColor = () => {
  // default style: https://github.com/GeekyAnts/NativeBase/blob/master/src/theme/components/text.ts
  return useColorModeToken('text.900', 'text.50');
};

export const useSecondaryTextColor = () => {
  return useColorModeToken('text.600', 'text.400');
};

export const useBackgroundContainerColor = () => {
  return useColorModeToken('#FFFFFF', '#201E1E');
};

export const useBackgroundHighlightColor = () => {
  return useColorModeToken('#f2f2f2', '#353030');
};

export const useSolidButtonTextColor = () => {
  // default style: https://github.com/GeekyAnts/NativeBase/blob/master/src/theme/components/button.ts#L131
  return useColorModeToken('text.50', 'text.50');
};
