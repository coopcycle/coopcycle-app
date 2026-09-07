import React, { useState } from 'react';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { moment } from '@/src/shared';
import { Box } from '@/components/ui/box';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { Textarea, TextareaInput } from '@/components/ui/textarea';
import { FormField } from '../task/components/FormField';
import { usePostHolidayRequestMutation } from '../../redux/api/slice';
import { showAlert } from '../../utils/alert';

type FormValues = {
  startDate: string;
  endDate: string;
  comment: string;
};

type Props = {
  navigation: NavigationProp<ParamListBase>;
};

export default function NewHolidayRequest({ navigation }: Props) {
  const { t } = useTranslation();
  const [postHolidayRequest, { isLoading }] = usePostHolidayRequestMutation();

  const [pickerFor, setPickerFor] = useState<'startDate' | 'endDate' | null>(
    null,
  );

  const initialValues: FormValues = {
    startDate: moment().format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
    comment: '',
  };

  const submit = (values: FormValues) => {
    postHolidayRequest({
      startDate: values.startDate,
      endDate: values.endDate,
      comment: values.comment || undefined,
    })
      .unwrap()
      .then(() => navigation.goBack())
      .catch(showAlert);
  };

  const validate = (values: FormValues) => {
    const errors: Partial<Record<keyof FormValues, string>> = {};
    if (moment(values.endDate).isBefore(moment(values.startDate))) {
      errors.endDate = t('HOLIDAY_END_DATE_BEFORE_START_DATE');
    }
    return errors;
  };

  return (
    <Formik
      initialValues={initialValues}
      validate={validate}
      onSubmit={submit}
      validateOnBlur={false}
      validateOnChange={false}>
      {({ values, errors, touched, setFieldValue, handleChange, handleSubmit }) => (
        <SafeAreaView className="bg-background-50" style={{ flex: 1 }}>
          <ScrollView keyboardShouldPersistTaps="handled">
            <Box className="p-5 gap-3">
              <FormField label={t('HOLIDAY_START_DATE')}>
                <Button
                  variant="outline"
                  onPress={() => setPickerFor('startDate')}>
                  <ButtonText>
                    {moment(values.startDate).format('LL')}
                  </ButtonText>
                </Button>
              </FormField>
              <FormField
                label={t('HOLIDAY_END_DATE')}
                error={errors.endDate}
                touched={touched.endDate}>
                <Button
                  variant="outline"
                  onPress={() => setPickerFor('endDate')}>
                  <ButtonText>{moment(values.endDate).format('LL')}</ButtonText>
                </Button>
              </FormField>
              <FormField label={t('HOLIDAY_COMMENT')} optional>
                <Textarea>
                  <TextareaInput
                    value={values.comment}
                    onChangeText={handleChange('comment')}
                    placeholder={t('HOLIDAY_COMMENT_PLACEHOLDER')}
                  />
                </Textarea>
              </FormField>
            </Box>
            <Box className="p-5">
              <Button onPress={() => handleSubmit()} disabled={isLoading}>
                {isLoading && <ButtonSpinner />}
                <ButtonText>{t('SUBMIT')}</ButtonText>
              </Button>
            </Box>
          </ScrollView>
          <DateTimePickerModal
            isVisible={pickerFor !== null}
            mode="date"
            date={
              pickerFor ? moment(values[pickerFor]).toDate() : new Date()
            }
            onConfirm={date => {
              if (pickerFor) {
                setFieldValue(pickerFor, moment(date).format('YYYY-MM-DD'));
              }
              setPickerFor(null);
            }}
            onCancel={() => setPickerFor(null)}
          />
        </SafeAreaView>
      )}
    </Formik>
  );
}
