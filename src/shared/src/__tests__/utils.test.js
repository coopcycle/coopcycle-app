import moment from 'moment-timezone';

import { isSameDayTask, isSameDayTaskList, isSameDayTour } from '../utils';

describe('isSameDayTask', () => {
  const SERVER_TZ = 'America/Vancouver';

  beforeAll(() => {
    // The device is in a different timezone than the server
    moment.tz.setDefault('Europe/Paris');
  });

  afterAll(() => {
    moment.tz.setDefault();
  });

  it('uses the server day boundaries, not the device ones', () => {
    // 2020-01-07 21:00 in Vancouver is 2020-01-08 06:00 in Paris:
    // with the device timezone this task would be dropped from the store
    const task = { doneBefore: '2020-01-07T21:00:00-08:00' };
    const date = moment.tz('2020-01-07', SERVER_TZ);

    expect(isSameDayTask(task, date, SERVER_TZ)).toBe(true);
  });

  it('rejects a task belonging to another server day', () => {
    const task = { doneBefore: '2020-01-08T09:00:00-08:00' };
    const date = moment.tz('2020-01-07', SERVER_TZ);

    expect(isSameDayTask(task, date, SERVER_TZ)).toBe(false);
  });

  it('applies the same boundaries to task lists and tours', () => {
    const date = moment.tz('2020-01-07', SERVER_TZ);

    expect(isSameDayTaskList({ date: '2020-01-07' }, date, SERVER_TZ)).toBe(
      true,
    );
    expect(isSameDayTour({ date: '2020-01-07' }, date, SERVER_TZ)).toBe(true);
    expect(isSameDayTour({ date: '2020-01-08' }, date, SERVER_TZ)).toBe(false);
  });
});
