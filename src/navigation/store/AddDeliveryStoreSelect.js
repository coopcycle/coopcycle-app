import { Formik } from 'formik'
import Alert from 'native-base/src/components/composites/Alert/Alert'
import React from 'react'
import { withTranslation } from 'react-i18next'
import { Platform, StyleSheet, Text, View } from 'react-native'
import { connect, useSelector } from 'react-redux'
import StoreListInput from '../dispatch/components/StoreListInput'
import ModalFormWrapper from './ModalFormWrapper'

const AddDeliveryStoreSelect = (props) => {
  const {
    addresses,
    t,
    route,
    navigation,
    country
  } = props;

  const initialValues = {
    client: '',
  }
  function submit(values) {
    Alert('OK!')
      /* const dropoff = {
        telephone: parsePhoneNumberFromString(values.telephone, country).format(
          'E.164',
        ),
        contactName: values.contactName,
        description: values.description,
        businessName: values.businessName,
        address,
      };

      navigation.navigate('StoreNewDeliveryForm', {
        pickup: route.params?.pickup || undefined,
        dropoff: dropoff,
      }); */
    }
    const stores = useSelector(state => state.store.myStores);

  return (
    <Formik
      initialValues={initialValues}
      /* TODO: is this optional? // validate={validate} */
      onSubmit={values => submit(values)}
      validateOnBlur={true}
      validateOnChange={true}>
      {({
        handleSubmit,
      }) => (
        <ModalFormWrapper handleSubmit={handleSubmit} t={t}>
          <Text style={styles.label}>
              {t('STORE_NEW_DELIVERY_SEARCH_STORE')}{' '}
              <Text style={styles.optional}>({t('OPTIONAL')})</Text>
            </Text>
            <View style={styles.autocompleteWrapper}>
              <StoreListInput
                stores={stores}
                placeholder={t('STORE_NEW_DELIVERY_ENTER_SEARCH_STORE')}
              />
            </View>
        </ModalFormWrapper>
      )}
    </Formik>
  )
  }

  const styles = StyleSheet.create({
    autocompleteWrapper: {
      height: 40,
      ...Platform.select({
        android: {
          flex: 1,
          top: 0,
          right: 0,
          left: 0,
          zIndex: 1,
        },
        ios: {
          top: 0,
          right: 0,
          left: 0,
          zIndex: 10,
          overflow: 'visible',
        },
      }),
    },
    label: {
      marginBottom: 8,
      fontWeight: '600',
    },
    optional: {
      fontWeight: '400',
      opacity: 0.7,
      fontSize: 12,
    },
    help: {
      marginBottom: 5,
      fontWeight: '400',
    },
    errorInput: {
      borderColor: '#FF4136',
    },
    header: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },
    formGroup: {
      marginBottom: 10,
    },
    textInput: {
      height: 40,
      paddingHorizontal: 10,
    },
    errorText: {
      color: '#FF4136',
      marginTop: 5,
    },
    textarea: {
      minHeight: 25 * 3,
    },
  });

export default connect()(withTranslation()(AddDeliveryStoreSelect))