import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useBackgroundHighlightColor } from '../../../styles/theme';
import { BaseTimeSlotFields, StoreTimeSlot } from '@/src/redux/api/types';
import { TimeSlotChoiceSelect } from '@/src/navigation/delivery/components/TimeSlotChoiceSelect';
import { useGetTimeSlotChoicesQuery } from '@/src/redux/api/slice';

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
  timeSlots: StoreTimeSlot[];
  testID?: string;
};

export default function TimeSlotPicker({
  timeSlots,
  testID = 'time-slot-selector',
}: Props) {
  const { t } = useTranslation();

  const backgroundHighlightColor = useBackgroundHighlightColor();

  const { values, touched, errors, setFieldValue, setFieldTouched } =
    useFormikContext<BaseTimeSlotFields>();

  const { data: timeSlotChoices } = useGetTimeSlotChoicesQuery(
    values.timeSlotUrl,
    {
      skip: !values.timeSlotUrl,
    },
  );

  const onTimeSlotPress = (timeSlot: StoreTimeSlot) => {
    setFieldValue('timeSlotUrl', timeSlot['@id']);
    setFieldTouched('timeSlotUrl');
  };

  const onTimeSlotChoiceValueChange = (value: string) => {
    if (!value) return;

    setFieldValue('timeSlot', value);
    setFieldTouched('timeSlot');
  };

  return (
    <View style={[styles.formGroup]} testID={testID}>
      <Text style={styles.label} testID={`${testID}-label`}>
        {t('STORE_NEW_DELIVERY_TIME_SLOT')}
      </Text>

      <View style={styles.buttonWrapper} testID={`${testID}-buttons-container`}>
        {timeSlots &&
          timeSlots.map((timeSlot, index) => {
            const isSelected = values.timeSlotUrl === timeSlot['@id'];
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
                    color: isSelected ? backgroundHighlightColor : '#878787',
                  }}
                  testID={`${testID}-button-text-${index}`}
                >
                  {timeSlot.name}
                </ButtonText>
              </Button>
            );
          })}
      </View>

      {timeSlotChoices ? (
        <TimeSlotChoiceSelect
          choices={timeSlotChoices.choices}
          selectedChoice={values.timeSlot}
          onChoiceChange={onTimeSlotChoiceValueChange}
          testID={testID}
        />
      ) : null}

      {errors.timeSlot && touched.timeSlot && (
        <Text note style={styles.errorText} testID={`${testID}-error`}>
          {errors.timeSlot}
        </Text>
      )}
    </View>
  );
}
