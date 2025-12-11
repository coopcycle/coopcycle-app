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

export const AddressFields = () => {
  const { t } = useTranslation();

  const primaryColor = usePrimaryColor();
  const backgroundColor = useBackgroundContainerColor();
  const backgroundHighlightColor = useBackgroundHighlightColor();

  const store = useSelector(selectStore);
  const addresses = useSelector(selectAddresses);
  const deliveryError = useSelector(selectAssertDeliveryError);

  const country = useSelector(state =>
    state.app.settings.country.toUpperCase(),
  );

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
    const contactName = data.contactName || '';
    const telephone = data.telephone || '';
    const businessName = data.name || '';
    const description = data.description || '';

    setFieldValue('contactName', contactName);
    setFieldValue('telephone', telephone);
    setFieldValue('businessName', businessName);
    setFieldValue('description', description);
    setFieldValue('address', {
      geo: data.geo,
      streetAddress: data.streetAddress,
    });
  }

  function onSelectAddress(addr: AutocompleteAddress) {
    if (addr['@id']) {
      setAddressData(addr);
    } else {
      setFieldValue('address', addr);
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
      <View style={[styles.formGroup, { zIndex: 2 }]}>
        <Text style={styles.label}>
          {t('STORE_NEW_DELIVERY_SEARCH_CLIENT')}{' '}
          <Text style={styles.optional}>({t('OPTIONAL')})</Text>
        </Text>
        <View style={styles.autocompleteWrapper}>
          <ClientListInput
            onSelectAddress={a => {
              setAddressData(a);
              setFieldValue('isValidAddress', true);
            }}
            addresses={addresses}
            placeholder={t('STORE_NEW_DELIVERY_ENTER_SEARCH_CLIENT')}
          />
        </View>
      </View>
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
              handleChange('address');
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
        <Text style={styles.label}>{t('STORE_NEW_DELIVERY_PHONE_NUMBER')}</Text>
        <FormInput
          autoCorrect={false}
          keyboardType="phone-pad"
          returnKeyType="done"
          onChangeText={value => handleChangeTelephone(value)}
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
  label: {
    marginBottom: 8,
    fontWeight: '600',
  },
  optional: {
    fontWeight: '400',
    opacity: 0.7,
    fontSize: 12,
  },
  formGroup: {
    marginBottom: 10,
  },
  errorText: {
    color: '#FF4136',
    marginTop: 5,
  },
});
