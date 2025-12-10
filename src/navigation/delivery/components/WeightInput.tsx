import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';
import { Text } from '@/components/ui/text';
import {
  BaseWeightFields,
  handleChangeWeight,
} from '@/src/navigation/delivery/utils';
import FormInput from '@/src/navigation/delivery/components/FormInput';

type Props = {};

export const WeightInput = ({}: Props) => {
  const { t } = useTranslation();

  const {
    values,
    touched,
    errors,
    handleBlur,
    setFieldValue,
    setFieldTouched,
  } = useFormikContext<BaseWeightFields>();

  return (
    <View>
      <FormInput
        keyboardType="numeric"
        rightElement={<Text style={styles.weightUnit}>kg</Text>}
        autoCorrect={false}
        returnKeyType="done"
        value={values.weight}
        placeholder={t('STORE_NEW_DELIVERY_ENTER_WEIGHT')}
        testID={'task-weight-input'}
        onChangeText={value =>
          handleChangeWeight(value, setFieldValue, setFieldTouched)
        }
        onBlur={handleBlur('weight')}
      />
      {errors.weight && touched.weight && (
        <Text style={styles.errorText}>{errors.weight}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  weightUnit: {
    paddingHorizontal: 10,
  },
  errorText: {
    paddingVertical: 5,
    color: '#FF4136',
  },
});
