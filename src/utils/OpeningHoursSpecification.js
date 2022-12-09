import moment, { Moment } from 'moment'
import { isString, reduce } from 'lodash';

const WEEKDAYS = {
  'Monday': 0,
  'Tuesday': 1,
  'Wednesday': 2,
  'Thursday': 3,
  'Friday': 4,
  'Saturday': 5,
  'Sunday': 6,
}


export default class OpeningHoursSpecification {

  static STATE = {
    'Opened': 1,
    'Closed': 0,
  }


  #state: Array = []

  constructor() {
    const momentInstance = moment().startOf('isoWeek')
    const now = moment()

    for (let i = 0; i <= 6; i++) {
      this.state.push({
        moment: momentInstance.clone(),
        today: now.day() === momentInstance.day(),
        label: moment.weekdaysShort(momentInstance.day()),
        closed: null,
        ranges: [],
      })
      momentInstance.add(1,'d')
    }
  }

  static rangesToString(ranges: Array) {
    return ranges.reduce((acc, range) => {
      acc.push(range.join(' - '))
      return acc
    }, []).join(' | ')
  }

  /**
   * @deprecated
   * @param specialHours
   */
  set specialOpeningHoursSpecification(specialHours: Array) {
    /* specialHours
    .filter(spec => Moment.isBetween(moment(spec.validFrom), moment(spec.validThrough))) */
    throw new Error('specialOpeningHoursSpecification is not implemented yet !')
  }

  /**
   * Defines openingHoursSpecification
   * @param hours
   */
  set openingHours(hours: Array) {
    for (let spec of hours) {
      for (let day of spec.dayOfWeek) {
        this.state[WEEKDAYS[day]].ranges.push([ spec.opens, spec.closes ])
      }
    }
    for (let day of this.state) {
      day.ranges.sort((prev, next) => parseInt(prev[0], 10) - parseInt(next[0], 10))
      day.closed = day.ranges.length === 0
    }
  }

  /**
   * Get internal state
   * @returns {Array}
   */
  get state() {
    return this.#state
  }

  /**
   * Get current timeSlot information, if closed the returned "timeSlot" if the next opened timeSlot
   * @returns {{timeSlot: null, state: number}|{timeSlot: moment.Moment[], state: number}}
   */
  get currentTimeSlot() {
    const today = this.state.filter(day => day.today)[0]

    for (let slot of today.ranges) {
      const { opens, closes } = OpeningHoursSpecification.parseRange(slot, today.moment)

      if (moment().isBetween(opens, closes, 'minute')) {
        return {
          state: OpeningHoursSpecification.STATE.Opened,
          timeSlot: [ opens, closes ],
        }
      }
    }
      return {
        state: OpeningHoursSpecification.STATE.Closed,
        timeSlot: this.nextOpeningHours(),
      }
  }

  nextOpeningHours(at: Moment = moment()) {
    for (let day of this.forNext(7, at)) {
      for (let slot of day.ranges) {
        const { opens, closes } = OpeningHoursSpecification.parseRange(slot, day.moment)
        if (opens.isAfter(at)) {
          return [ opens, closes ]
        }
      }
    }
    return null
  }

  /**
   * Parse range from `["19:00", "22:00"]` then return a object with `Moment` instances
   * @param slot
   * @param day
   * @returns {{opens: moment.Moment, closes: moment.Moment}}
   */
  static parseRange(slot: Array, day: Moment = moment()) {
    const [ hourOpens, minuteOpens ] = slot[0].split(':');
    const [ hourCloses, minuteCloses ] = slot[1].split(':');
    const opens = day.clone()
      .startOf('d')
      .set({ hour: hourOpens, minute: minuteOpens })
    const closes = day.clone()
      .startOf('d')
      .set({ hour: hourCloses, minute: minuteCloses })

    if (closes.isBefore(opens)) {
      closes.add(1, 'd')
    }

    return { opens, closes };
  }

  /**
   * Return state for a given day
   * @param day
   * @returns {{[p: string]: *}}
   */
  forDay(day: Moment = moment()): Object {
    if (day === null) {
      throw new Error('A day must be provided')
    }
    const today = moment()
    const shift = (_day) => {
      const ret = _day.day() - 1
      return ret >= 0 ? ret : 6
    }
    const state = this.state[shift(day)]
    return {
      ...state,
      moment: day.clone(),
      today: today.isSame(day, 'd'),
    }
  }

  /**
   * Like `forDay()` but for the next N days
   * @param next
   * @param from
   * @returns {[]}
   */
  forNext(next: Number = 7, from: Moment = moment()): Array {
    if (from === null) {
      throw new Error('A day must be provided')
    }
    from = from.clone()
    const arr = []
    for (let i = 0; i < next; i++) {
      arr.push(this.forDay(from))
      from.add(1, 'd')
    }

    return arr;
  }

  /**
   * Like `forNext()` but parse OpeningHours with `Moment`
   * @param next
   * @param diff
   * @param skipClosed
   * @param from
   * @returns {*[]}
   */
  forNextWithOpeningHours(next: Number = 7, diff: Number = 30, skipClosed = true, from: Moment = moment()) {
    return reduce(this.forNext(next, from), (acc, day, index) => {
      if (skipClosed && day.closed) {
        return acc
      }
      const value = reduce(day.ranges, (_acc, range, _index) => {
        const { opens, closes } = OpeningHoursSpecification.parseRange(range, day.moment)
        while (opens.isBefore(closes, 'minute')) {
          let _opens = opens.clone()
          opens.add(diff, 'minute')
          _acc.push({
            index: _acc.length,
            label: _opens.format('HH:mm') + ' - ' + opens.format('HH:mm'),
            value: [ _opens.format(), opens.format() ],
          })
        }
        return _acc
      }, [])
      acc.push({ index, day, value })
      return acc
    }, [])
  }

  /**
   * Check if the store is open at the given time
   * @param date
   * @param offset
   * @returns {null|{allOpens: boolean, days}|boolean}
   */
  isOpen(date: Moment[]|Moment|string|string[]|null, offset: Number|null = null): boolean[]|boolean|null {
    if (date === null) {
      return null
    }
    if (Array.isArray(date)) {
      const days = date.map((d) => this.isOpen(d))
      return {
        allOpens: days.filter((d) => !d).length === 0,
        days,
      }
    }

    if (isString(date)) {
      date = moment(date)
    }

    const day = this.forDay(date)
    for (let slot of day.ranges) {
      const { opens, closes } = OpeningHoursSpecification.parseRange(slot, day.moment)
      if (offset !== null) {
        opens.add(offset * -1, 'minute')
        closes.add(offset, 'minute')
      }

      if (date.isBetween(opens, closes, 'minute')) {
        return true
      }
    }
    return false
  }

  /**
   * Check if the store closes soon
   * @param timeSlot
   * @param minutes
   * @param compareWith
   * @returns {null|boolean}
   */
  static closesSoon(timeSlot: Moment[] = null, minutes = 15, compareWith = moment()): boolean
  {
    if (timeSlot === null) {
      return null
    }
    if (timeSlot.length !== 2) {
      throw new Error('A timeSlot array must contains only two instance of Moment')
    }

    const ret = timeSlot[1].diff(compareWith, 'minute')
    return ret > 0 && ret <= minutes
  }

  /**
   * Check if the store opens soon
   * @param timeSlot
   * @param minutes
   * @param compareWith
   * @returns {null|boolean}
   */
  static opensSoon(timeSlot: Moment[] = null, minutes = 30, compareWith = moment()): boolean
  {
    if (timeSlot === null) {
      return null
    }
    if (timeSlot.length !== 2) {
      throw new Error('A timeSlot array must contains only two instance of Moment')
    }

    const ret = timeSlot[0].diff(compareWith, 'minute')
    return ret > 0 && ret <= minutes
  }

}
