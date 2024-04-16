import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import {
  extendTheme,
  useColorModeValue,
  useToken,
  v33xTheme,
} from 'native-base';

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

export const useBaseTextColor = () => {
  return useColorModeToken('text.900', 'text.50'); // default text component style; https://github.com/GeekyAnts/NativeBase/blob/master/src/theme/components/text.ts
};

export const useSecondaryTextColor = () => {
  return useColorModeToken('text.700', 'text.200');
};
