import { Button, Text, View } from 'native-base';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { usePrimaryColor } from '../../../styles/theme';
import RNPickerSelect from 'react-native-picker-select';

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
}) {
  const { t } = useTranslation();
  const primaryColor = usePrimaryColor();

  return (
    <View style={[styles.formGroup]}>
      <Text style={styles.label}>{t('STORE_NEW_DELIVERY_TIME_SLOT')}</Text>
      <View style={styles.buttonWrapper}>
        {timeSlots.map((timeSlot, index) => {
          return (
            <Button
              onPress={() => updateSelectedTimeSlot(timeSlot)}
              style={{
                backgroundColor:
                  selectedTimeSlot === timeSlot.name
                    ? primaryColor
                    : 'transparent',
                borderColor:
                  selectedTimeSlot === timeSlot.name
                    ? 'transparent'
                    : '#878787',
                borderWidth: 1,
              }}
              key={index}>
              <Text
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
        style={pickerSelectStyles}
        onValueChange={value => {
          if (!value) return;
          setFieldValue('timeSlot', value.key);
          setFieldTouched('timeSlot');
        }}
        items={choices.map(
          choice => (choice = { value: choice.value, label: choice.label }),
        )}
        placeholder={{
          label: t('STORE_NEW_DELIVERY_SELECT_TIME_SLOT'),
          value: null,
        }}
      />
      {errors.timeSlot && touched.timeSlot && (
        <Text note style={styles.errorText}>
          {errors.timeSlot}
        </Text>
      )}
    </View>
  );
}

const selectStyles = {
  backgroundColor: '#FAFAFA',
  borderColor: '#E3E3E3',
  borderWidth: 1,
  borderRadius: 4,
  color: '#6B6B6B',
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
