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

export default function TimeSlotSelector({
  errors,
  touched,
  setFieldValue,
  setFieldTouched,
  updateSelectedTimeSlot,
  timeSlots,
  choices,
  selectedTimeSlot,
  selectValue,
  setSelectValue,
  onTimeSlotChange,
}) {
  const { t } = useTranslation();
  const backgroundHighlightColor = useBackgroundHighlightColor();

const handleButtonPress = (timeSlot) => {
  updateSelectedTimeSlot(timeSlot);
  
  if (onTimeSlotChange) {
    onTimeSlotChange(null, timeSlot['@id']);
  }
};

const handleSelectChange = (value) => {
  if (!value) return;
  
  setSelectValue(value);
  
  if (onTimeSlotChange) {
    onTimeSlotChange(value, selectedTimeSlot);
  }
};


  return (
    <View style={[styles.formGroup]}>
      <Text style={styles.label}>{t('STORE_NEW_DELIVERY_TIME_SLOT')}</Text>
      <View style={styles.buttonWrapper}>
        {timeSlots && timeSlots.map((timeSlot, index) => {
          return (
            <Button
              onPress={() => handleButtonPress(timeSlot)}
              style={[
                {
                  borderColor:
                    selectedTimeSlot === timeSlot['@id']
                      ? 'transparent'
                      : backgroundHighlightColor,
                },
                styles.button,
                !(selectedTimeSlot === timeSlot['@id']) && {
                  backgroundColor: 'transparent',
                },
              ]}
              key={index}>
              <ButtonText
                numberOfLines={1}
                style={{
                  color:
                    selectedTimeSlot === timeSlot['@id']
                      ? backgroundHighlightColor
                      : '#878787',
                }}>
                {timeSlot.name}
              </ButtonText>
            </Button>
          );
        })}
      </View>
      <Select
        selectedValue={selectValue}
        onValueChange={handleSelectChange}
      >
        <SelectTrigger variant="outline" size="md">
          <SelectInput
            placeholder={t('STORE_NEW_DELIVERY_SELECT_TIME_SLOT')}
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
              {choices && choices.map((choice, index) => (
                <SelectItem
                  key={index}
                  value={choice.value}
                  label={choice.label}
                />
              ))}
            </ScrollView>
          </SelectContent>
        </SelectPortal>
      </Select>
      {errors.timeSlot && touched.timeSlot && (
        <Text note style={styles.errorText}>
          {errors.timeSlot}
        </Text>
      )}
    </View>
  );
}