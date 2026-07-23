import moment from 'moment-timezone';

/**
 * The canonical timezone of the server, as returned by `GET /api/settings`.
 *
 * Task timestamps (`doneAfter`/`doneBefore`) are wall-clock times that belong
 * to the store's timezone, not to the device's. Comparing them against "today"
 * with the device timezone breaks for any user who is not physically in the
 * same timezone as the store they work for.
 *
 * Falls back to the device timezone when settings have not been fetched yet
 * (first launch while offline), which is the behaviour we had before.
 *
 * This module is deliberately dependency-free so that it can be imported from
 * `src/shared` without creating a require cycle.
 */
type StateWithSettings = { app?: { settings?: { timezone?: string | null } } };

export const selectTimezone = (state: StateWithSettings): string =>
  state?.app?.settings?.timezone || moment.tz.guess();

/**
 * Parse `date` and express it in `timezone`, so that calendar-day comparisons
 * use the server's day boundaries.
 */
export const timezoneMoment = (
  date: moment.MomentInput,
  timezone?: string,
): moment.Moment => moment.tz(date, timezone || moment.tz.guess());

export const isSameDayInTimezone = (
  a: moment.MomentInput,
  b: moment.MomentInput,
  timezone?: string,
): boolean =>
  timezoneMoment(a, timezone).isSame(timezoneMoment(b, timezone), 'day');
