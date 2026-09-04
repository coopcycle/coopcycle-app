import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  View,
} from 'react-native';
import { moment } from '@/src/shared';
import { Badge, BadgeText } from '@/components/ui/badge';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import ItemSeparator from '../../components/ItemSeparator';
import {
  useDeleteHolidayRequestMutation,
  useGetMyHolidayRequestsQuery,
} from '../../redux/api/slice';
import { HolidayRequest, HolidayRequestStatus } from '../../redux/api/types';
import { showAlert } from '../../utils/alert';

const statusAction: Record<HolidayRequestStatus, 'warning' | 'success' | 'error'> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'error',
};

const statusLabelKey: Record<HolidayRequestStatus, string> = {
  pending: 'HOLIDAY_STATUS_PENDING',
  approved: 'HOLIDAY_STATUS_APPROVED',
  rejected: 'HOLIDAY_STATUS_REJECTED',
};

export default function HolidayRequestsPage() {
  const { t } = useTranslation();

  const {
    data: holidayRequests = [],
    isLoading,
    isFetching,
    refetch,
  } = useGetMyHolidayRequestsQuery();

  const [deleteHolidayRequest] = useDeleteHolidayRequestMutation();

  const onDelete = (holidayRequest: HolidayRequest) => {
    Alert.alert(
      t('HOLIDAY_DELETE_CONFIRM_TITLE'),
      t('HOLIDAY_DELETE_CONFIRM_MESSAGE'),
      [
        { text: t('CANCEL'), style: 'cancel' },
        {
          text: t('DELETE'),
          style: 'destructive',
          onPress: () =>
            deleteHolidayRequest(holidayRequest['@id'])
              .unwrap()
              .catch(showAlert),
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        contentContainerStyle={
          holidayRequests.length === 0
            ? { flex: 1, justifyContent: 'center' }
            : undefined
        }
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} />
        }
        data={holidayRequests}
        keyExtractor={item => `${item['@id']}`}
        ItemSeparatorComponent={ItemSeparator}
        renderItem={({ item }) => (
          <Box className="px-3 py-3">
            <HStack className="justify-between items-center">
              <VStack space="xs" className="flex-1">
                <Text className="font-bold">
                  {moment(item.startDate).format('LL')}
                  {' — '}
                  {moment(item.endDate).format('LL')}
                </Text>
                {!!item.comment && <Text>{item.comment}</Text>}
              </VStack>
              <VStack space="xs" className="items-end">
                <Badge action={statusAction[item.status]}>
                  <BadgeText>{t(statusLabelKey[item.status])}</BadgeText>
                </Badge>
                {item.status === 'pending' && (
                  <Pressable onPress={() => onDelete(item)}>
                    <Text className="text-error-600">{t('CANCEL')}</Text>
                  </Pressable>
                )}
              </VStack>
            </HStack>
          </Box>
        )}
        ListEmptyComponent={
          <Text className="text-center">{t('NO_HOLIDAY_REQUESTS')}</Text>
        }
      />
    </View>
  );
}
