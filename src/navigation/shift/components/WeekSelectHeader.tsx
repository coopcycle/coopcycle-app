import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { moment } from '@/src/shared';

import { Icon, ArrowLeftIcon, ArrowRightIcon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import {
  dateSelectHeaderHeight,
  primaryColor,
  whiteColor,
} from '../../../styles/common';
import { setShiftSelectedWeek } from '../../../redux/Shift/actions';
import { selectShiftSelectedWeek } from '../../../redux/Shift/selectors';
import { DateOnlyString } from '../../../utils/date-types';
import { addWeeks, getWeekRange, getWeekStart } from '../utils';

const styles = StyleSheet.create({
  header: {
    backgroundColor: primaryColor,
    height: dateSelectHeaderHeight,
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrow: {
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  label: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelText: {
    color: whiteColor,
    fontSize: 16,
  },
  thisWeekContainer: {
    backgroundColor: whiteColor,
    alignItems: 'center',
    paddingVertical: 10,
  },
  thisWeekText: {
    color: primaryColor,
    fontSize: 16,
    fontWeight: '300',
  },
});

/**
 * Week picker shared by the shift screens.
 *
 * The selected week lives in redux rather than in each screen, so moving
 * between My Shifts / Open Shifts / Holidays keeps the week you were looking
 * at. Tapping the label jumps back to the current week, and a "This week"
 * shortcut appears only while you are away from it — keeping the chrome to a
 * single row in the common case.
 */
export default function WeekSelectHeader() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const selectedWeek = useSelector(selectShiftSelectedWeek) as DateOnlyString;

  const currentWeek = getWeekStart();
  const isCurrentWeek = selectedWeek === currentWeek;

  const goToWeek = (weekStart: DateOnlyString) =>
    dispatch(setShiftSelectedWeek(weekStart));

  // Clearing the override (rather than storing today's Monday) keeps the
  // screens following the current week as time passes.
  const goToCurrentWeek = () => dispatch(setShiftSelectedWeek(null));

  const { after, before } = getWeekRange(selectedWeek);

  // "29 Jun – 5 Jul 2026", dropping the repeated month/year where it is
  // implied, so the label stays on one line on a narrow phone.
  const start = moment(after);
  const end = moment(before);
  const sameMonth = start.isSame(end, 'month');
  const label = `${start.format(sameMonth ? 'D' : 'D MMM')} – ${end.format(
    'D MMM YYYY',
  )}`;

  return (
    <View>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.arrow}
          onPress={() => goToWeek(addWeeks(selectedWeek, -1))}
          accessibilityRole="button"
          accessibilityLabel={t('SHIFT_PREVIOUS_WEEK') ?? undefined}
          testID="shiftWeek:previous"
        >
          <Icon as={ArrowLeftIcon} size="xl" style={{ color: whiteColor }} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.label}
          onPress={goToCurrentWeek}
          accessibilityRole="button"
          accessibilityLabel={label}
          testID="shiftWeek:label"
        >
          <Text style={styles.labelText}>{label}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.arrow}
          onPress={() => goToWeek(addWeeks(selectedWeek, 1))}
          accessibilityRole="button"
          accessibilityLabel={t('SHIFT_NEXT_WEEK') ?? undefined}
          testID="shiftWeek:next"
        >
          <Icon as={ArrowRightIcon} size="xl" style={{ color: whiteColor }} />
        </TouchableOpacity>
      </View>
      {!isCurrentWeek && (
        <TouchableOpacity
          style={styles.thisWeekContainer}
          onPress={goToCurrentWeek}
          accessibilityRole="button"
          testID="shiftWeek:thisWeek"
        >
          <Text style={styles.thisWeekText}>{t('SHIFT_THIS_WEEK')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
