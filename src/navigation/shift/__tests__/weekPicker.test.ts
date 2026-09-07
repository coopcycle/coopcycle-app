import { shiftUiReducer } from '../../../redux/Shift/uiReducer';
import {
  setShiftRemindersEnabled,
  setShiftSelectedWeek,
} from '../../../redux/Shift/actions';
import {
  addWeeks,
  filterHolidayRequestsByWeek,
  getReminderShiftsRange,
  getWeekRange,
  getWeekStart,
  isShiftPast,
} from '../utils';

// Wednesday 2026-07-01; the ISO week runs Mon 2026-06-29 .. Sun 2026-07-05.
// Frozen with Jest's own fake timers rather than a new dependency; the utils
// under test read the clock through `moment()`, which uses `Date.now()`.
const NOW = '2026-07-01T10:00:00+02:00';

beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date(NOW));
});

afterEach(() => {
  jest.useRealTimers();
});

describe('getWeekStart', () => {
  it('returns the Monday of the current week by default', () => {
    expect(getWeekStart()).toBe('2026-06-29');
  });

  it('returns the Monday of the week containing a given date', () => {
    expect(getWeekStart('2026-07-05')).toBe('2026-06-29');
    expect(getWeekStart('2026-07-06')).toBe('2026-07-06');
  });

  it('is idempotent on a Monday', () => {
    expect(getWeekStart(getWeekStart())).toBe(getWeekStart());
  });
});

describe('getWeekRange', () => {
  it('spans Monday to Sunday of the given week', () => {
    expect(getWeekRange('2026-06-29')).toEqual({
      after: '2026-06-29',
      before: '2026-07-05',
    });
  });

  it('normalises a mid-week date to its week', () => {
    expect(getWeekRange('2026-07-01')).toEqual({
      after: '2026-06-29',
      before: '2026-07-05',
    });
  });

  it('handles a week spanning two months', () => {
    expect(getWeekRange('2026-08-31')).toEqual({
      after: '2026-08-31',
      before: '2026-09-06',
    });
  });

  it('reaches into the past, which is the point of the picker', () => {
    expect(getWeekRange(addWeeks(getWeekStart(), -3))).toEqual({
      after: '2026-06-08',
      before: '2026-06-14',
    });
  });
});

describe('addWeeks', () => {
  it('steps backwards and forwards a week at a time', () => {
    expect(addWeeks('2026-06-29', -1)).toBe('2026-06-22');
    expect(addWeeks('2026-06-29', 1)).toBe('2026-07-06');
  });

  it('crosses a year boundary', () => {
    expect(addWeeks('2026-12-28', 1)).toBe('2027-01-04');
  });

  it('round-trips', () => {
    expect(addWeeks(addWeeks('2026-06-29', -5), 5)).toBe('2026-06-29');
  });
});

describe('getReminderShiftsRange', () => {
  // Reminders must not follow the week picker, otherwise browsing to a past
  // week would drop reminders for upcoming shifts.
  it('always starts at the current week, looking forward', () => {
    expect(getReminderShiftsRange()).toEqual({
      after: '2026-06-29',
      before: '2026-08-24',
    });
  });
});

describe('isShiftPast', () => {
  const shift = (endsAt: string) => ({ endsAt });

  it('is true for a shift that already ended', () => {
    expect(isShiftPast(shift('2026-07-01T09:00:00+02:00'))).toBe(true);
  });

  it('is false for a shift still running', () => {
    expect(isShiftPast(shift('2026-07-01T11:00:00+02:00'))).toBe(false);
  });

  it('is false for a future shift', () => {
    expect(isShiftPast(shift('2026-07-08T09:00:00+02:00'))).toBe(false);
  });
});

describe('filterHolidayRequestsByWeek', () => {
  const request = (startDate: string, endDate: string) => ({
    '@id': `/api/holiday_requests/${startDate}`,
    startDate,
    endDate,
  });

  const week = { after: '2026-06-29', before: '2026-07-05' } as const;

  it('keeps a request fully inside the week', () => {
    const r = request('2026-06-30', '2026-07-02');
    expect(filterHolidayRequestsByWeek([r], week)).toEqual([r]);
  });

  it('drops a request entirely before the week', () => {
    expect(
      filterHolidayRequestsByWeek([request('2026-06-01', '2026-06-05')], week),
    ).toEqual([]);
  });

  it('drops a request entirely after the week', () => {
    expect(
      filterHolidayRequestsByWeek([request('2026-07-06', '2026-07-10')], week),
    ).toEqual([]);
  });

  // Overlap semantics, matching the server's HolidayRequestDateFilter: a
  // holiday spanning several weeks shows up in each of them.
  it('keeps a request overlapping only the start of the week', () => {
    const r = request('2026-06-20', '2026-06-29');
    expect(filterHolidayRequestsByWeek([r], week)).toEqual([r]);
  });

  it('keeps a request overlapping only the end of the week', () => {
    const r = request('2026-07-05', '2026-07-20');
    expect(filterHolidayRequestsByWeek([r], week)).toEqual([r]);
  });

  it('keeps a request spanning the whole week', () => {
    const r = request('2026-06-01', '2026-08-01');
    expect(filterHolidayRequestsByWeek([r], week)).toEqual([r]);
  });

  it('copes with datetime values, not just plain dates', () => {
    const r = request('2026-06-30T00:00:00+02:00', '2026-07-02T00:00:00+02:00');
    expect(filterHolidayRequestsByWeek([r], week)).toEqual([r]);
  });

  // The API sends midnight in the *instance's* timezone. Re-parsing that in
  // the device's timezone can land on the previous day, which would drop a
  // request from the week it actually belongs to.
  it('uses the calendar date as sent, not the device timezone', () => {
    // Monday of the week, at midnight in a UTC+13 instance
    const r = request('2026-06-29T00:00:00+13:00', '2026-06-29T00:00:00+13:00');
    expect(filterHolidayRequestsByWeek([r], week)).toEqual([r]);
  });

  it('excludes the day just before the week regardless of offset', () => {
    const r = request('2026-06-28T00:00:00-11:00', '2026-06-28T00:00:00-11:00');
    expect(filterHolidayRequestsByWeek([r], week)).toEqual([]);
  });

  it('returns an empty list unchanged', () => {
    expect(filterHolidayRequestsByWeek([], week)).toEqual([]);
  });
});

describe('shiftUiReducer | selectedWeek', () => {
  // Stored as null so it is resolved on read; see selectShiftSelectedWeek.
  it('starts out following the current week', () => {
    const state = shiftUiReducer(undefined, { type: '@@INIT' });

    expect(state.selectedWeek).toBeNull();
  });

  it('goes back to following the current week', () => {
    const state = shiftUiReducer(
      { remindersEnabled: true, selectedWeek: '2026-06-08' },
      setShiftSelectedWeek(null),
    );

    expect(state.selectedWeek).toBeNull();
  });

  it('stores the picked week', () => {
    const state = shiftUiReducer(
      undefined,
      setShiftSelectedWeek('2026-06-08'),
    );

    expect(state.selectedWeek).toBe('2026-06-08');
  });

  it('leaves the reminders setting alone', () => {
    const state = shiftUiReducer(
      { remindersEnabled: false, selectedWeek: null },
      setShiftSelectedWeek('2026-06-08'),
    );

    expect(state).toEqual({
      remindersEnabled: false,
      selectedWeek: '2026-06-08',
    });
  });

  it('leaves the picked week alone when toggling reminders', () => {
    const state = shiftUiReducer(
      { remindersEnabled: true, selectedWeek: '2026-06-08' },
      setShiftRemindersEnabled(false),
    );

    expect(state).toEqual({
      remindersEnabled: false,
      selectedWeek: '2026-06-08',
    });
  });
});
