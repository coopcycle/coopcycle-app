import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  RefreshControl,
  SectionList,
  View,
} from 'react-native';
import { moment } from '@/src/shared';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import ItemSeparator from '../../components/ItemSeparator';
import {
  useGetMyShiftsQuery,
  useGetShiftActivitiesQuery,
} from '../../redux/api/slice';
import { selectShiftSelectedWeek } from '../../redux/Shift/selectors';
import ShiftListItem from './components/ShiftListItem';
import WeekSelectHeader from './components/WeekSelectHeader';
import { getWeekRange, groupShiftsByDay } from './utils';

export default function MyShiftsPage() {
  const { t } = useTranslation();
  const selectedWeek = useSelector(selectShiftSelectedWeek);
  const range = getWeekRange(selectedWeek);

  const { data: activities = [] } = useGetShiftActivitiesQuery();
  const {
    data: shifts = [],
    isLoading,
    isFetching,
    refetch,
  } = useGetMyShiftsQuery(range);

  const sections = groupShiftsByDay(shifts).map(({ day, data }) => ({
    title: day,
    data,
  }));

  return (
    <View style={{ flex: 1 }}>
      {/* Outside the loading branch, so a slow week can still be navigated away from */}
      <WeekSelectHeader />
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <SectionList
          contentContainerStyle={
            sections.length === 0
              ? { flex: 1, justifyContent: 'center' }
              : undefined
          }
          refreshControl={
            <RefreshControl refreshing={isFetching} onRefresh={refetch} />
          }
          sections={sections}
          keyExtractor={item => `${item['@id']}`}
          renderItem={({ item }) => (
            <ShiftListItem
              shift={item}
              activities={activities}
              showDate={false}
            />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <Heading size="sm" className="p-2">
              {moment(title).format('LL')}
            </Heading>
          )}
          ItemSeparatorComponent={ItemSeparator}
          ListEmptyComponent={
            <Text className="text-center">{t('NO_SHIFTS_THIS_WEEK')}</Text>
          }
        />
      )}
    </View>
  );
}
