import { Formik } from 'formik';
import { StyleSheet, View } from 'react-native';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { createDelivery } from '../../redux/Delivery/actions';
import { getPrice } from '../../redux/Delivery/actions';
import {
  selectPrice,
  selectPriceExcludingTax,
} from '../../redux/Delivery/selectors';
import { useDeliveryCallback } from './contexts/DeliveryCallbackContext';
import FormInput from './components/FormInput';
import ModalFormWrapper from './ModalFormWrapper';

export default function NewDeliveryPrice({ route }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const delivery = route.params?.delivery;

  const price = useSelector(selectPrice);
  const priceExcludingTax = useSelector(selectPriceExcludingTax);
  const [isManualPriceEnabled, setIsManualPriceEnabled] = useState(false);

  const { deliveryCallback } = useDeliveryCallback();

  useEffect(() => {
    dispatch(getPrice(delivery));
  }, [delivery, dispatch]);

  const onPressManualPriceToggle = (setFieldValue) => () => {
    setIsManualPriceEnabled(!isManualPriceEnabled);
    setFieldValue('manualPriceVariantName', '');
    setFieldValue('manualPriceVariantTotal', '');
  };

  const parsePrice = (value) => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? null : parseInt(parsed * 100, 10);
  };

  const validate = (values) => {
    const errors = {};

    if (isManualPriceEnabled && !parsePrice(values.manualPriceVariantTotal)) {
      errors.manualPriceVariantTotal = t('MANUAL_PRICE_VARIANT_TOTAL_ERROR');
    }

    return errors;
  }

  const submit = (values) => {
    if ((price === null || priceExcludingTax === null) && !isManualPriceEnabled)
      return;

    const data = Object.assign({}, values);
    if (isManualPriceEnabled)
      data.manualPriceVariantTotal = parsePrice(values.manualPriceVariantTotal);

    dispatch(createDelivery(data, deliveryCallback));
  };

  return (
    <Formik
      initialValues={delivery}
      onSubmit={submit}
      validate={validate}
      validateOnBlur={false}
      validateOnChange={false}>
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        setFieldValue,
      }) => (
        <ModalFormWrapper
          handleSubmit={handleSubmit}
          t={t}
          isSubmit
          disabled={price === null || priceExcludingTax === null}
          disabledMessage={t('PRICE_CALCULATION_FAILED')}>
          {!isManualPriceEnabled ? (<>
          <View style={styles.formGroup}>
            <Text style={styles.label}>{t('PRICE_EXCLUDING_TAX')}</Text>
            <FormInput value={priceExcludingTax} editable={false} />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>{t('PRICE_TOTAL')}</Text>
            <FormInput value={price} editable={false} />
          </View>
          </>) : null}
          {price === null || priceExcludingTax === null ? (
            <Text>{t('PRICE_CALCULATION_FAILED_DISCLAIMER')}</Text>
          ) : null}
          {isManualPriceEnabled ? (<>
            <View style={[styles.formGroup]}>
              <Text style={styles.label}>
                {t('MANUAL_PRICE_VARIANT_NAME')}
                <Text style={styles.optional}> ({t('OPTIONAL')})</Text>
              </Text>
              <FormInput
                autoCorrect={false}
                returnKeyType="done"
                onChangeText={handleChange('manualPriceVariantName')}
                onBlur={handleBlur('manualPriceVariantName')}
                value={values.manualPriceVariantName}
                testID="delivery__order__manual_price_variant_name"
              />
            </View>
            <View style={[styles.formGroup]}>
              <Text style={styles.label}>{t('MANUAL_PRICE_VARIANT_TOTAL')}</Text>
              <FormInput
                keyboardType="numeric"
                returnKeyType="done"
                onChangeText={handleChange('manualPriceVariantTotal')}
                onBlur={handleBlur('manualPriceVariantTotal')}
                value={values.manualPriceVariantTotal}
                placeholder={price}
                testID="delivery__order__manual_price_variant_total"
              />
              {errors.manualPriceVariantTotal && (
                <Text note style={styles.errorText}>
                  {errors.manualPriceVariantTotal}
                </Text>
              )}
            </View>
          </>) : null}
          <Button onPress={onPressManualPriceToggle(setFieldValue)}>
            <ButtonText>{t('MANUAL_PRICE_TOGGLE_' + (isManualPriceEnabled ? 'OFF' : 'ON'))}</ButtonText>
          </Button>
        </ModalFormWrapper>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 8,
    fontWeight: '500',
  },
  formGroup: {
    marginBottom: 10,
  },
  optional: {
    fontWeight: '400',
    opacity: 0.7,
    fontSize: 12,
  },
  errorText: {
    paddingVertical: 5,
    color: '#FF4136',
  },
});
