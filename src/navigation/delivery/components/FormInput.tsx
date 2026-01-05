import { ComponentPropsWithoutRef } from 'react';
import { StyleProp, TextStyle } from 'react-native';
import { Input, InputField } from '@/components/ui/input';

type Props = ComponentPropsWithoutRef<typeof InputField> & {
  style?: StyleProp<TextStyle>;
  isDisabled?: boolean;
};

export default function FormInput({
  style,
  isDisabled = false,
  ...props
}: Props) {
  return (
    <Input isDisabled={isDisabled}>
      <InputField {...props} style={style} />
    </Input>
  );
}
