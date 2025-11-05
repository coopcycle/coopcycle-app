import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@/components/ui/text';
import AddressAutocomplete from '@/src/components/AddressAutocomplete';
import { primaryColor } from '@/src/styles/common';
import i18n from '@/src/i18n';
import Task from '@/src/types/task';

interface AddressSectionProps {
  address;
  validAddress: boolean;
  autocompleteProps;
  onSelectAddress: (addr, setFieldValue, setAddress, setValidAddress) => void;
  task?: Task;
  formProps;
}

export const AddressSection: React.FC<AddressSectionProps> = React.memo(({
  address,
  validAddress,
  autocompleteProps,
  onSelectAddress,
  task,
  formProps
}) => {
  const { t } = i18n;
  const { handleChange, handleBlur, errors, touched, setFieldValue, setValidAddress, setAddress } = formProps;

  return (
    <View style={[styles.formGroup, { zIndex: 1 }]}>
      <Text style={styles.label}>
        {t('STORE_NEW_DELIVERY_ADDRESS')}
        {validAddress}
      </Text>
      <View style={styles.autocompleteWrapper}>
        <AddressAutocomplete
          key={address?.streetAddress ?? `address-${task?.id}`}
          addresses={[]}
          onChangeText={() => {
            if (validAddress) setValidAddress(false);
            handleChange('address');
          }}
          onBlur={handleBlur('address')}
          value={address}
          onSelectAddress={e => onSelectAddress(e, setFieldValue, setAddress, setValidAddress)}
          containerStyle={styles.addressContainer}
          style={styles.addressInput}
          {...autocompleteProps}
          placeholder={t('ENTER_ADDRESS')}
          _focus={{ borderColor: primaryColor }}
          testID="delivery__dropoff__address"
          initialValue={task?.address?.streetAddress}
        />
      </View>
      {errors.address && !validAddress && touched.address && (
        <Text style={styles.errorText}>{errors.address}</Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  formGroup: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontWeight: '600',
    fontSize: 14,
  },
  autocompleteWrapper: {
    height: 40,
  },
  addressContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  addressInput: {
    borderRadius: 0,
    padding: 10,
    borderWidth: 0,
    paddingLeft: 10,
  },
  errorText: {
    color: '#FF4136',
    marginTop: 4,
    fontSize: 12,
  },
});