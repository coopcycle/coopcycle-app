import { Input, InputField } from '@/components/ui/input';
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
    <Input>
      <InputField
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
    </Input>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    paddingHorizontal: 10,
    borderWidth: 0,
  },
});
