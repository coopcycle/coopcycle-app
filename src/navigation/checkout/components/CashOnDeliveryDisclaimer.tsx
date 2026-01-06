import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { BanknoteArrowUp } from 'lucide-react-native';
import { Center } from '@/components/ui/center';

export const CashOnDeliveryDisclaimer = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.alert}>
      <Center className="mb-3">
        <Icon as={BanknoteArrowUp} size="xl" />
      </Center>
      <Text>{t('CASH_ON_DELIVERY_DISCLAIMER')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  alert: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#000000',
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
});
