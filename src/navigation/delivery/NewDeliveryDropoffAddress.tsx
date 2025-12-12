import React from 'react';
import { IconCircleArrowDownFilled } from '@tabler/icons-react-native';
import { Formik, FormikErrors } from 'formik';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import _ from 'lodash';
import { Text } from '@/components/ui/text';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import {
  useBackgroundContainerColor,
  usePrimaryColor,
} from '../../styles/theme';
import ModalFormWrapper from './ModalFormWrapper';
import { NewDeliveryDropoffAddressFormValues } from '@/src/navigation/delivery/utils';
import { AddressFields } from '@/src/navigation/delivery/components/AddressFields';

function NewDeliveryDropoffAddress({ navigation, route }) {

  const backgroundColor = useBackgroundContainerColor();
  const primaryColor = usePrimaryColor();

  const country = useSelector(state =>
    state.app.settings.country.toUpperCase(),
  );

  const { t } = useTranslation();

  function validate(values: NewDeliveryDropoffAddressFormValues) {
    const errors: FormikErrors<NewDeliveryDropoffAddressFormValues> = {};

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

    if (!values.isValidAddress) {
      errors.address = t('STORE_NEW_DELIVERY_ADDRESS_HELP');
    }

    return errors;
  }

  const initialValues: NewDeliveryDropoffAddressFormValues = {
    address: undefined,
    businessName: '',
    contactName: '',
    telephone: '',
    description: '',
  };

  function submit(values: NewDeliveryDropoffAddressFormValues) {
    const dropoff = {
      address: values.address,
      businessName: values.businessName,
      contactName: values.contactName,
      telephone: parsePhoneNumberFromString(values.telephone, country).format(
        'E.164',
      ),
      description: values.description,
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
        handleSubmit,
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
          <AddressFields />
        </ModalFormWrapper>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
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

export default NewDeliveryDropoffAddress;
