import Moment from 'moment-business-days'
import { extendMoment } from 'moment-range'
import _ from 'lodash'

const moment = extendMoment(Moment)

import i18n from '../i18n'

function makeLabel(range, now) {
  if (range.diff('days') === 0) {

    const nowClone = moment(now)
      .set('hour', range.start.get('hour'))
      .set('minute', range.start.get('minute'))
      .set('second', range.start.get('second'))

    // This will return the key used in moment.calendar()
    // https://momentjs.com/docs/#/displaying/calendar-time/
    let calendarFormat = moment.calendarFormat(range.start, nowClone)

    switch (calendarFormat) {
      case 'sameDay':
        return i18n.t('TODAY_BETWEEN_START_AND_END', {
          start: range.start.format('LT'),
          end: range.end.format('LT'),
        })
      case 'nextDay':
        return i18n.t('TOMORROW_BETWEEN_START_AND_END', {
          start: range.start.format('LT'),
          end: range.end.format('LT'),
        })
      default:
        return i18n.t('OTHER_DAY_BETWEEN_START_AND_END', {
          date: range.start.format('dddd'),
          start: range.start.format('LT'),
          end: range.end.format('LT'),
        })
    }
  }
}

function makeRange(date, range) {

  const [ startHour, startMinute ] = range[0].split(':')
  const [ endHour, endMinute ] = range[1].split(':')

  const after = moment(date)
  const before = moment(date)

  after.set('hour', startHour)
  after.set('minute', startMinute)

  before.set('hour', endHour)
  before.set('minute', endMinute)

  return moment.range(after, before)
}

const countNumberOfDays = items =>
  _.uniq(_.map(items, item => item.start.format('YYYY-MM-DD'))).length

const hasOpeningHours = timeSlot =>
  timeSlot.hasOwnProperty('openingHoursSpecification') && Array.isArray(timeSlot.openingHoursSpecification) && timeSlot.openingHoursSpecification.length > 0

const getCursor = (timeSlot, now) => {
  if (!hasOpeningHours(timeSlot) && timeSlot.workingDaysOnly && !moment(now).isBusinessDay()) {
    return moment(now).nextBusinessDay()
  }

  return moment(now)
}

export function getChoicesWithDates(timeSlot, now) {

  now = now || moment()

  const matches = /([0-9]) (days?|weeks?)/.exec(timeSlot.interval)
  const number = parseInt(matches[1], 10)
  const unit = matches[2]

  const lastMoment = moment(now).add(number, unit)

  const expectedNumberOfDays = lastMoment.diff(now, 'days')

  let cursor = getCursor(timeSlot, now)

  // FIXME Don't know why, but it's an object (?)
  const choices = Array.isArray(timeSlot.choices) ? timeSlot.choices : _.values(timeSlot.choices)
  let items = []

  while (countNumberOfDays(items) < expectedNumberOfDays) {

    if (hasOpeningHours(timeSlot)) {
      timeSlot.openingHoursSpecification.forEach(spec => {
        if (_.includes(spec.dayOfWeek, cursor.format('dddd'))) {
          const item = makeRange(cursor, [ spec.opens, spec.closes ])
          if (item.start.isAfter(now)) {
            items.push(item)
          }
        }
      })
    } else {
      choices.forEach(choice => {
        const item = makeRange(cursor, [ choice.startTime, choice.endTime ])
        if (item.start.isAfter(now)) {
          items.push(item)
        }
      })
    }

    cursor = timeSlot.workingDaysOnly ? cursor.nextBusinessDay() : cursor.add(1, 'day')
  }

  items.sort((a, b) => {
    if (a.start.isSame(b.start)) {
      return 0
    }
    return a.start.isBefore(b.start) ? -1 : 1
  })

  return items.map(item => ({
    key: `${moment(item.start).format('YYYY-MM-DD')} ${item.start.format('HH:mm')}-${item.end.format('HH:mm')}`,
    label: makeLabel(item, now),
  }))
}

export function humanizeTaskTime(task, now) {

  now = now || moment()

  const range = moment.range(
    moment(task.after),
    moment(task.before)
  )

  return makeLabel(range, now)
}

export function resolveState(delivery) {

  const { pickup, dropoff } = delivery

  if (pickup.hasOwnProperty('status') && dropoff.hasOwnProperty('status')) {
    if (pickup.status === 'TODO' && dropoff.status === 'TODO') {
      return 'new'
    }
    if (pickup.status === 'DONE' && dropoff.status === 'TODO') {
      return 'picked'
    }
    if (pickup.status === 'DONE' && dropoff.status === 'DONE') {
      return 'fulfilled'
    }
  }

  return 'unknown'
}

export function composeWithState(delivery) {

  return {
    ...delivery,
    state: resolveState(delivery),
  }
}
