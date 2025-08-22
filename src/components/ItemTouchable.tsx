import { useTheme } from "native-base";
import { TouchableHighlight, useColorScheme } from "react-native";

export const ItemTouchable = ({ children, style, ...otherProps }) => {
  const colorScheme = useColorScheme();
  const { colors } = useTheme();

  return (
    <TouchableHighlight
      style={{
        backgroundColor: colorScheme === 'dark' ? 'black' : 'white',
        ...style,
      }}
      underlayColor={
        colorScheme === 'dark' ? colors.gray['700'] : colors.gray['200']
      }
      {...otherProps}>
      {children}
    </TouchableHighlight>
  );
};