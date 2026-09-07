import { moment } from '@/src/shared';
import { DateOnlyString } from '../../utils/date-types';
import { HolidayRequest, Shift, ShiftActivity } from '../../redux/api/types';

// How far ahead the reminder sync looks. This is *not* what the screens show:
// they page week by week (see `getWeekRange`), while reminders always have to
// be scheduled from now onward regardless of which week is being browsed.
const REMINDER_WEEKS_AHEAD = 8;

export type WeekRange = {
  after: DateOnlyString;
  before: DateOnlyString;
};

/**
 * The range the reminder sync fetches: this week plus the next few.
 *
 * Deliberately independent of the week picker — browsing to a past week must
 * not reschedule (or drop) reminders for upcoming shifts.
 */
export function getReminderShiftsRange(): WeekRange {
  const after = moment().startOf('isoWeek');
  const before = moment(after).add(REMINDER_WEEKS_AHEAD, 'weeks');

  return {
    after: after.format('YYYY-MM-DD') as DateOnlyString,
    before: before.format('YYYY-MM-DD') as DateOnlyString,
  };
}

/** Monday of the week containing `date` (defaults to today). */
export function getWeekStart(date?: moment.MomentInput): DateOnlyString {
  return moment(date).startOf('isoWeek').format('YYYY-MM-DD') as DateOnlyString;
}

/**
 * Monday..Sunday of the week starting at `weekStart`.
 *
 * `before` is the Sunday, matching what the backend expects: both
 * MyShiftsProvider and OpenShiftsProvider add a day to it themselves so the
 * whole last day is covered.
 */
export function getWeekRange(weekStart: DateOnlyString): WeekRange {
  const after = moment(weekStart).startOf('isoWeek');
  const before = moment(after).add(6, 'days');

  return {
    after: after.format('YYYY-MM-DD') as DateOnlyString,
    before: before.format('YYYY-MM-DD') as DateOnlyString,
  };
}

/** `weekStart` shifted by `delta` weeks; used by the week picker's arrows. */
export function addWeeks(
  weekStart: DateOnlyString,
  delta: number,
): DateOnlyString {
  return moment(weekStart)
    .add(delta, 'weeks')
    .format('YYYY-MM-DD') as DateOnlyString;
}

/** True once the shift's end is in the past — it can no longer be applied to. */
export function isShiftPast(shift: Pick<Shift, 'endsAt'>): boolean {
  return moment(shift.endsAt).isBefore(moment());
}

/**
 * Holiday requests overlapping the week, mirroring the server's
 * HolidayRequestDateFilter: a request counts as soon as it overlaps, so one
 * spanning several weeks shows up in each of them.
 *
 * Applied client-side *as well as* sent as query params, on purpose. An
 * instance that predates week filtering on /api/me/holiday_requests ignores
 * the params and answers with the whole history; filtering here keeps the
 * screen showing the week the user actually picked either way.
 */
export function filterHolidayRequestsByWeek<
  T extends Pick<HolidayRequest, 'startDate' | 'endDate'>,
>(requests: T[], { after, before }: WeekRange): T[] {
  return requests.filter(
    request =>
      toDateOnly(request.endDate) >= after &&
      toDateOnly(request.startDate) <= before,
  );
}

/**
 * The calendar date a holiday boundary falls on.
 *
 * Read off the string rather than parsed, on purpose: the API serializes these
 * dates as datetimes at midnight in the *instance's* timezone, so
 * `moment(value)` would re-interpret them in the device's timezone and could
 * land a day earlier or later. Holiday boundaries are whole days, so the
 * literal date is the value we want.
 */
function toDateOnly(value: string): string {
  return String(value).slice(0, 10);
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
