import React from 'react';
import { Icon } from '@/components/ui/icon';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { Calendar, RefreshCw } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

const DatePickerHeader = ({ date, onCalendarClick, onTodayClick }) => {

  const { t } = useTranslation();

  return (
    <HStack className="w-full">
      <Pressable className="w-1/2" onPress={onCalendarClick}>
        <HStack
          className="items-center justify-between p-4">
          <Icon as={Calendar} />
          <Text size="lg" className="text-right">{date.format('L')}</Text>
        </HStack>
      </Pressable>
      <Pressable className="w-1/2" onPress={onTodayClick}>
        <HStack
          className="items-center justify-between p-4 bg-success-200">
          <Icon as={RefreshCw} />
          <Text size="lg">{t('TODAY')}</Text>
        </HStack>
      </Pressable>
    </HStack>
  );
}

export default DatePickerHeader;
