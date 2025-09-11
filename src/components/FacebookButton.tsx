import { Button, ButtonText, ButtonIcon } from '@/components/ui/button';
import React from 'react';
import { useTranslation } from 'react-i18next';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default ({ onPress }) => {
  const { t } = useTranslation();

  return (
    <Button
      style={{ backgroundColor: "#4267B2" }}
      size="sm"
      onPress={onPress}>
      <ButtonIcon as={ () => <FontAwesome name="facebook-official" size={16} /> } />
      <ButtonText>{t('CONNECT_WITH_FACEBOOK')}</ButtonText>
    </Button>
  );
};
