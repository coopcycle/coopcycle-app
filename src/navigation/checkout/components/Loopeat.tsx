import { useNavigation } from '@react-navigation/native';
import { Button, ButtonIcon } from '@/components/ui/button';
import { Icon, SettingsIcon, CheckCircleIcon, AlertCircleIcon, RepeatIcon } from '@/components/ui/icon';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import React from 'react';
import { useTranslation } from 'react-i18next';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Menu = ({ leftIcon, rightIcon, text }) => {

  const navigation = useNavigation();

  return (
    <HStack className="p-3 justify-between items-center">
      <Icon as={leftIcon} size="xl" />
      <Text>{text}</Text>
      <Button variant="link" onPress={() => navigation.navigate('CheckoutLoopeat')}>
        <ButtonIcon as={rightIcon} />
      </Button>
    </HStack>
  )
}

function Loopeat({ requiredAmount, creditsCountCents, returnsTotalAmount }) {

  const { t } = useTranslation();

  const missingAmount =
    requiredAmount - (creditsCountCents + returnsTotalAmount);

  if (missingAmount > 0) {
    return (
      <Menu
        leftIcon={AlertCircleIcon}
        rightIcon={RepeatIcon}
        text={t('CHECKOUT_LOOPEAT_INSUFFICIENT_WALLET_AMOUNT')} />
    );
  }

  return (
    <Menu
      leftIcon={CheckCircleIcon}
      rightIcon={SettingsIcon}
      text={t('CHECKOUT_LOOPEAT_OPTION_ENABLED')} />
  );
}

export default Loopeat;
