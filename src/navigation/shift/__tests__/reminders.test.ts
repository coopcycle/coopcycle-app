import moment from 'moment';
import {
  computeShiftReminderRequests,
  REMINDER_ID_PREFIX,
} from '../reminders';
import { Shift, ShiftActivity } from '../../../redux/api/types';

const activities: ShiftActivity[] = [
  {
    '@id': '/api/shift_activities/1',
    '@type': 'ShiftActivity',
    id: 1,
    slug: 'delivery',
    label: 'Delivery',
    color: '#ff0000',
    addToDispatch: true,
  } as ShiftActivity,
];

function createShift(id: number, startsAt: string): Shift {
  return {
    '@id': `/api/shifts/${id}`,
    '@type': 'Shift',
    id,
    activity: 'delivery',
    startsAt,
    endsAt: moment(startsAt).add(8, 'hours').format(),
    slots: 1,
    breakMinutes: 0,
    assignments: [],
    waitlist: [],
    requiredSkills: [],
  } as Shift;
}

describe('computeShiftReminderRequests', () => {
  const now = moment('2026-06-29T08:00:00Z');

  it('schedules a reminder for a shift starting soon', () => {
    const shift = createShift(1, '2026-06-29T09:00:00Z');

    const requests = computeShiftReminderRequests(
      [shift],
      activities,
      now,
    );

    expect(requests).toHaveLength(1);
    expect(requests[0].identifier).toBe(`${REMINDER_ID_PREFIX}1`);
    expect(requests[0].trigger.date).toEqual(
      moment('2026-06-29T08:45:00Z').toDate(),
    );
  });

  it('skips a shift whose reminder time has already passed', () => {
    const shift = createShift(2, '2026-06-29T08:10:00Z');

    const requests = computeShiftReminderRequests(
      [shift],
      activities,
      now,
    );

    expect(requests).toHaveLength(0);
  });

  it('skips a shift starting beyond the reminder window', () => {
    const shift = createShift(3, '2026-07-10T09:00:00Z');

    const requests = computeShiftReminderRequests(
      [shift],
      activities,
      now,
    );

    expect(requests).toHaveLength(0);
  });
});
