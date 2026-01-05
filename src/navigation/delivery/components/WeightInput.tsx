import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';
import { Text } from '@/components/ui/text';
import { BaseWeightFields } from '@/src/navigation/delivery/utils';
import FormInput from '@/src/navigation/delivery/components/FormInput';

type Props = {
  disabled?: boolean;
};

export const WeightInput = ({ disabled = false }: Props) => {
  const { t } = useTranslation();

  const {
    values,
    touched,
    errors,
    handleBlur,
    setFieldValue,
    setFieldTouched,
  } = useFormikContext<BaseWeightFields>();

  function handleChangeWeight(value: string) {
    let newValue = value.replace(',', '.').replace(/[^0-9.]/g, '');

    const firstDecimalIndex = newValue.indexOf('.');
    if (firstDecimalIndex === 0) {
      newValue = `0${newValue}`;
    } else if (firstDecimalIndex !== -1) {
      newValue =
        newValue.substring(0, firstDecimalIndex + 1) +
        newValue.substring(firstDecimalIndex + 1).replace(/\./g, '');
    }

    if (newValue.includes('.')) {
      const decimalIndex = newValue.indexOf('.');
      newValue =
        newValue.substring(0, decimalIndex + 1) +
        newValue.substring(decimalIndex + 1, decimalIndex + 4);
    }

    setFieldValue('weight', newValue);
    setFieldTouched('weight');
  }

  return (
    <View>
      <FormInput
        testID={'task-weight-input'}
        keyboardType="numeric"
        rightElement={<Text style={styles.weightUnit}>kg</Text>}
        autoCorrect={false}
        returnKeyType="done"
        value={values.weight}
        placeholder={t('STORE_NEW_DELIVERY_ENTER_WEIGHT')}
        isDisabled={disabled}
        onChangeText={value => handleChangeWeight(value)}
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
