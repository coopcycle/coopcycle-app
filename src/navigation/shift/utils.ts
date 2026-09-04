import { moment } from '@/src/shared';
import { DateOnlyString } from '../../utils/date-types';
import { Shift, ShiftActivity } from '../../redux/api/types';

// Shifts are planned week by week on the web dashboard, so a single fetch
// covering "this week onward" is enough for the basic in-app views (no
// week-by-week navigation yet, unlike the dispatcher-facing planning screen).
const WEEKS_AHEAD = 8;

export function getShiftsDateRange(): {
  after: DateOnlyString;
  before: DateOnlyString;
} {
  const after = moment().startOf('isoWeek');
  const before = moment(after).add(WEEKS_AHEAD, 'weeks');

  return {
    after: after.format('YYYY-MM-DD') as DateOnlyString,
    before: before.format('YYYY-MM-DD') as DateOnlyString,
  };
}

export function groupShiftsByDay(shifts: Shift[]): {
  day: string;
  data: Shift[];
}[] {
  const sorted = [...shifts].sort((a, b) =>
    a.startsAt.localeCompare(b.startsAt),
  );

  const days: string[] = [];
  const byDay: Record<string, Shift[]> = {};

  sorted.forEach(shift => {
    const day = moment(shift.startsAt).format('YYYY-MM-DD');
    if (!byDay[day]) {
      byDay[day] = [];
      days.push(day);
    }
    byDay[day].push(shift);
  });

  return days.map(day => ({ day, data: byDay[day] }));
}

export function getActivityLabel(
  activities: ShiftActivity[],
  slug: string,
): string {
  return activities.find(a => a.slug === slug)?.label ?? slug;
}

export function getActivityColor(
  activities: ShiftActivity[],
  slug: string,
): string | null {
  return activities.find(a => a.slug === slug)?.color ?? null;
}

export function isAssignedToShift(shift: Shift, username: string): boolean {
  return shift.assignments.some(a => a.user.username === username);
}

export function isWaitlistedForShift(shift: Shift, username: string): boolean {
  return shift.waitlist.some(e => e.user.username === username);
}
