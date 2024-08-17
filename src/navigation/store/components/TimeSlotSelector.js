import { IconChevronDown } from '@tabler/icons-react-native';
import { Button, Text, View } from 'native-base';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import {
  useBackgroundColor,
  useBackgroundContainerColor,
  useBackgroundHighlightColor,
  useBaseTextColor,
  usePrimaryColor,
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
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
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

const selectStyles = {
  borderWidth: 1,
  borderRadius: 4,
  paddingRight: 30,
  paddingVertical: 12,
  paddingHorizontal: 10,
  fontSize: 16,
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    ...selectStyles,
  },
  inputAndroid: {
    ...selectStyles,
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
}) {
  const { t } = useTranslation();
  const primaryColor = usePrimaryColor();
  const backgroundContainerColor = useBackgroundContainerColor();
  const backgroundColor = useBackgroundColor();
  const backgroundHighlightColor = useBackgroundHighlightColor();
  const textColor = useBaseTextColor();

  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.formGroup]}>
      <Text style={styles.label}>{t('STORE_NEW_DELIVERY_TIME_SLOT')}</Text>
      <View style={styles.buttonWrapper}>
        {timeSlots.map((timeSlot, index) => {
          return (
            <Button
              onPress={() => updateSelectedTimeSlot(timeSlot)}
              style={[
                {
                  borderColor:
                    selectedTimeSlot === timeSlot.name
                      ? 'transparent'
                      : backgroundHighlightColor,
                },
                styles.button,
                !(selectedTimeSlot === timeSlot.name) && {
                  backgroundColor: 'transparent',
                },
              ]}
              key={index}>
              <Text
                numberOfLines={1}
                style={{
                  color:
                    selectedTimeSlot === timeSlot.name ? 'white' : '#878787',
                }}>
                {timeSlot.name}
              </Text>
            </Button>
          );
        })}
      </View>
      <RNPickerSelect
        style={{
          ...pickerSelectStyles,
          inputIOS: {
            ...pickerSelectStyles.inputIOS,
            backgroundColor: backgroundContainerColor,
            borderColor: isFocused ? primaryColor : backgroundHighlightColor,
            color: textColor,
          },
          inputAndroid: {
            ...pickerSelectStyles.inputAndroid,
            backgroundColor: backgroundContainerColor,
            borderColor: isFocused ? primaryColor : backgroundHighlightColor,
            color: textColor,
          },
          iconContainer: {
            top: 12,
            right: 12,
          },
        }}
        Icon={() => {
          return <IconChevronDown color={'gray'} />;
        }}
        onValueChange={value => {
          if (!value) return;
          setFieldValue('timeSlot', value.key);
          setFieldTouched('timeSlot');
          setSelectValue(value);
        }}
        onOpen={() => setIsFocused(true)}
        onClose={() => setIsFocused(false)}
        items={choices.map(
          choice => (choice = { value: choice.value, label: choice.label }),
        )}
        placeholder={{
          label: t('STORE_NEW_DELIVERY_SELECT_TIME_SLOT'),
          value: null,
        }}
        value={selectValue}
      />
      {errors.timeSlot && touched.timeSlot && (
        <Text note style={styles.errorText}>
          {errors.timeSlot}
        </Text>
      )}
    </View>
  );
}
