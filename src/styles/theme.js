import {
  extendTheme,
  useColorModeValue,
  useTheme,
  v33xTheme,
} from 'native-base'

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
})

export const useBaseTextColor = () => {
  const { colors } = useTheme()
  return useColorModeValue(colors.darkText, colors.lightText)
}
