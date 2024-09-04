import React, { useState } from 'react';
import { FormControl, Input, Button, ScrollView, View } from 'native-base';
import { withTranslation } from 'react-i18next';
import moment from 'moment';
import DateTimePicker from 'react-native-modal-datetime-picker';

import KeyboardAdjustView from '../../components/KeyboardAdjustView';

function SelectRange({ t, route, navigation }) {
  const { after, before, navigateTo } = route.params;
  const [afterDate, setAfterDate] = useState(moment(after));
  const [beforeDate, setBeforeDate] = useState(moment(before));

  const [showAfterDatePicker, setShowAfterDatePicker] = useState(false);
  const [showBeforeDatePicker, setShowBeforeDatePicker] = useState(false);

  const isAfterInvalid = afterDate?.isBefore(moment());
  const isBeforeInvalid = beforeDate?.isBefore(afterDate);

  return (
    <KeyboardAdjustView style={{flex: 1}} androidBehavior=''>
      <ScrollView p="4" >
      <FormControl isInvalid={isAfterInvalid}>
        <FormControl.Label>{t('TASK_FORM_DONE_AFTER_LABEL')}</FormControl.Label>
        <Input
          onTouchStart={() => setShowAfterDatePicker(true)}
          value={afterDate.format('ll LT')}
        />
      </FormControl>
      <FormControl isInvalid={isBeforeInvalid}>
        <FormControl.Label>
          {t('TASK_FORM_DONE_BEFORE_LABEL')}
        </FormControl.Label>
        <Input
          onTouchStart={() => setShowBeforeDatePicker(true)}
          value={beforeDate.format('ll LT')}
        />
      </FormControl>
      </ScrollView>
      <View p="4">
        <Button mt="4"
          onPress={() => {
            if (isAfterInvalid || isBeforeInvalid) {
              return;
            }

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
      </View>

      <DateTimePicker
        mode="datetime"
        isVisible={showAfterDatePicker}
        minimumDate={new Date()}
        minuteInterval={15}
        onConfirm={date => setAfterDate(moment(date))}
        onCancel={() => setShowAfterDatePicker(false)}
      />
      <DateTimePicker
        mode="datetime"
        isVisible={showBeforeDatePicker}
        minimumDate={afterDate.toDate()}
        minuteInterval={15}
        onConfirm={date => setBeforeDate(moment(date))}
        onCancel={() => setShowBeforeDatePicker(false)}
      />
    </KeyboardAdjustView>
  );
}

export default withTranslation()(SelectRange);
