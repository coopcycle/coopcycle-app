import { Icon } from '@/components/ui/icon';
import { Center } from '@/components/ui/center';
import { Text } from '@/components/ui/text';
import { Frown } from 'lucide-react-native'
import React from 'react';
import { useTranslation } from 'react-i18next';

const Offline = () => {

  const { t } = useTranslation();

  return (
    <Center flex={1}>
      <Icon as={Frown} size={32} className="mb-2" />
      <Text>{t('OFFLINE')}</Text>
    </Center>
  );
};

export default Offline;
