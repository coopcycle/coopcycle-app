import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { PhoneNumberFormat, PhoneNumberUtil } from 'google-libphonenumber';
import { Button, Icon } from 'native-base';
import { phonecall } from 'react-native-communications';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const phoneNumberUtil = PhoneNumberUtil.getInstance();

const Comp = ({ order, isPrinterConnected, onPrinterClick, printOrder }) => {
  const { t } = useTranslation();

  let phoneNumber;
  let isPhoneValid = false;

  try {
    phoneNumber = phoneNumberUtil.parse(order.customer.telephone);
    isPhoneValid = true;
  } catch (e) {}

  return (
    <View style={{ flexDirection: 'row', paddingHorizontal: 10 }}>
      <View style={{ width: '50%', paddingRight: 5 }}>
        {isPrinterConnected && (
          <Button
            endIcon={<Icon as={FontAwesome} name="print" size="sm" />}
            onPress={printOrder}>
            {t('RESTAURANT_ORDER_PRINT')}
          </Button>
        )}
        {!isPrinterConnected && (
          <Button
            endIcon={<Icon as={FontAwesome} name="print" size="sm" />}
            onPress={onPrinterClick}>
            {t('RESTAURANT_ORDER_PRINT')}
          </Button>
        )}
      </View>
      <View style={{ width: '50%', paddingLeft: 5 }}>
        {isPhoneValid && (
          <Button
            startIcon={<Icon as={FontAwesome} name="phone" size="sm" />}
            success
            onPress={() => phonecall(order.customer.telephone, true)}>
            {phoneNumberUtil.format(phoneNumber, PhoneNumberFormat.NATIONAL)}
          </Button>
        )}
      </View>
    </View>
  );
};

export default Comp;
