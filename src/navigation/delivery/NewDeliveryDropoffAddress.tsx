import { IconCircleArrowDownFilled } from '@tabler/icons-react-native';
import { Formik } from 'formik';
import { AsYouType, parsePhoneNumberFromString } from 'libphonenumber-js';
import _ from 'lodash';
import { Text } from 'native-base';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import AddressAutocomplete from '../../components/AddressAutocomplete';
import { assertDelivery } from '../../redux/Delivery/actions';
import {
  selectAddresses,
  selectAssertDeliveryError,
  selectStore,
} from '../../redux/Delivery/selectors';
import {
  useBackgroundContainerColor,
  useBackgroundHighlightColor,
  usePrimaryColor,
} from '../../styles/theme';
import ClientListInput from './components/ClientListInput';
import FormInput from './components/FormInput';
import ModalFormWrapper from './ModalFormWrapper';

function NewDeliveryDropoffAddress({ navigation, route }) {
  const [validAddress, setValidAddress] = useState(false);
  const [address, setAddress] = useState(null);
  const backgroundColor = useBackgroundContainerColor();
  const backgroundHighlightColor = useBackgroundHighlightColor();
  const primaryColor = usePrimaryColor();

  const country = useSelector(state =>
    state.app.settings.country.toUpperCase(),
  );
  const store = useSelector(selectStore);
  const addresses = useSelector(selectAddresses);
  const deliveryError = useSelector(selectAssertDeliveryError);
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const inputStyles = {
    backgroundColor,
    borderColor: backgroundHighlightColor,
  };

  function setAddressData(data, setFieldValue) {
    const contactName = data.contactName || '';
    const telephone = data.telephone || '';
    const businessName = data.name || '';
    const description = data.description || '';

    setFieldValue('contactName', contactName);
    setFieldValue('telephone', telephone);
    setFieldValue('businessName', businessName);
    setFieldValue('description', description);
    setAddress({
      streetAddress: data.streetAddress,
      geo: data.geo,
    });
  }

  function onSelectAddress(addr, setFieldValue) {
    if (addr['@id']) {
      setAddressData(addr, setFieldValue);
    } else {
      setAddress(addr);
    }

    const delivery = {
      store: store['@id'],
      dropoff: {
        address: addr,
        before: 'tomorrow 12:00',
      },
    };

    dispatch(assertDelivery(delivery, () => setValidAddress(true)));
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

  if (!_.isEmpty(deliveryError)) {
    autocompleteProps = {
      ...autocompleteProps,
      inputContainerStyle: {
        ...autocompleteProps.inputContainerStyle,
        ...styles.errorInput,
      },
    };
  }

  function validate(values) {
    const errors = {};

    if (_.isEmpty(values.telephone)) {
      errors.telephone = t('STORE_NEW_DELIVERY_ERROR.EMPTY_PHONE_NUMBER');
    } else {
      const phoneNumber = parsePhoneNumberFromString(
        _.trim(values.telephone),
        country,
      );
      if (!phoneNumber || !phoneNumber.isValid()) {
        errors.telephone = t('INVALID_PHONE_NUMBER');
      }
    }

    // if (_.isEmpty(values.contactName)) {
    //   errors.contactName = t('STORE_NEW_DELIVERY_ERROR.EMPTY_CONTACT_NAME');
    // }

    if (!validAddress) {
      errors.address = t('STORE_NEW_DELIVERY_ADDRESS_HELP');
    }

    return errors;
  }

  const initialValues = {
    telephone: '',
    contactName: '',
    businessName: '',
    description: '',
    address: '',
  };

  function handleChangeTelephone(value, setFieldValue, setFieldTouched) {
    setFieldValue('telephone', new AsYouType(country).input(value));
    setFieldTouched('telephone', true);
  }

  function submit(values) {
    const dropoff = {
      telephone: parsePhoneNumberFromString(values.telephone, country).format(
        'E.164',
      ),
      contactName: values.contactName,
      description: values.description,
      businessName: values.businessName,
      address,
    };

    navigation.navigate('NewDeliveryDropoffDetails', {
      pickup: route.params?.pickup || undefined,
      dropoff: dropoff,
    });
  }

  return (
    <Formik
      initialValues={initialValues}
      validate={validate}
      onSubmit={submit}
      validateOnBlur={true}
      validateOnChange={true}>
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
        <ModalFormWrapper handleSubmit={handleSubmit} t={t}>
          <View style={[styles.formGroup, { zIndex: 2 }]}>
            <View style={[styles.header, styles.label]}>
              <IconCircleArrowDownFilled
                size={24}
                fill={primaryColor}
                color={backgroundColor}
                stroke={10}
              />
              <Text>{t('STORE_NEW_DELIVERY_DROPOFF_TITLE')}</Text>
            </View>
            <Text style={styles.optional}>
              {t('STORE_NEW_DELIVERY_DROPOFF_DESCRIPTION')}
            </Text>
          </View>
          <View style={[styles.formGroup, { zIndex: 2 }]}>
            <Text style={styles.label}>
              {t('STORE_NEW_DELIVERY_SEARCH_CLIENT')}{' '}
              <Text style={styles.optional}>({t('OPTIONAL')})</Text>
            </Text>
            <View style={styles.autocompleteWrapper}>
              <ClientListInput
                onSelectAddress={a => {
                  setAddressData(a, setFieldValue);
                  setValidAddress(true);
                }}
                addresses={addresses}
                placeholder={t('STORE_NEW_DELIVERY_ENTER_SEARCH_CLIENT')}
              />
            </View>
          </View>
          <View style={[styles.formGroup, { zIndex: 1 }]}>
            <Text style={styles.label}>
              {t('STORE_NEW_DELIVERY_ADDRESS')}
              {validAddress && ' ✓'}
            </Text>
            <View style={styles.autocompleteWrapper}>
              <AddressAutocomplete
                key={address?.streetAddress ?? ''}
                addresses={[]}
                onChangeText={() => {
                  if (validAddress) setValidAddress(false);
                  handleChange('address');
                }}
                onBlur={handleBlur('address')}
                value={address}
                onSelectAddress={e => onSelectAddress(e, setFieldValue)}
                containerStyle={{
                  flex: 1,
                  justifyContent: 'center',
                }}
                style={{
                  borderRadius: 0,
                  padding: 10,
                  borderWidth: 0,
                  paddingLeft: 10,
                  ...inputStyles,
                }}
                {...autocompleteProps}
                placeholder={t('ENTER_ADDRESS')}
                _focus={{ borderColor: primaryColor }}
                testID="delivery__dropoff__address"
              />
            </View>
            {errors.address && !validAddress && touched.address && (
              <Text note style={styles.errorText}>
                {errors.address}
              </Text>
            )}
          </View>
          <View style={[styles.formGroup]}>
            <Text style={styles.label}>
              {t('STORE_NEW_DELIVERY_BUSINESS_NAME')}{' '}
              <Text style={styles.optional}>({t('OPTIONAL')})</Text>
            </Text>
            <FormInput
              autoCorrect={false}
              returnKeyType="done"
              onChangeText={handleChange('businessName')}
              onBlur={handleBlur('businessName')}
              value={values.businessName}
              placeholder={t('STORE_NEW_DELIVERY_ENTER_BUSINESS_NAME')}
            />
            {errors.businessName && touched.businessName && (
              <Text note style={styles.errorText}>
                {errors.businessName}
              </Text>
            )}
          </View>
          <View style={[styles.formGroup]}>
            <Text style={styles.label}>
              {t('STORE_NEW_DELIVERY_CONTACT_NAME')}{' '}
              <Text style={styles.optional}>({t('OPTIONAL')})</Text>
            </Text>
            <FormInput
              autoCorrect={false}
              returnKeyType="done"
              onChangeText={handleChange('contactName')}
              onBlur={handleBlur('contactName')}
              value={values.contactName}
              placeholder={t('STORE_NEW_DELIVERY_ENTER_CONTACT_NAME')}
              testID="delivery__dropoff__contact_name"
            />
            {errors.contactName && touched.contactName && (
              <Text note style={styles.errorText}>
                {errors.contactName}
              </Text>
            )}
          </View>
          <View style={[styles.formGroup]}>
            <Text style={styles.label}>
              {t('STORE_NEW_DELIVERY_PHONE_NUMBER')}
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
              placeholder={t('STORE_NEW_DELIVERY_ENTER_PHONE_NUMBER')}
              testID="delivery__dropoff__phone"
            />
            {errors.telephone && touched.telephone && (
              <Text note style={styles.errorText}>
                {errors.telephone}
              </Text>
            )}
          </View>
          <View style={[styles.formGroup]}>
            <Text style={styles.label}>
              {t('STORE_NEW_DELIVERY_ADDRESS_DESCRIPTION')}{' '}
              <Text style={styles.optional}>({t('OPTIONAL')})</Text>
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
              placeholder={t('STORE_NEW_DELIVERY_ENTER_ADDRESS_DESCRIPTION')}
            />
          </View>
        </ModalFormWrapper>
      )}
    </Formik>
  );
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

export default NewDeliveryDropoffAddress;
