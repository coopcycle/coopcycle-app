import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { TriangleAlert } from 'lucide-react-native'
import { Button, ButtonText } from '@/components/ui/button';
import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectCustomBuild } from '../redux/App/selectors';
import Server from './account/components/Server';

export default function LoadingError() {
  const customBuild = useSelector(selectCustomBuild);

  const { t } = useTranslation();

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Icon as={TriangleAlert} />
      <Text
        style={{
          marginBottom: 10,
        }}>
        {t('NET_FAILED')}
      </Text>
      <Button block onPress={() => this.load()}>
        <ButtonText>{t('RETRY')}</ButtonText>
      </Button>
      <View style={{ marginVertical: 20 }}>
        {customBuild ? null : <Server />}
      </View>
    </View>
  );
}
