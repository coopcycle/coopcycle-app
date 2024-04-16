import { useNavigation } from '@react-navigation/native';
import { HStack, Icon, IconButton, Text } from 'native-base';
import React from 'react';
import { useTranslation } from 'react-i18next';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

function Loopeat({ requiredAmount, creditsCountCents, returnsTotalAmount }) {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const missingAmount =
    requiredAmount - (creditsCountCents + returnsTotalAmount);

  if (missingAmount > 0) {
    return (
      <HStack p="3" justifyContent="space-between" alignItems="center">
        <Icon as={FontAwesome} name="exclamation-triangle" size="sm" />
        <Text>{t('CHECKOUT_LOOPEAT_INSUFFICIENT_WALLET_AMOUNT')}</Text>
        <IconButton
          _icon={{ as: FontAwesome5, name: 'exchange-alt', size: 'sm' }}
          onPress={() => navigation.navigate('CheckoutLoopeat')}
        />
      </HStack>
    );
  }

  return (
    <HStack p="3" justifyContent="space-between" alignItems="center">
      <Icon as={FontAwesome} name="check-circle" size="sm" />
      <Text>{t('CHECKOUT_LOOPEAT_OPTION_ENABLED')}</Text>
      <IconButton
        _icon={{
          as: MaterialCommunityIcons,
          name: 'cog-counterclockwise',
          size: 'md',
        }}
        onPress={() => navigation.navigate('CheckoutLoopeat')}
      />
    </HStack>
  );
}

export default Loopeat;
