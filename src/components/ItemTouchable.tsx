import { TouchableHighlight, useColorScheme } from "react-native";

export const ItemTouchable = ({ children, style, ...otherProps }) => {
  const colorScheme = useColorScheme();

  return (
    <TouchableHighlight
      style={{
        backgroundColor: colorScheme === 'dark' ? 'black' : 'white',
        ...style,
      }}
      {...otherProps}>
      {children}
    </TouchableHighlight>
  );
};
