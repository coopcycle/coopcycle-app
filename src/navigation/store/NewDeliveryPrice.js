import { Formik } from 'formik';
import { t } from 'i18next';
import { Text, View } from 'native-base';
import { withTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { connect, useDispatch } from 'react-redux';
import { createDelivery, getPrice } from '../../redux/Store/actions';
import FormInput from './components/FormInput';
import ModalFormWrapper from './ModalFormWrapper';

function NewDeliveryPrice(props) {
  const dispatch = useDispatch();
  const delivery = props.route.params?.delivery;
  if (!delivery) return;
  dispatch(getPrice(delivery));

  function submit(values) {
    dispatch(
      createDelivery(values, () => {
        props.navigation.navigate('StoreHome');
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
        <ModalFormWrapper handleSubmit={handleSubmit} t={t} isSubmit>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Price excluding tax</Text>
            <FormInput value={props.priceExcludingTax} editable={false} />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Total</Text>
            <FormInput value={props.price} editable={false} />
          </View>
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

function mapStateToProps(state) {
  const price = state.store.price;
  const priceExcludingTax = state.store.priceExcludingTax;
  return {
    price,
    priceExcludingTax,
  };
}
export default connect(mapStateToProps)(withTranslation()(NewDeliveryPrice));
