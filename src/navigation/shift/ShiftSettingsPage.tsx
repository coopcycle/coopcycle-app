import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Platform, View } from 'react-native';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Switch } from '@/components/ui/switch';
import { selectShiftRemindersEnabled } from '../../redux/Shift/selectors';
import { setShiftRemindersEnabled } from '../../redux/Shift/actions';

export default function ShiftSettingsPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const remindersEnabled = useSelector(selectShiftRemindersEnabled);

  return (
    <View className="p-2">
      <Box className="px-3 py-3">
        <HStack className="items-center justify-between">
          <Text>{t('SHIFT_REMINDERS_ENABLED')}</Text>
          <Switch
            value={remindersEnabled}
            onValueChange={value => dispatch(setShiftRemindersEnabled(value))}
            style={{
              marginRight: Platform.OS === 'ios' ? 12 : 0,
            }}
          />
        </HStack>
        <Text className="text-secondary-500 mt-1">
          {t('SHIFT_REMINDERS_ENABLED_HELP')}
        </Text>
      </Box>
    </View>
  );
}
