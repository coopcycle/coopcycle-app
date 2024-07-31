import { Formik } from 'formik';
import { AsYouType, parsePhoneNumberFromString } from 'libphonenumber-js';
import _ from 'lodash';
import { Text } from 'native-base';
import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import { Platform, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import AddressAutocomplete from '../../components/AddressAutocomplete';
import { assertDelivery } from '../../redux/Store/actions';
import { selectStore } from '../../redux/Store/selectors';
import {
  useBackgroundContainerColor,
  useBackgroundHighlightColor,
  usePrimaryColor,
} from '../../styles/theme';
import ModalFormWrapper from './ModalFormWrapper';
import FormInput from './components/FormInput';

function NewDelivery(props) {
  const [validAddresses, setValidAddresses] = useState(false);
  const [address, setAddress] = useState(null);
  const backgroundColor = useBackgroundContainerColor();
  const backgroundHighlightColor = useBackgroundHighlightColor();
  const primaryColor = usePrimaryColor();

  const inputStyles = {
    backgroundColor,
    borderColor: backgroundHighlightColor,
  };

  function onSelectAddress(address, setFieldValue) {
    if (address['@id']) {
      const contactName = address.contactName || '';
      const telephone = address.telephone || '';
      const businessName = address.businessName || '';
      const comment = address.comment || '';

      setFieldValue('contactName', contactName);
      setFieldValue('telephone', telephone);
      setFieldValue('businessName', businessName);
      setFieldValue('description', comment);
      setAddress({
        streetAddress: address.streetAddress,
        geo: address.geo,
      });
    } else {
      setAddress(address);
    }

    const delivery = {
      store: props.store['@id'],
      dropoff: {
        address,
        before: 'tomorrow 12:00',
      },
    };

    props.assertDelivery(delivery, () => {
      setValidAddresses(true);
    });
  }

  let autocompleteProps = {
    inputContainerStyle: {
      flex: 1,
      borderWidth: 0,
    },
    textInputStyle: {
      padding: 10,
    },
  };

  if (!_.isEmpty(props.deliveryError)) {
    autocompleteProps = {
      ...autocompleteProps,
      inputContainerStyle: {
        ...autocompleteProps.inputContainerStyle,
        ...styles.errorInput,
      },
    };
  }

  function validate(values) {
    let errors = {};

    if (_.isEmpty(values.telephone)) {
      errors.telephone = props.t('STORE_NEW_DELIVERY_ERROR.EMPTY_PHONE_NUMBER');
    } else {
      const phoneNumber = parsePhoneNumberFromString(
        _.trim(values.telephone),
        props.country,
      );
      if (!phoneNumber || !phoneNumber.isValid()) {
        errors.telephone = props.t('INVALID_PHONE_NUMBER');
      }
    }

    if (_.isEmpty(values.contactName)) {
      errors.contactName = props.t(
        'STORE_NEW_DELIVERY_ERROR.EMPTY_CONTACT_NAME',
      );
    }

    if (!validAddresses) {
      errors.address = props.t('STORE_NEW_DELIVERY_ADDRESS_HELP');
    }

    if (_.isEmpty(errors.address)) {
      delete errors.address;
    }

    return errors;
  }

  let initialValues = {
    telephone: '',
    contactName: '',
    businessName: '',
    description: '',
  };

  function handleChangeTelephone(value, setFieldValue, setFieldTouched) {
    setFieldValue('telephone', new AsYouType(props.country).input(value));
    setFieldTouched('telephone', true);
  }

  function submit(values) {
    const delivery = {
      telephone: parsePhoneNumberFromString(
        values.telephone,
        props.country,
      ).format('E.164'),
      contactName: values.contactName,
      description: values.description,
      businessName: values.businessName,
      address,
    };

    props.navigation.navigate('StoreNewDeliveryForm', { delivery });
  }

  return (
    <Formik
      initialValues={initialValues}
      validate={validate}
      onSubmit={values => submit(values)}
      validateOnBlur={false}
      validateOnChange={false}>
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
        setFieldValue,
        setFieldTouched,
      }) => (
        <ModalFormWrapper handleSubmit={handleSubmit} t={props.t}>
          <View style={[styles.formGroup, { zIndex: 1 }]}>
            <Text style={styles.label}>
              {props.t('STORE_NEW_DELIVERY_ADDRESS')}
              {validAddresses && ' ✓'}
            </Text>
            <View style={styles.autocompleteContainer}>
              <AddressAutocomplete
                key={address}
                addresses={props.addresses}
                value={address}
                onSelectAddress={e => onSelectAddress(e, setFieldValue)}
                containerStyle={[
                  {
                    flex: 1,
                    justifyContent: 'center',
                  },
                ]}
                style={{
                  borderRadius: 0,
                  padding: 10,
                  borderWidth: 0,
                  paddingLeft: 10,
                  ...inputStyles,
                }}
                {...autocompleteProps}
                placeholder={props.t('ENTER_ADDRESS')}
                _focus={{ borderColor: primaryColor }}
              />
            </View>
            {errors.address && touched.address && (
              <Text note style={styles.errorText}>
                {errors.address}
              </Text>
            )}
          </View>
          <View style={[styles.formGroup]}>
            <Text style={styles.label}>{'Business Name'}</Text>
            <FormInput
              autoCorrect={false}
              returnKeyType="done"
              onChangeText={handleChange('businessName')}
              onBlur={handleBlur('businessName')}
              value={values.businessName}
            />
            {errors.businessName && touched.businessName && (
              <Text note style={styles.errorText}>
                {errors.businessName}
              </Text>
            )}
          </View>
          <View style={[styles.formGroup]}>
            <Text style={styles.label}>
              {props.t('STORE_NEW_DELIVERY_CONTACT_NAME')}
            </Text>
            <FormInput
              autoCorrect={false}
              returnKeyType="done"
              onChangeText={handleChange('contactName')}
              onBlur={handleBlur('contactName')}
              value={values.contactName}
            />
            {errors.contactName && touched.contactName && (
              <Text note style={styles.errorText}>
                {errors.contactName}
              </Text>
            )}
          </View>
          <View style={[styles.formGroup]}>
            <Text style={styles.label}>
              {props.t('STORE_NEW_DELIVERY_PHONE_NUMBER')}
            </Text>
            <FormInput
              autoCorrect={false}
              keyboardType="phone-pad"
              returnKeyType="done"
              onChangeText={value =>
                handleChangeTelephone(value, setFieldValue, setFieldTouched)
              }
              onBlur={handleBlur('telephone')}
              value={values.telephone}
            />
            {errors.telephone && touched.telephone && (
              <Text note style={styles.errorText}>
                {errors.telephone}
              </Text>
            )}
          </View>
          <View style={[styles.formGroup]}>
            <Text style={styles.label}>
              {props.t('STORE_NEW_DELIVERY_COMMENTS')}
            </Text>
            <FormInput
              style={{
                height: 80,
              }}
              autoCorrect={false}
              multiline={true}
              onChangeText={handleChange('description')}
              onBlur={handleBlur('description')}
              value={values.description}
            />
          </View>
        </ModalFormWrapper>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  autocompleteContainer: {
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
  help: {
    marginBottom: 5,
    fontWeight: '400',
  },
  errorInput: {
    borderColor: '#FF4136',
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

function mapStateToProps(state) {
  return {
    store: selectStore(state),
    deliveryError: state.store.assertDeliveryError,
    addresses: state.store.addresses,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    assertDelivery: (delivery, onSuccess) =>
      dispatch(assertDelivery(delivery, onSuccess)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(NewDelivery));
