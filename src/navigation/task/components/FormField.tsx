import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@/components/ui/text';
import i18n from '@/src/i18n';

interface FormFieldProps {
  label: string;
  optional?: boolean;
  error?: string;
  touched?: boolean;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  optional = false,
  error,
  touched,
  children
}) => (
  <View style={styles.formGroup}>
    <Text style={styles.label}>
      {label}
      {optional && <Text style={styles.optional}> ({i18n.t('OPTIONAL')})</Text>}
    </Text>
    {children}
    {error && touched && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

const styles = StyleSheet.create({
  formGroup: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontWeight: '600',
    fontSize: 14,
  },
  optional: {
    fontWeight: '400',
    opacity: 0.7,
    fontSize: 12,
  },
  errorText: {
    color: '#FF4136',
    marginTop: 4,
    fontSize: 12,
  },
});