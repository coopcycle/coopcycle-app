import { Button, Text, View } from 'native-base';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet } from 'react-native';
import ModalSelector from 'react-native-modal-selector';
import { usePrimaryColor } from '../../../styles/theme';

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
                    : primaryColor,
                borderWidth: 1,
              }}
              key={index}>
              <Text
                style={{
                  color:
                    selectedTimeSlot === timeSlot.name ? 'white' : primaryColor,
                }}>
                {timeSlot.name}
              </Text>
            </Button>
          );
        })}
      </View>
      <ModalSelector
        data={choices}
        cancelText={t('CANCEL')}
        initValue={t('STORE_NEW_DELIVERY_SELECT_TIME_SLOT')}
        accessible={true}
        // Bug on Android
        // The component thinks it's a long press while it's a short press
        enableLongPress={Platform.OS === 'android'}
        onChange={value => {
          setFieldValue('timeSlot', value.key);
          setFieldTouched('timeSlot');
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
