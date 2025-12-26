import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { IconCircleArrowUpFilled } from '@tabler/icons-react-native';
import { Formik, FormikErrors } from 'formik';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import _ from 'lodash';
import {
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
} from '@/components/ui/checkbox';
import { CheckIcon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { selectStore } from '../../redux/Delivery/selectors';
import {
  useBackgroundContainerColor,
  usePrimaryColor,
} from '../../styles/theme';
import ModalFormWrapper from './ModalFormWrapper';
import { AddressFields } from '@/src/navigation/delivery/components/AddressFields';
import { NewDeliveryPickupAddressFormValues } from '@/src/navigation/delivery/utils';
import { selectCountry } from '@/src/redux/App/selectors';

function NewDeliveryPickupAddress({ navigation }) {
  const [customAddress, setCustomAddress] = useState(false);

  const backgroundColor = useBackgroundContainerColor();
  const primaryColor = usePrimaryColor();

  const country = useSelector(selectCountry);
  const store = useSelector(selectStore);

  const { t } = useTranslation();

  function validate(values: NewDeliveryPickupAddressFormValues) {
    const errors: FormikErrors<NewDeliveryPickupAddressFormValues> = {};

    if (customAddress) {
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

      if (_.isEmpty(values.contactName)) {
        errors.contactName = t('STORE_NEW_DELIVERY_ERROR.EMPTY_CONTACT_NAME');
      }

      if (!values.isValidAddress) {
        errors.address = t('STORE_NEW_DELIVERY_ADDRESS_HELP');
      }
    }

    return errors;
  }

  const initialValues: NewDeliveryPickupAddressFormValues = {
    address: undefined,
    businessName: '',
    contactName: '',
    telephone: '',
    description: '',
  };

  function submit(values: NewDeliveryPickupAddressFormValues) {
    const pickup = customAddress
      ? {
          address: {
            ...values.address,
            name: values.businessName,
            contactName: values.contactName,
            telephone: parsePhoneNumberFromString(
              values.telephone,
              country,
            ).format('E.164'),
            description: values.description,
          },
        }
      : undefined;

    navigation.navigate('NewDeliveryDropoffAddress', { pickup });
  }

  return (
    <Formik
      initialValues={initialValues}
      validate={validate}
      onSubmit={values => submit(values)}
      validateOnBlur={true}
      validateOnChange={true}
    >
      {({ handleSubmit }) => (
        <ModalFormWrapper handleSubmit={handleSubmit} t={t}>
          <View style={[styles.formGroup, { zIndex: 2 }]}>
            <View style={[styles.header, styles.label]}>
              <IconCircleArrowUpFilled
                size={24}
                fill={primaryColor}
                color={backgroundColor}
                stroke={10}
              />
              <Text>{t('STORE_NEW_DELIVERY_PICKUP_TITLE')}</Text>
            </View>
            <Text style={styles.optional}>
              {t('STORE_NEW_DELIVERY_PICKUP_DESCRIPTION')}
            </Text>
          </View>
          <View style={[styles.formGroup, { zIndex: 2 }]}>
            <Text style={styles.label}>
              {t('STORE_NEW_DELIVERY_PICKUP_DEFAULT_ADDRESS')}
            </Text>
            <Text style={styles.optional}>{store.address.name}</Text>
            <Text>{store.address.streetAddress}</Text>
            <Text>{store.address.telephone}</Text>
          </View>
          <View style={[styles.formGroup, { zIndex: 2 }]}>
            <Checkbox
              value="customAddress"
              isChecked={customAddress}
              onChange={() => setCustomAddress(!customAddress)}
            >
              <CheckboxIndicator>
                <CheckboxIcon as={CheckIcon} />
              </CheckboxIndicator>
              <CheckboxLabel>
                {t('STORE_NEW_DELIVERY_PICKUP_USE_CUSTOM_ADDRESS')}
              </CheckboxLabel>
            </Checkbox>
          </View>
          <View style={customAddress ? {} : styles.disabled}>
            <AddressFields store={store} />
          </View>
        </ModalFormWrapper>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  disabled: {
    display: 'none',
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
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  formGroup: {
    marginBottom: 10,
  },
});

export default NewDeliveryPickupAddress;
