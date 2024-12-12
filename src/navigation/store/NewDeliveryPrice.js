import { Formik } from 'formik';
import { Text, View } from 'native-base';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { createDelivery, getPrice } from '../../redux/Store/actions';
import ModalFormWrapper from './ModalFormWrapper';
import FormInput from './components/FormInput';

function NewDeliveryPrice({ route, navigation }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const delivery = route.params?.delivery;

  const price = useSelector(state => state.store.price);
  const priceExcludingTax = useSelector(state => state.store.priceExcludingTax);

  if (!delivery) return null;

  dispatch(getPrice(delivery));

  function submit(values) {
    if (price === null || priceExcludingTax === null) return;
    dispatch(
      createDelivery(values, () => {
        navigation.navigate('StoreHome');
      }),
    );
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
