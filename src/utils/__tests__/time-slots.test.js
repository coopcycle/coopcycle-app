import { getChoicesWithDates, humanizeTaskTime } from '../time-slots'
import moment from 'moment'

moment.locale('en')

describe('getChoicesWithDates', () => {

  it('returns expected results in the afternoon', () => {
    const timeSlot = {
      choices: [
        { startTime: '20:00:00', endTime: '21:00:00' },
        { startTime: '21:00:00', endTime: '22:00:00' },
      ],
      interval: '3 days',
      workingDaysOnly: false,
    }
    // 2019-11-14 = Thursday
    const items = getChoicesWithDates(timeSlot, moment('2019-11-14 14:00:00'))
    expect(items).toEqual([
      {
        key: '2019-11-14 20:00-21:00',
        label: 'Today between 8:00 PM and 9:00 PM',
      },
      {
        key: '2019-11-14 21:00-22:00',
        label: 'Today between 9:00 PM and 10:00 PM',
      },
      {
        key: '2019-11-15 20:00-21:00',
        label: 'Tomorrow between 8:00 PM and 9:00 PM',
      },
      {
        key: '2019-11-15 21:00-22:00',
        label: 'Tomorrow between 9:00 PM and 10:00 PM',
      },
      {
        key: '2019-11-16 20:00-21:00',
        label: 'Saturday between 8:00 PM and 9:00 PM',
      },
      {
        key: '2019-11-16 21:00-22:00',
        label: 'Saturday between 9:00 PM and 10:00 PM',
      },
    ])
  })

  it('returns expected results in the evening', () => {
    const timeSlot = {
      choices: [
        { startTime: '20:00:00', endTime: '21:00:00' },
        { startTime: '21:00:00', endTime: '22:00:00' },
      ],
      interval: '3 days',
      workingDaysOnly: false,
    }
    // 2019-11-14 = Thursday
    const items = getChoicesWithDates(timeSlot, moment('2019-11-14 20:30:00'))
    expect(items).toEqual([
      {
        key: '2019-11-14 21:00-22:00',
        label: 'Today between 9:00 PM and 10:00 PM',
      },
      {
        key: '2019-11-15 20:00-21:00',
        label: 'Tomorrow between 8:00 PM and 9:00 PM',
      },
      {
        key: '2019-11-15 21:00-22:00',
        label: 'Tomorrow between 9:00 PM and 10:00 PM',
      },
      {
        key: '2019-11-16 20:00-21:00',
        label: 'Saturday between 8:00 PM and 9:00 PM',
      },
      {
        key: '2019-11-16 21:00-22:00',
        label: 'Saturday between 9:00 PM and 10:00 PM',
      },
    ])
  })

  it('returns expected results in the afternoon, working days only', () => {
    const timeSlot = {
      choices: [
        { startTime: '20:00:00', endTime: '21:00:00' },
        { startTime: '21:00:00', endTime: '22:00:00' },
      ],
      interval: '3 days',
      workingDaysOnly: true,
    }
    // 2019-11-14 = Thursday
    const items = getChoicesWithDates(timeSlot, moment('2019-11-14 14:00:00'))
    expect(items).toEqual([
      {
        key: '2019-11-14 20:00-21:00',
        label: 'Today between 8:00 PM and 9:00 PM',
      },
      {
        key: '2019-11-14 21:00-22:00',
        label: 'Today between 9:00 PM and 10:00 PM',
      },
      {
        key: '2019-11-15 20:00-21:00',
        label: 'Tomorrow between 8:00 PM and 9:00 PM',
      },
      {
        key: '2019-11-15 21:00-22:00',
        label: 'Tomorrow between 9:00 PM and 10:00 PM',
      },
      {
        key: '2019-11-18 20:00-21:00',
        label: 'Monday between 8:00 PM and 9:00 PM',
      },
      {
        key: '2019-11-18 21:00-22:00',
        label: 'Monday between 9:00 PM and 10:00 PM',
      },
    ])
  })

  it('returns expected results with openingHoursSpecification', () => {
    const timeSlot = {
      choices: [],
      interval: '3 days',
      workingDaysOnly: false,
      'openingHoursSpecification':[
        {
          '@type':'OpeningHoursSpecification',
          'opens':'10:00',
          'closes':'11:00',
          'dayOfWeek':[
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
          ],
        },
        {
          '@type':'OpeningHoursSpecification',
          'opens':'11:00',
          'closes':'13:00',
          'dayOfWeek':[
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
          ],
        },
        {
          '@type':'OpeningHoursSpecification',
          'opens':'14:00',
          'closes':'15:00',
          'dayOfWeek':[
            'Saturday',
          ],
        },
      ],
    }

    // 2019-11-14 = Thursday
    const items = getChoicesWithDates(timeSlot, moment('2019-11-14 14:00:00'))
    expect(items).toEqual([
      {
        key: '2019-11-15 10:00-11:00',
        label: 'Tomorrow between 10:00 AM and 11:00 AM',
      },
      {
        key: '2019-11-15 11:00-13:00',
        label: 'Tomorrow between 11:00 AM and 1:00 PM',
      },
      {
        key: '2019-11-16 14:00-15:00',
        label: 'Saturday between 2:00 PM and 3:00 PM',
      },
      {
        key: '2019-11-18 10:00-11:00',
        label: 'Monday between 10:00 AM and 11:00 AM',
      },
      {
        key: '2019-11-18 11:00-13:00',
        label: 'Monday between 11:00 AM and 1:00 PM',
      },
    ])
  })
})

describe('humanizeTaskTime', () => {

  // 2019-11-14 = Thursday
  const task = {
    after: '2019-11-14 19:00:00',
    before: '2019-11-14 20:00:00',
  }

  it('returns expected results', () => {

    expect(humanizeTaskTime(task, moment('2019-11-14 14:00:00')))
      .toEqual('Today between 7:00 PM and 8:00 PM')

    expect(humanizeTaskTime(task, moment('2019-11-13 14:00:00')))
      .toEqual('Tomorrow between 7:00 PM and 8:00 PM')

    expect(humanizeTaskTime(task, moment('2019-11-12 14:00:00')))
      .toEqual('Thursday between 7:00 PM and 8:00 PM')

    expect(humanizeTaskTime(task, moment('2019-11-14 19:30:00')))
      .toEqual('Today between 7:00 PM and 8:00 PM')

    expect(humanizeTaskTime(task, moment('2019-11-13 19:30:00')))
      .toEqual('Tomorrow between 7:00 PM and 8:00 PM')
  })
})
