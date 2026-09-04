import React from 'react';
import { moment } from '@/src/shared';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Shift, ShiftActivity } from '../../../redux/api/types';
import { getActivityColor, getActivityLabel } from '../utils';

type Props = {
  shift: Shift;
  activities: ShiftActivity[];
  showDate?: boolean;
  children?: React.ReactNode;
};

export default function ShiftListItem({
  shift,
  activities,
  showDate = true,
  children,
}: Props) {
  const color = getActivityColor(activities, shift.activity);
  const label = getActivityLabel(activities, shift.activity);

  return (
    <Box className="px-3 py-3">
      <HStack className="justify-between items-center">
        <VStack className="flex-1" space="xs">
          <HStack className="items-center" space="xs">
            <Box
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: color || '#999999',
              }}
            />
            <Text className="font-bold">{label}</Text>
          </HStack>
          {showDate && <Text>{moment(shift.startsAt).format('LL')}</Text>}
          <Text className="text-secondary-500">
            {moment(shift.startsAt).format('LT')} —{' '}
            {moment(shift.endsAt).format('LT')}
          </Text>
        </VStack>
        {children ? <Box>{children}</Box> : null}
      </HStack>
    </Box>
  );
}
