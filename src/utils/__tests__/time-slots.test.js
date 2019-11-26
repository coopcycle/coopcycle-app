import { getChoicesWithDates, humanizeTaskTime, resolveState, composeWithState } from '../time-slots'
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

describe('resolveState', () => {

  it('returns expected results', () => {

    expect(resolveState({
      pickup: {},
      dropoff: {},
    })).toEqual('unknown')

    expect(resolveState({
      pickup: { status: 'TODO' },
      dropoff: { status: 'TODO' },
    })).toEqual('new')

    expect(resolveState({
      pickup: { status: 'DONE' },
      dropoff: { status: 'TODO' },
    })).toEqual('picked')

    expect(resolveState({
      pickup: { status: 'DONE' },
      dropoff: { status: 'DONE' },
    })).toEqual('fulfilled')
  })
})

describe('composeWithState', () => {

  it('returns expected results', () => {

    expect(composeWithState({
      pickup: {},
      dropoff: {},
    })).toEqual({
      pickup: {},
      dropoff: {},
      state: 'unknown',
    })

    expect(composeWithState({
      pickup: { status: 'TODO' },
      dropoff: { status: 'TODO' },
    })).toEqual({
      pickup: { status: 'TODO' },
      dropoff: { status: 'TODO' },
      state: 'new',
    })

    expect(composeWithState({
      pickup: { status: 'DONE' },
      dropoff: { status: 'TODO' },
    })).toEqual({
      pickup: { status: 'DONE' },
      dropoff: { status: 'TODO' },
      state: 'picked',
    })

    expect(composeWithState({
      pickup: { status: 'DONE' },
      dropoff: { status: 'DONE' },
    })).toEqual({
      pickup: { status: 'DONE' },
      dropoff: { status: 'DONE' },
      state: 'fulfilled',
    })
  })
})
