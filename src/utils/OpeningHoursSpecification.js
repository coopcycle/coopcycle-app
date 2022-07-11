import moment from 'moment'

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

  #state: Array = []

  constructor() {
    const momentInstance = moment().startOf('isoWeek')
    const now = moment()

    for (let i = 0; i <= 6; i++) {
      this.state.push({
        moment: momentInstance.clone(),
        today: now.day() === momentInstance.day(),
        label: moment.weekdaysShort(momentInstance.day()),
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

  set specialOpeningHoursSpecification(specialHours: Array) {
    /* specialHours
    .filter(spec => Moment.isBetween(moment(spec.validFrom), moment(spec.validThrough))) */
    throw new Error('specialOpeningHoursSpecification is not implemented yet !')
  }

  set openingHours(hours: Array) {
    for (let spec of hours) {
      for (let day of spec.dayOfWeek) {
        this.state[WEEKDAYS[day]].ranges.push([ spec.opens, spec.closes ])
      }
    }
    for (let day of this.state) {
      day.ranges.sort((prev, next) => parseInt(prev[0], 10) - parseInt(next[0], 10))
    }
  }

  get state() {
    return this.#state
  }

}
