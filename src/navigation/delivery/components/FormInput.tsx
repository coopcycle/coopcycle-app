import { Input, InputField } from '@/components/ui/input';

export default function FormInput({ style, ...props }) {

  return (
    <Input>
      <InputField
        {...props}
        style={ style }
      />
    </Input>
  );
}
