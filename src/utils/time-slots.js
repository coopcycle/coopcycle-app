import Moment from 'moment-business-days'
import { extendMoment } from 'moment-range'
import _ from 'lodash'

const moment = extendMoment(Moment)

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
        return `Today between ${range.start.format('LT')} and ${range.end.format('LT')}`
      case 'nextDay':
        return `Tomorrow between ${range.start.format('LT')} and ${range.end.format('LT')}`
      default:
        return `${range.start.format('dddd')} between ${range.start.format('LT')} and ${range.end.format('LT')}`
    }
  }
}

function makeRange(date, choice) {

  const [ startHour, startMinute ] = choice.startTime.split(':')
  const [ endHour, endMinute ] = choice.endTime.split(':')

  const after = moment(date)
  const before = moment(date)

  after.set('hour', startHour)
  after.set('minute', startMinute)

  before.set('hour', endHour)
  before.set('minute', endMinute)

  return moment.range(after, before)
}

function makeChoice(date, choice, now) {

  now = now || moment()

  const range = makeRange(date, choice)

  if (now.isAfter(range.start)) {
    return false
  }

  return {
    key: `${moment(date).format('YYYY-MM-DD')} ${range.start.format('HH:mm')}-${range.end.format('HH:mm')}`,
    label: makeLabel(range, now),
    range,
  }
}

const countNumberOfDays = items => {
  const itemsAsISO = _.map(items, item => {
    const matches = /^([0-9]{4}-[0-9]{2}-[0-9]{2})/.exec(item.key)

    return matches[1]
  })

  return _.uniq(itemsAsISO).length
}

export function getChoicesWithDates(timeSlot, now) {

  now = now || moment()

  const matches = /([0-9]) (days?|weeks?)/.exec(timeSlot.interval)
  const number = parseInt(matches[1], 10)
  const unit = matches[2]

  const lastMoment = moment(now).add(number, unit)

  const expectedNumberOfDays = lastMoment.diff(now, 'days')

  let day = moment(now)
  if (timeSlot.workingDaysOnly && !moment(now).isBusinessDay()) {
    day = moment(now).nextBusinessDay()
  }

  // FIXME Don't know why, but it's an object (?)
  const choices = Array.isArray(timeSlot.choices) ? timeSlot.choices : _.values(timeSlot.choices)
  let items = []
  while (countNumberOfDays(items) < expectedNumberOfDays) {
    choices.forEach(choice => {
      const item = makeChoice(day, choice, now)
      if (item) {
        items.push(item)
      }
    })
    day = timeSlot.workingDaysOnly ? day.nextBusinessDay() : day.add(1, 'day')
  }

  items.sort((a, b) => {
    if (a.range.start.isSame(b.range.start)) {
      return 0
    }
    return a.range.start.isBefore(b.range.start) ? -1 : 1
  })

  return items.map(item => ({ key: item.key, label: item.label }))
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
