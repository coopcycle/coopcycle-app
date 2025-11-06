import React from 'react';
import { View } from 'react-native';
import { FormField } from './FormField';
import ClientListInput from '../../delivery/components/ClientListInput';
import Task from '@/src/types/task';

interface ClientSearchSectionProps {
  t: (key: string) => string;
  addresses: unknown[];
  task?: Partial<Task>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  styles: Record<string, unknown>;
  onSelectAddress: (address: unknown) => void;
}

export const ClientSearchSection: React.FC<ClientSearchSectionProps> = ({
  t,
  addresses,
  task,
  errors,
  touched,
  styles,
  onSelectAddress,
}) => (
  <View style={[styles.formGroup, { zIndex: 2 }]}>
    <FormField
      label={t('STORE_NEW_DELIVERY_SEARCH_CLIENT')}
      optional
      error={errors.searchClient}
      touched={touched.searchClient}>
      <View style={styles.autocompleteWrapper}>
        <ClientListInput
          onSelectAddress={onSelectAddress}
          addresses={addresses}
          placeholder={t('STORE_NEW_DELIVERY_ENTER_SEARCH_CLIENT')}
          initialValue={
            task?.address
              ? {
                  contactName: task.address.contactName,
                  telephone: task.address.telephone,
                  name: task.address.name,
                  description: task.address.description,
                  streetAddress: task.address.streetAddress,
                  geo: task.address.geo,
                }
              : null
          }
        />
      </View>
    </FormField>
  </View>
);