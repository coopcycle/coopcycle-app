import { Input } from 'native-base';
import {
  useBackgroundContainerColor,
  useBackgroundHighlightColor,
  usePrimaryColor,
} from '../../../styles/theme';
import { StyleSheet } from 'react-native';

export default function FormInput(props) {
  const backgroundColor = useBackgroundContainerColor();
  const primaryColor = usePrimaryColor();
  const borderColor = useBackgroundHighlightColor();

  return (
    <Input
      _stack={{ style: {} }}
      {...props}
      style={[
        styles.input,
        props.style,
        {
          borderColor,
          backgroundColor,
        },
      ]}
      _focus={{
        backgroundColor,
        borderColor: primaryColor,
      }}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    paddingHorizontal: 10,
    borderWidth: 0,
  },
});
