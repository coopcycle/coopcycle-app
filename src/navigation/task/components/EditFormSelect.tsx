import { Select, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectIcon, SelectInput, SelectItem, SelectPortal, SelectTrigger } from '@/components/ui/select';
import { ScrollView } from 'react-native';
import i18n from '@/src/i18n';
import { ChevronDownIcon } from '@/components/ui/icon';
import { FormControlLabel, FormControlLabelText } from '@/components/ui/form-control';
import { useMemo } from 'react';

interface EditFormSelectProps {
  label: string;
  defaultValue: string;
  values: string[];
  handler?: (value: string) => void;
}

export const EditFormSelect: React.FC<EditFormSelectProps> = ({
  label,
  defaultValue,
  values,
  handler,
}) => {
  const { t } = i18n;
  const vals = useMemo(() => {
    return values.map((value, index) => (
      <SelectItem key={index} value={value} label={value} />
    ));
  }, [values]);

  return (
    <>
      {label && <FormControlLabel style={{ marginTop: 8 }}>
        <FormControlLabelText>{t(label)}</FormControlLabelText>
      </FormControlLabel>}
      <Select
        selectedValue={defaultValue}
        onValueChange={handler}>
        <SelectTrigger variant="outline" size="md" className="justify-between">
          <SelectInput
            value={defaultValue}
          />
          <SelectIcon className="mr-3" as={ChevronDownIcon} />
        </SelectTrigger>
        <SelectPortal>
          <SelectBackdrop style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} />
          <SelectContent>
            <SelectDragIndicatorWrapper>
              <SelectDragIndicator />
            </SelectDragIndicatorWrapper>
            <ScrollView
              style={{ maxHeight: 350 }}
              showsVerticalScrollIndicator={true}>
              <SelectItem
                label={`-- ${t('SELECT_FAILURE_REASON')} --`}
                value={null}
              />
              {vals}
            </ScrollView>
          </SelectContent>
        </SelectPortal>
      </Select>
    </>
  );
};
