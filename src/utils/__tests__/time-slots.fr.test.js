import { getChoicesWithDates } from '../time-slots';
import moment from 'moment';

moment.locale('fr');

describe('getChoicesWithDates [fr]', () => {
  it('returns expected results with openingHoursSpecification', () => {
    const timeSlot = {
      choices: [],
      interval: '3 days',
      workingDaysOnly: false,
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          opens: '10:00',
          closes: '11:00',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        },
        {
          '@type': 'OpeningHoursSpecification',
          opens: '11:00',
          closes: '13:00',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        },
        {
          '@type': 'OpeningHoursSpecification',
          opens: '14:00',
          closes: '15:00',
          dayOfWeek: ['Saturday'],
        },
      ],
    };

    // 2019-11-14 = Thursday
    const items = getChoicesWithDates(timeSlot, moment('2019-11-14 14:00:00'));
    expect(items).toEqual([
      {
        key: '2019-11-15 10:00-11:00',
        label: 'Tomorrow between 10:00 and 11:00',
      },
      {
        key: '2019-11-15 11:00-13:00',
        label: 'Tomorrow between 11:00 and 13:00',
      },
      {
        key: '2019-11-16 14:00-15:00',
        label: 'Samedi between 14:00 and 15:00',
      },
      {
        key: '2019-11-18 10:00-11:00',
        label: 'Lundi between 10:00 and 11:00',
      },
      {
        key: '2019-11-18 11:00-13:00',
        label: 'Lundi between 11:00 and 13:00',
      },
    ]);
  });
});
