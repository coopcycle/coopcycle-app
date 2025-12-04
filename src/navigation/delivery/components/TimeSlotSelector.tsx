import { ChevronDownIcon } from '@/components/ui/icon';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from '@/components/ui/select';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  useBackgroundHighlightColor,
} from '../../../styles/theme';
import { TimeSlot, TimeSlotChoice, Uri } from '@/src/redux/api/types';

const styles = StyleSheet.create({
  label: {
    marginBottom: 5,
    fontWeight: '600',
  },
  formGroup: {
    marginBottom: 10,
  },
  buttonWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    alignItems: 'stretch',
    marginBottom: 10,
  },
  button: {
    flex: 1,
    borderWidth: 1,
  },
  errorText: {
    color: 'red',
  },
});

type Props = {
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  setFieldValue: (field: string, value) => void;
  setFieldTouched: (field: string, value: boolean) => void;
  timeSlots: TimeSlot[];
  choices: TimeSlotChoice[];
  selectedTimeSlot: Uri;
  setSelectedTimeSlot: (timeSlot: TimeSlot) => void;
  selectValue: string;
  setSelectValue: (value: string) => void;
  onTimeSlotChoiceChange: (choice: string, timeSlot: Uri) => void;
  testID?: string;
}

export default function TimeSlotSelector({
  errors,
  touched,
  setFieldValue,
  setFieldTouched,
  timeSlots,
  choices,
  selectedTimeSlot,
  setSelectedTimeSlot,
  selectValue,
  setSelectValue,
  onTimeSlotChoiceChange,
  testID = "time-slot-selector",
} : Props) {
  const { t } = useTranslation();
  const backgroundHighlightColor = useBackgroundHighlightColor();

  const onTimeSlotPress = (timeSlot: TimeSlot) => {
    setSelectedTimeSlot(timeSlot);

    if (onTimeSlotChoiceChange) {
      onTimeSlotChoiceChange(null, timeSlot['@id']);
    }
  };

  const onTimeSlotChoiceValueChange = (value: string) => {
    if (!value) return;

    setSelectValue(value);

    if (onTimeSlotChoiceChange) {
      onTimeSlotChoiceChange(value, selectedTimeSlot);
    }
  };

  return (
    <View style={[styles.formGroup]} testID={testID}>
      <Text style={styles.label} testID={`${testID}-label`}>
        {t('STORE_NEW_DELIVERY_TIME_SLOT')}
      </Text>

      <View style={styles.buttonWrapper} testID={`${testID}-buttons-container`}>
        {timeSlots && timeSlots.map((timeSlot, index) => {
          const isSelected = selectedTimeSlot === timeSlot['@id'];
          return (
            <Button
              onPress={() => onTimeSlotPress(timeSlot)}
              style={[
                {
                  borderColor: isSelected
                    ? 'transparent'
                    : backgroundHighlightColor,
                },
                styles.button,
                !isSelected && {
                  backgroundColor: 'transparent',
                },
              ]}
              key={index}
              testID={`${testID}-button-${index}`}
            >
              <ButtonText
                numberOfLines={1}
                style={{
                  color: isSelected
                    ? backgroundHighlightColor
                    : '#878787',
                }}
                testID={`${testID}-button-text-${index}`}
              >
                {timeSlot.name}
              </ButtonText>
            </Button>
          );
        })}
      </View>

      <Select
        selectedValue={selectValue}
        onValueChange={onTimeSlotChoiceValueChange}
        testID={`${testID}-dropdown`}
      >
        <SelectTrigger
          variant="outline"
          size="md"
          testID={`${testID}-trigger`}
        >
          <SelectInput
            placeholder={t('STORE_NEW_DELIVERY_SELECT_TIME_SLOT')}
            testID={`${testID}-input`}
          />
          <SelectIcon
            className="mr-3"
            as={ChevronDownIcon}
            testID={`${testID}-icon`}
          />
        </SelectTrigger>
        <SelectPortal>
          <SelectBackdrop
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            testID={`${testID}-backdrop`}
          />
          <SelectContent testID={`${testID}-content`}>
            <SelectDragIndicatorWrapper testID={`${testID}-drag-indicator-wrapper`}>
              <SelectDragIndicator testID={`${testID}-drag-indicator`} />
            </SelectDragIndicatorWrapper>
            <ScrollView
              style={{ maxHeight: 350 }}
              showsVerticalScrollIndicator={true}
              testID={`${testID}-options-scrollview`}
            >
              {choices && choices.map((choice, index) => (
                <SelectItem
                  key={index}
                  value={choice.value}
                  label={choice.label}
                  testID={`${testID}-option-${choice.value}`}
                />
              ))}
            </ScrollView>
          </SelectContent>
        </SelectPortal>
      </Select>

      {errors.timeSlot && touched.timeSlot && (
        <Text note style={styles.errorText} testID={`${testID}-error`}>
          {errors.timeSlot}
        </Text>
      )}
    </View>
  );
}
