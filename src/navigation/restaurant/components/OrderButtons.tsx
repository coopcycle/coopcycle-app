import { PhoneNumberFormat, PhoneNumberUtil } from 'google-libphonenumber';
import { Button, ButtonText, ButtonIcon } from '@/components/ui/button';
import { Printer, PrinterCheck, PhoneOutgoing } from 'lucide-react-native'
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { phonecall } from 'react-native-communications';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const phoneNumberUtil = PhoneNumberUtil.getInstance();

const Comp = ({
  order,
  isPrinterConnected,
  onPrinterClick,
  printOrder,
  disablePrintButton,
}) => {
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
            onPress={printOrder}
            isDisabled={disablePrintButton}>
            <ButtonText>{t('RESTAURANT_ORDER_PRINT')}</ButtonText>
            <ButtonIcon as={PrinterCheck} />
          </Button>
        )}
        {!isPrinterConnected && (
          <Button
            onPress={onPrinterClick}>
            <ButtonText>{t('RESTAURANT_ORDER_PRINT')}</ButtonText>
            <ButtonIcon as={Printer} />
          </Button>
        )}
      </View>
      <View style={{ width: '50%', paddingLeft: 5 }}>
        {isPhoneValid && (
          <Button
            success
            onPress={() => phonecall(order.customer.telephone, true)}>
            <ButtonIcon as={PhoneOutgoing} />
            <ButtonText>{phoneNumberUtil.format(phoneNumber, PhoneNumberFormat.NATIONAL)}</ButtonText>
          </Button>
        )}
      </View>
    </View>
  );
};

export default Comp;
