import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Text } from '@/components/ui/text';
import ClientListInput from './ClientListInput';
import AddressAutocomplete from '@/src/components/AddressAutocomplete';
import FormInput from '@/src/navigation/delivery/components/FormInput';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';
import { BaseAddressFields } from '@/src/navigation/delivery/utils';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectAddresses,
  selectAssertDeliveryError,
  selectStore,
} from '@/src/redux/Delivery/selectors';
import {
  useBackgroundContainerColor,
  useBackgroundHighlightColor,
  usePrimaryColor,
} from '@/src/styles/theme';
import { assertDelivery } from '@/src/redux/Delivery/actions';
import { AsYouType } from 'libphonenumber-js';
import { Address } from '@/src/redux/api/types';
import { AutocompleteAddress } from '@/src/utils/Address';
import { FormField } from '@/src/navigation/task/components/FormField';
import { selectCountry } from '@/src/redux/App/selectors';

export const AddressFields = () => {
  const { t } = useTranslation();

  const primaryColor = usePrimaryColor();
  const backgroundColor = useBackgroundContainerColor();
  const backgroundHighlightColor = useBackgroundHighlightColor();

  const country = useSelector(selectCountry);

  const store = useSelector(selectStore);
  const addresses = useSelector(selectAddresses);
  const deliveryError = useSelector(selectAssertDeliveryError);

  const dispatch = useDispatch();

  const {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
    handleChange,
    handleBlur,
  } = useFormikContext<BaseAddressFields>();

  const inputStyles = {
    backgroundColor,
    borderColor: backgroundHighlightColor,
  };

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

  function setAddressData(data: Address) {
    setFieldValue('address', {
      geo: data.geo,
      streetAddress: data.streetAddress,
    });
    setFieldTouched('address');

    const businessName = data.name || '';
    setFieldValue('businessName', businessName);
    setFieldTouched('businessName');

    const contactName = data.contactName || '';
    setFieldValue('contactName', contactName);
    setFieldTouched('contactName');

    const telephone = data.telephone || '';
    setFieldValue('telephone', telephone);
    setFieldTouched('telephone');

    const description = data.description || '';
    setFieldValue('description', description);
    setFieldTouched('description');
  }

  function onSelectAddress(addr: AutocompleteAddress) {
    if (addr['@id']) {
      setAddressData(addr);
    } else {
      setFieldValue('address', addr);
      setFieldTouched('address');
    }

    const delivery = {
      store: store['@id'],
      dropoff: {
        address: addr,
        before: 'tomorrow 12:00',
      },
    };

    dispatch(
      assertDelivery(delivery, () => {
        setFieldValue('isValidAddress', true);
      }),
    );
  }

  function handleChangeTelephone(value) {
    setFieldValue('telephone', new AsYouType(country).input(value));
    setFieldTouched('telephone', true);
  }

  return (
    <>
      {/* Client Search */}
      <View style={[styles.formGroup, { zIndex: 2 }]}>
        <FormField label={t('STORE_NEW_DELIVERY_SEARCH_CLIENT')} optional>
          <View style={styles.autocompleteWrapper}>
            <ClientListInput
              addresses={addresses}
              placeholder={t('STORE_NEW_DELIVERY_ENTER_SEARCH_CLIENT')}
              onSelectAddress={a => {
                setAddressData(a);
                setFieldValue('isValidAddress', true);
              }}
            />
          </View>
        </FormField>
      </View>
      {/* Address Section */}
      <View style={[styles.formGroup, { zIndex: 1 }]}>
        <Text style={styles.label}>
          {t('STORE_NEW_DELIVERY_ADDRESS')}
          {values.isValidAddress && ' ✓'}
        </Text>
        <View style={styles.autocompleteWrapper}>
          <AddressAutocomplete
            key={values.address?.streetAddress ?? ''}
            addresses={[]}
            onChangeText={() => {
              if (values.isValidAddress) setFieldValue('isValidAddress', false);
              setFieldTouched('address');
            }}
            onBlur={handleBlur('address')}
            value={values.address}
            onSelectAddress={(e: AutocompleteAddress) => onSelectAddress(e)}
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
        {errors.address && !values.isValidAddress && touched.address && (
          <Text note style={styles.errorText}>
            {errors.address}
          </Text>
        )}
      </View>
      {/* Client Name / Address Name */}
      <FormField
        label={t('STORE_NEW_DELIVERY_BUSINESS_NAME')}
        optional
        error={errors.businessName}
        touched={touched.businessName}>
        <FormInput
          autoCorrect={false}
          returnKeyType="done"
          onChangeText={handleChange('businessName')}
          onBlur={handleBlur('businessName')}
          value={values.businessName}
          placeholder={t('STORE_NEW_DELIVERY_ENTER_BUSINESS_NAME')}
          testID="business-name-input"
        />
      </FormField>
      {/* Contact Name */}
      <FormField
        label={t('STORE_NEW_DELIVERY_CONTACT_NAME')}
        optional
        error={errors.contactName}
        touched={touched.contactName}>
        <FormInput
          autoCorrect={false}
          returnKeyType="done"
          onChangeText={handleChange('contactName')}
          onBlur={handleBlur('contactName')}
          value={values.contactName}
          placeholder={t('STORE_NEW_DELIVERY_ENTER_CONTACT_NAME')}
          testID="contact-name-input"
        />
      </FormField>
      {/* Telephone */}
      <FormField
        label={t('STORE_NEW_DELIVERY_PHONE_NUMBER')}
        error={errors.telephone}
        touched={touched.telephone}>
        <FormInput
          autoCorrect={false}
          keyboardType="phone-pad"
          returnKeyType="done"
          onChangeText={value => handleChangeTelephone(value)}
          onBlur={handleBlur('telephone')}
          value={values.telephone}
          placeholder={t('STORE_NEW_DELIVERY_ENTER_PHONE_NUMBER')}
          testID="telephone-input"
        />
      </FormField>
      {/* Address Description */}
      <FormField
        label={t('STORE_NEW_DELIVERY_ADDRESS_DESCRIPTION')}
        optional
        error={errors.description}
        touched={touched.description}>
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
          testID="description-input"
        />
      </FormField>
    </>
  );
};

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
  errorInput: {
    borderColor: '#FF4136',
  },
  formGroup: {
    marginBottom: 10,
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
  errorText: {
    color: '#FF4136',
    marginTop: 5,
  },
});
