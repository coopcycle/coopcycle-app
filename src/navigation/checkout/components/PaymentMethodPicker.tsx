import { Icon, Text, useColorMode } from 'native-base';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import Foundation from 'react-native-vector-icons/Foundation';
import Svg, { Path, G } from 'react-native-svg';
import PaymentMethodIcon from './PaymentMethodIcon'

const styles = StyleSheet.create({
  heading: {
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});


const PaymentMethodPicker = ({ methods, onSelect, disabled }) => {
  const { t } = useTranslation();
  const { colorMode } = useColorMode();

  return (
    <View>
      <Text style={styles.heading}>{t('SELECT_PAYMENT_METHOD')}</Text>
      <View>
        {methods.map(method => (
          <Pressable
            disabled={disabled}
            key={method.type}
            testID={`paymentMethod-${method.type}`}
            style={[
              styles.button,
              { backgroundColor: colorMode === 'dark' ? '#3f3f3f' : '#f7f7f7' },
            ]}
            onPress={() => onSelect(method.type)}>
            <PaymentMethodIcon type={ method.type } />
            <Text>{t(`PAYMENT_METHOD.${method.type}`)}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default PaymentMethodPicker;
