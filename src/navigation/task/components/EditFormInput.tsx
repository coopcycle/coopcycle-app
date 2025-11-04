import {
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
} from '@/components/ui/form-control';
import { Input, InputField } from '@/components/ui/input';
import i18n from '@/src/i18n';

interface EditFormInputProps {
  label: string;
  value: string;
  inputType?: 'text' | 'password';
  handler?: (value: string) => void;
}

export const EditFormInput: React.FC<EditFormInputProps> = ({
  label,
  value,
  handler,
  inputType = 'text'
}) => {
  const { t } = i18n;

  return (
    <>
      <FormControlLabel style={{ marginTop: 8 }}>
        <FormControlLabelText>{t(label)}</FormControlLabelText>
      </FormControlLabel>
      <Input>
        <InputField value={value} onChangeText={handler} type={inputType} />
      </Input>
    </>
  );
};
