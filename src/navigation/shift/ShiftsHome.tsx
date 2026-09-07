import React from 'react';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { FlatList, TouchableOpacity } from 'react-native';
import { ArrowRightIcon, Icon } from '@/components/ui/icon';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import ItemSeparator from '../../components/ItemSeparator';

type Props = {
  navigation: NavigationProp<ParamListBase>;
};

export default function ShiftsHome({ navigation }: Props) {
  const { t } = useTranslation();

  const data = [
    {
      label: t('MY_SHIFTS'),
      onPress: () => navigation.navigate('MyShifts'),
    },
    {
      label: t('OPEN_SHIFTS'),
      onPress: () => navigation.navigate('OpenShifts'),
    },
    {
      label: t('HOLIDAY_REQUESTS'),
      onPress: () => navigation.navigate('HolidayRequests'),
    },
  ];

  return (
    <FlatList
      data={data}
      keyExtractor={(item, index) => `shifts-home-${index}`}
      ItemSeparatorComponent={ItemSeparator}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={item.onPress}>
          <Box className="px-3 py-3">
            <HStack className="justify-between items-center">
              <Text>{item.label}</Text>
              <Icon as={ArrowRightIcon} />
            </HStack>
          </Box>
        </TouchableOpacity>
      )}
    />
  );
}
