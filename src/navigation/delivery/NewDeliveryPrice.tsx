import { Formik, FormikErrors } from 'formik';
import { StyleSheet, View } from 'react-native';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import {
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
} from '@/components/ui/checkbox';
import { CheckIcon } from '@/components/ui/icon';
import { Divider } from '@/components/ui/divider';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { createDelivery } from '../../redux/Delivery/actions';
import { getPrice } from '../../redux/Delivery/actions';
import {
  selectPrice,
  selectPriceExcludingTax,
  selectStore,
} from '../../redux/Delivery/selectors';
import { useDeliveryCallback } from './contexts/DeliveryCallbackContext';
import { useGetStorePaymentMethodsQuery } from '../../redux/api/slice';
import FormInput from './components/FormInput';
import ModalFormWrapper from './ModalFormWrapper';
import { CashOnDeliveryDisclaimer } from '../checkout/components/CashOnDeliveryDisclaimer';
import { OrderPayload, PostDeliveryBody } from '@/src/redux/api/types';
import { useAppDispatch } from '@/src/redux/store';

type NewDeliveryPriceFormValues = {
  manualPriceVariantName?: string;
  manualPriceVariantTotal?: string;
  paymentMethod?: string;
};

export default function NewDeliveryPrice({ route }) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const delivery = route.params?.delivery as PostDeliveryBody;

  const price = useSelector(selectPrice);
  const priceExcludingTax = useSelector(selectPriceExcludingTax);
  const store = useSelector(selectStore);
  const [isManualPriceEnabled, setIsManualPriceEnabled] = useState(false);

  const { deliveryCallback, allowManualPrice = false } = useDeliveryCallback();

  const { data: paymentMethods } = useGetStorePaymentMethodsQuery(
    store?.['@id'],
    {
      skip: !store?.['@id'],
    },
  );

  const isCashOnDeliveryAvailable =
    paymentMethods?.methods?.some(
      method => method.type === 'cash_on_delivery',
    ) ?? false;

  useEffect(() => {
    dispatch(getPrice(delivery));
  }, [delivery, dispatch]);

  const onPressManualPriceToggle =
    (
      setFieldValue: (
        field: string,
        value: unknown,
        shouldValidate?: boolean,
      ) => Promise<void | FormikErrors<NewDeliveryPriceFormValues>>,
    ) =>
    () => {
      setIsManualPriceEnabled(!isManualPriceEnabled);
      setFieldValue('manualPriceVariantName', '');
      setFieldValue('manualPriceVariantTotal', '');
    };

  const parsePrice = (value?: string) => {
    if (!value) {
      return null;
    }

    const parsed = parseFloat(value);
    return isNaN(parsed) ? null : parseInt(parsed * 100, 10);
  };

  const validate = (values: NewDeliveryPriceFormValues) => {
    const errors = {} as FormikErrors<NewDeliveryPriceFormValues>;

    if (isManualPriceEnabled && !parsePrice(values.manualPriceVariantTotal)) {
      errors.manualPriceVariantTotal = t('MANUAL_PRICE_VARIANT_TOTAL_ERROR');
    }

    return errors;
  };

  const submit = (values: NewDeliveryPriceFormValues) => {
    if ((price === null || priceExcludingTax === null) && !isManualPriceEnabled)
      return;

    const data = Object.assign({}, delivery);

    const orderPayload: OrderPayload = {};

    if (isManualPriceEnabled) {
      orderPayload.arbitraryPrice = {
        variantName: values.manualPriceVariantName,
        variantPrice: parsePrice(values.manualPriceVariantTotal),
      };
    }

    if (values.paymentMethod) {
      orderPayload.paymentMethod = values.paymentMethod;
    }

    if (Object.keys(orderPayload).length > 0) {
      data.order = orderPayload;
    }

    dispatch(createDelivery(data, deliveryCallback));
  };

  return (
    <Formik
      initialValues={{} as NewDeliveryPriceFormValues}
      onSubmit={submit}
      validate={validate}
      validateOnBlur={false}
      validateOnChange={false}
    >
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
          disabledMessage={t('PRICE_CALCULATION_FAILED')}
        >
          {!isManualPriceEnabled ? (
            <>
              <View style={styles.formGroup}>
                <Text style={styles.label}>{t('PRICE_EXCLUDING_TAX')}</Text>
                <FormInput value={priceExcludingTax} editable={false} />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.label}>{t('PRICE_TOTAL')}</Text>
                <FormInput value={price} editable={false} />
              </View>
            </>
          ) : null}
          {price === null || priceExcludingTax === null ? (
            <Text>{t('PRICE_CALCULATION_FAILED_DISCLAIMER')}</Text>
          ) : null}
          {isManualPriceEnabled ? (
            <>
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
                <Text style={styles.label}>
                  {t('MANUAL_PRICE_VARIANT_TOTAL')}
                </Text>
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
            </>
          ) : null}
          {allowManualPrice ? (
            <Button onPress={onPressManualPriceToggle(setFieldValue)}>
              <ButtonText>
                {t(
                  'MANUAL_PRICE_TOGGLE_' +
                    (isManualPriceEnabled ? 'OFF' : 'ON'),
                )}
              </ButtonText>
            </Button>
          ) : null}
          {isCashOnDeliveryAvailable ? (
            <>
              <Divider className="my-4" />
              <View style={styles.formGroup}>
                <Text style={styles.label}>{t('PAYMENT_FORM_TITLE')}</Text>
                <Checkbox
                  value="cash_on_delivery"
                  isChecked={values.paymentMethod === 'cash_on_delivery'}
                  onChange={checked => {
                    setFieldValue(
                      'paymentMethod',
                      checked ? 'cash_on_delivery' : undefined,
                    );
                  }}
                  testID="cash-on-delivery-checkbox"
                >
                  <CheckboxIndicator>
                    <CheckboxIcon as={CheckIcon} />
                  </CheckboxIndicator>
                  <CheckboxLabel>{t('PM_CASH')}</CheckboxLabel>
                </Checkbox>
                {values.paymentMethod === 'cash_on_delivery' && (
                  <View className="mt-4">
                    <CashOnDeliveryDisclaimer />
                  </View>
                )}
              </View>
            </>
          ) : null}
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
