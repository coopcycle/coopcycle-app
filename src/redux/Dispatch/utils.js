import moment from 'moment'

export function isSameDate(task, date) {
  return moment(task.doneBefore).isSame(date, 'day')
}
