import { Formik } from 'formik'
import Alert from 'native-base/src/components/composites/Alert/Alert'
import React from 'react'
import { withTranslation } from 'react-i18next'
import { Platform, StyleSheet, Text, View } from 'react-native'
import { connect, useSelector } from 'react-redux'
import FormInput from './components/FormInput';
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
  const stores = useSelector(state => state.dispatch.stores);

  const onSelectStore = (store) => {
    // TODO: do something more interesting with selected store
    console.log(store)
  }

  // TODO: Do we really need a form here? Don't think so
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
          <FormInput
            autoCorrect={false}
            returnKeyType="done"
            //onChangeText={handleChange('businessName')}
            //onBlur={handleBlur('businessName')}
            value=""
            placeholder={t('DISPATCH_NEW_DELIVERY_FILTER_STORE_PLACEHOLDER')}
          />
          <View style={styles.storeListContainer}>
            <StoreListInput
              stores={stores}
              onSelectStore={onSelectStore}
            />
          </View>
        </ModalFormWrapper>
      )}
    </Formik>
  )
  }

  const styles = StyleSheet.create({
    storeListContainer: {
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
