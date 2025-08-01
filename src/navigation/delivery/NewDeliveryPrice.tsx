import { Formik } from 'formik';
import { StyleSheet } from 'react-native';
import { Text, View } from 'native-base';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
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

function NewDeliveryPrice({ route }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const delivery = route.params?.delivery;

  const price = useSelector(selectPrice);
  const priceExcludingTax = useSelector(selectPriceExcludingTax);

  const { deliveryCallback } = useDeliveryCallback();

  useEffect(() => {
    dispatch(getPrice(delivery));
  }, [delivery, dispatch]);

  function submit(values) {
    if (price === null || priceExcludingTax === null) return;
    dispatch(createDelivery(values, deliveryCallback));
  }

  return (
    <Formik
      initialValues={delivery}
      onSubmit={submit}
      validateOnBlur={false}
      validateOnChange={false}>
      {({ handleSubmit }) => (
        <ModalFormWrapper
          handleSubmit={handleSubmit}
          t={t}
          isSubmit
          disabled={price === null || priceExcludingTax === null}
          disabledMessage={t('PRICE_CALCULATION_FAILED')}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>{t('PRICE_EXCLUDING_TAX')}</Text>
            <FormInput value={priceExcludingTax} editable={false} />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>{t('PRICE_TOTAL')}</Text>
            <FormInput value={price} editable={false} />
          </View>
          {price === null || priceExcludingTax === null ? (
            <Text>{t('PRICE_CALCULATION_FAILED_DISCLAIMER')}</Text>
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
});

export default NewDeliveryPrice;
