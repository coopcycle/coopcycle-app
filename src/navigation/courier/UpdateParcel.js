import React, { useState, useEffect } from 'react';

import {
  Input,
  FormControl,
  KeyboardAvoidingView,
  HStack,
  VStack,
  Divider,
  Select,
  Heading,
  View,
} from 'native-base';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { formatDateRange } from 'little-date';

function UpdateParcel({ route: { params }, t, navigation }) {
  const { entity } = params;

  const [showAfterDatePicker, setShowAfterDatePicker] = useState(false);
  const [showBeforeDatePicker, setShowBeforeDatePicker] = useState(false);

  const [afterDate, setAfterDate] = useState(
    new Date(params?.after ?? entity?.after),
  );
  const [beforeDate, setBeforeDate] = useState(
    new Date(params?.before ?? entity?.before),
  );

  useEffect(() => {
    if (params?.selectRange) {
      const [after, before] = params?.selectRange;
      setAfterDate(new Date(after));
      setBeforeDate(new Date(before));
    }
  }, [params?.selectRange]);

  if (showAfterDatePicker) {
    const onConfirm = date => {
      setAfterDate(date);
      setShowAfterDatePicker(false);
      setShowBeforeDatePicker(true);
    };
    return (
      <View alignItems={'center'} p="4">
        <Heading>{t('TASK_FORM_DONE_AFTER_LABEL')}</Heading>
        <DateTimePicker
          mode="datetime"
          isVisible={showAfterDatePicker}
          minimumDate={new Date()}
          onConfirm={onConfirm}
          onCancel={() => setShowAfterDatePicker(false)}
        />
      </View>
    );
  }

  if (showBeforeDatePicker) {
    const onConfirm = date => {
      setBeforeDate(date);
      setShowBeforeDatePicker(false);
    };
    return (
      <View alignItems={'center'} p="4">
        <Heading>{t('TASK_FORM_DONE_BEFORE_LABEL')}</Heading>
        <DateTimePicker
          mode="datetime"
          isVisible={showBeforeDatePicker}
          minimumDate={afterDate}
          onConfirm={onConfirm}
          onCancel={() => setShowBeforeDatePicker(false)}
        />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView p="4">
      <FormControl>
        <FormControl.Label>Address</FormControl.Label>
        <Input value={entity?.address?.streetAddress} />
        <HStack space={4} py="4" justifyContent="space-between">
          <VStack width={'40%'}>
            <FormControl.Label>Weight</FormControl.Label>
            <Input value={entity?.weight / 1000 + ''} />
            <FormControl.Label>Volume</FormControl.Label>
            <Input />
          </VStack>
          <Divider orientation="vertical" />
          <VStack width={'40%'} alignSelf={'center'}>
            <FormControl.Label>Package</FormControl.Label>
            <Select>
              <Select.Item label="Package 1" value="1" />
              <Select.Item label="Package 2" value="2" />
              <Select.Item label="Package 3" value="3" />
            </Select>
          </VStack>
        </HStack>
        <Divider my="8" />
        <FormControl.Label>New appointment</FormControl.Label>
        <Input
          onPressIn={() =>
            navigation.navigate('CourierSelectRange', {
              after: entity?.after,
              before: entity?.before,
              navigateTo: 'CourierUpdateParcel',
            })
          }
          value={formatDateRange(afterDate, beforeDate)}
        />
      </FormControl>
    </KeyboardAvoidingView>
  );
}

function mapStateToProps(state) {
  return {
    httpClient: state.app.httpClient,
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(UpdateParcel));
