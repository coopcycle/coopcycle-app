import React, { useState } from 'react';
import { FormControl, Input, KeyboardAvoidingView, Button } from 'native-base';
import { withTranslation } from 'react-i18next';
import moment from 'moment';
import DateTimePicker from 'react-native-modal-datetime-picker';

function SelectRange({ t, route, navigation }) {
  const { after, before, navigateTo } = route.params;
  const [afterDate, setAfterDate] = useState(moment(after));
  const [beforeDate, setBeforeDate] = useState(moment(before));

  const [showAfterDatePicker, setShowAfterDatePicker] = useState(false);
  const [showBeforeDatePicker, setShowBeforeDatePicker] = useState(false);

  return (
    <KeyboardAvoidingView p="4">
      <FormControl>
        <FormControl.Label>{t('TASK_FORM_DONE_AFTER_LABEL')}</FormControl.Label>
        <Input
          onPressIn={() => setShowAfterDatePicker(true)}
          value={afterDate.format('ll LT')}
        />
        <FormControl.Label>
          {t('TASK_FORM_DONE_BEFORE_LABEL')}
        </FormControl.Label>
        <Input
          onPressIn={() => setShowBeforeDatePicker(true)}
          value={beforeDate.format('ll LT')}
        />
        <Button
          onPress={() => {
            navigation.navigate({
              name: navigateTo,
              params: {
                selectRange: [afterDate.format(), beforeDate.format()],
              },
              merge: true,
            });
          }}>
          Reschedule
        </Button>
      </FormControl>

      <DateTimePicker
        mode="datetime"
        isVisible={showAfterDatePicker}
        minimumDate={new Date()}
        onConfirm={date => setAfterDate(moment(date))}
        onCancel={() => setShowAfterDatePicker(false)}
      />
      <DateTimePicker
        mode="datetime"
        isVisible={showBeforeDatePicker}
        minimumDate={afterDate.toDate()}
        onConfirm={date => setBeforeDate(moment(date))}
        onCancel={() => setShowBeforeDatePicker(false)}
      />
    </KeyboardAvoidingView>
  );
}

export default withTranslation()(SelectRange);
