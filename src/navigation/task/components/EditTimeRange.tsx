import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  Radio,
  RadioGroup,
  RadioIcon,
  RadioIndicator,
  RadioLabel,
} from '@/components/ui/radio';
import { CircleIcon } from '@/components/ui/icon';
import { DateTimePicker } from '@/src/navigation/delivery/components/DateTimePicker';
import TimeSlotPicker from '@/src/navigation/delivery/components/TimeSlotPicker';
import { StoreTimeSlot } from '@/src/redux/api/types';
import { VStack } from '@/components/ui/vstack';
import { useFormikContext } from 'formik';
import { BaseTimeRangeFields } from '@/src/navigation/delivery/utils';

type Props = {
  hasTimeSlot: boolean;
  timeSlots: StoreTimeSlot[];
  initialValues: BaseTimeRangeFields;
};

export const EditTimeRange = ({
  hasTimeSlot,
  timeSlots,
  initialValues,
}: Props) => {
  const { t } = useTranslation();

  const [timeRangeMode, setTimeRangeMode] = useState(
    'datetime' as 'datetime' | 'timeslot',
  );

  const { setFieldValue, setFieldTouched } =
    useFormikContext<BaseTimeRangeFields>();

  const onTimeRangeModeChange = (mode: 'datetime' | 'timeslot') => {
    setTimeRangeMode(mode);

    switch (mode) {
      case 'datetime':
        setFieldValue('timeSlotUrl', null);
        setFieldTouched('timeSlotUrl');

        setFieldValue('timeSlot', null);
        setFieldTouched('timeSlot');

        break;
      case 'timeslot':
        setFieldValue('after', null);
        setFieldTouched('after');

        setFieldValue('before', null);
        setFieldTouched('before');

        break;
    }
  };

  return (
    <View style={styles.container}>
      {hasTimeSlot ? (
        <RadioGroup value={timeRangeMode} onChange={onTimeRangeModeChange}>
          <VStack space="sm">
            <Radio
              value="datetime"
              size="md"
              isInvalid={false}
              isDisabled={false}
            >
              <RadioIndicator>
                <RadioIcon as={CircleIcon} />
              </RadioIndicator>
              <RadioLabel>
                {t('STORE_NEW_DELIVERY_TIME_SLOT_CUSTOM')}
              </RadioLabel>
            </Radio>
            {timeRangeMode === 'datetime' ? (
              <DateTimePicker initialValues={initialValues} />
            ) : null}
            <Radio
              value="timeslot"
              size="md"
              isInvalid={false}
              isDisabled={false}
            >
              <RadioIndicator>
                <RadioIcon as={CircleIcon} />
              </RadioIndicator>
              <RadioLabel>
                {t('STORE_NEW_DELIVERY_TIME_SLOT_PREDEFINED')}
              </RadioLabel>
            </Radio>
            {timeRangeMode === 'timeslot' ? (
              <TimeSlotPicker timeSlots={timeSlots} />
            ) : null}
          </VStack>
        </RadioGroup>
      ) : (
        <DateTimePicker initialValues={initialValues} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
});
