import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { moment } from '@/src/shared';
import { Box } from 'lucide-react-native';
import i18n from '@/src/i18n';
import { StyleSheet, View } from 'react-native';
import { Button, ButtonText } from '@/components/ui/button';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useState } from 'react';

export const DateTimePicker = ({
  initialValues,
  values,
  errors,
  setFieldValue,
  setFieldTouched,
}) => {
  const { t } = i18n;
  const [isDateTimePickerVisible, setIsDateTimePickerVisible] = useState(false);

  function showDateTimePicker() {
    setIsDateTimePickerVisible(true);
  }

  function hideDateTimePicker() {
    setIsDateTimePickerVisible(false);
  }

  return (
    <View className="py-4">
      <HStack className="justify-between">
        <VStack>
          <Text style={styles.label}>
            {t('STORE_NEW_DELIVERY_DROPOFF_BEFORE')}
          </Text>
          <Text>{moment(values.before).format('LLL')}</Text>
        </VStack>
        <Button onPress={showDateTimePicker}>
          <ButtonText>{t('EDIT')}</ButtonText>
        </Button>
      </HStack>
      <DateTimePickerModal
        isVisible={isDateTimePickerVisible}
        mode="datetime"
        onConfirm={value => {
          setFieldValue('before', moment(value).format());
          setFieldTouched('before');
          hideDateTimePicker();
        }}
        onCancel={hideDateTimePicker}
        minimumDate={moment(initialValues.before).toDate()}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  label: {
    marginBottom: 8,
    fontWeight: '500',
  },
  formGroup: {
    marginBottom: 10,
  },
  errorText: {
    paddingVertical: 5,
    color: '#FF4136',
  },
  weightUnit: {
    paddingHorizontal: 10,
  },
  optional: {
    fontWeight: '400',
    opacity: 0.7,
    fontSize: 12,
  },
});
