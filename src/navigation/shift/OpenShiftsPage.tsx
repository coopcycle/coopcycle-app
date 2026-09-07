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
import { Badge, BadgeText } from '@/components/ui/badge';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import ItemSeparator from '../../components/ItemSeparator';
import { selectUser } from '../../redux/App/selectors';
import {
  useApplyToShiftMutation,
  useGetOpenShiftsQuery,
  useGetShiftActivitiesQuery,
  useUnapplyFromShiftMutation,
} from '../../redux/api/slice';
import { Shift, ShiftActivity } from '../../redux/api/types';
import { showAlert } from '../../utils/alert';
import ShiftListItem from './components/ShiftListItem';
import WeekSelectHeader from './components/WeekSelectHeader';
import { selectShiftSelectedWeek } from '../../redux/Shift/selectors';
import {
  getWeekRange,
  groupShiftsByDay,
  isAssignedToShift,
  isShiftPast,
  isWaitlistedForShift,
} from './utils';

type RowProps = {
  shift: Shift;
  activities: ShiftActivity[];
  username: string;
};

function OpenShiftRow({ shift, activities, username }: RowProps) {
  const { t } = useTranslation();

  const [applyToShift, { isLoading: isApplying }] = useApplyToShiftMutation();
  const [unapplyFromShift, { isLoading: isUnapplying }] =
    useUnapplyFromShiftMutation();

  const assigned = isAssignedToShift(shift, username);
  const waitlisted = isWaitlistedForShift(shift, username);
  const isFull = shift.assignments.length >= shift.slots;
  const isLoading = isApplying || isUnapplying;

  // Now that past weeks are reachable, a shift that is already over must not
  // offer to apply/withdraw: the server does not reject it (see
  // ShiftApplicationManager::apply, which only checks publication and skills),
  // so it would happily record an assignment on a shift that already happened.
  const isPast = isShiftPast(shift);

  const onApply = () => {
    applyToShift(shift['@id']).unwrap().catch(showAlert);
  };

  const onUnapply = () => {
    unapplyFromShift(shift['@id']).unwrap().catch(showAlert);
  };

  return (
    <ShiftListItem shift={shift} activities={activities} showDate={false}>
      <View style={{ alignItems: 'flex-end', gap: 6 }}>
        <Text className="text-secondary-500">
          {t('SHIFT_SLOTS_TAKEN', {
            taken: shift.assignments.length,
            total: shift.slots,
          })}
        </Text>
        {waitlisted && (
          <Badge action="warning">
            <BadgeText>{t('SHIFT_WAITLISTED')}</BadgeText>
          </Badge>
        )}
        {isPast ? (
          <Text className="text-secondary-500">
            {assigned ? t('SHIFT_WORKED') : t('SHIFT_ENDED')}
          </Text>
        ) : assigned || waitlisted ? (
          <Button
            size="sm"
            action="negative"
            onPress={onUnapply}
            disabled={isLoading}
          >
            {isLoading && <ButtonSpinner />}
            <ButtonText>
              {waitlisted ? t('SHIFT_LEAVE_WAITLIST') : t('SHIFT_WITHDRAW')}
            </ButtonText>
          </Button>
        ) : (
          <Button size="sm" onPress={onApply} disabled={isLoading}>
            {isLoading && <ButtonSpinner />}
            <ButtonText>
              {isFull ? t('SHIFT_JOIN_WAITLIST') : t('SHIFT_APPLY')}
            </ButtonText>
          </Button>
        )}
      </View>
    </ShiftListItem>
  );
}

export default function OpenShiftsPage() {
  const { t } = useTranslation();
  const selectedWeek = useSelector(selectShiftSelectedWeek);
  const range = getWeekRange(selectedWeek);
  const username = useSelector(selectUser)?.username ?? '';

  const { data: activities = [] } = useGetShiftActivitiesQuery();
  const {
    data: shifts = [],
    isLoading,
    isFetching,
    refetch,
  } = useGetOpenShiftsQuery(range);

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
            <OpenShiftRow
              shift={item}
              activities={activities}
              username={username}
            />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <Heading size="sm" className="p-2">
              {moment(title).format('LL')}
            </Heading>
          )}
          ItemSeparatorComponent={ItemSeparator}
          ListEmptyComponent={
            <Text className="text-center">{t('NO_OPEN_SHIFTS_THIS_WEEK')}</Text>
          }
        />
      )}
    </View>
  );
}
