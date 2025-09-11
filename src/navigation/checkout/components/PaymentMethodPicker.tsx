import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, useColorScheme } from 'react-native';
import Foundation from 'react-native-vector-icons/Foundation';
import Svg, { Path, G } from 'react-native-svg';
import PaymentMethodIcon from './PaymentMethodIcon';

const PaymentMethodPicker = ({ methods, onSelect, disabled }) => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();

  return (
    <View>
      <Text className="mb-4 text-center">{t('SELECT_PAYMENT_METHOD')}</Text>
      <View>
        {methods.map(method => (
          <Pressable
            className="flex-row items-center justify-between p-4 mb-2"
            disabled={disabled}
            key={method.type}
            testID={`paymentMethod-${method.type}`}
            style={[
              { backgroundColor: colorScheme === 'dark' ? '#3f3f3f' : '#f7f7f7' },
            ]}
            onPress={() => onSelect(method.type)}>
            <PaymentMethodIcon type={method.type} />
            <Text>{t(`PAYMENT_METHOD.${method.type}`)}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default PaymentMethodPicker;
