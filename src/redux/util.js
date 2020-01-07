import Moment from 'moment'
import { extendMoment } from 'moment-range'
import _ from 'lodash'
import { createTransform } from 'redux-persist'

const moment = extendMoment(Moment)

export const insertAt = (x, idx, xs) =>
  xs
    .slice(0, idx)
    .concat(x)
    .concat(xs.slice(idx))

/**
 * @see https://github.com/rt2zz/redux-persist#transforms
 */
export function createTaskItemsTransform(now) {

  now = now || moment()

  const range = moment.range(
    moment(now).subtract(3, 'days'),
    moment(now).add(3, 'days')
  )
  const days = Array.from(range.by('day'))
  const keys = days.map(m => m.format('YYYY-MM-DD'))

  return createTransform(
    // transform state on its way to being serialized and persisted.
    (inboundState, key) => _.pick(inboundState, keys),
    // transform state being rehydrated
    (outboundState, key) => _.pick(outboundState, keys),
    { whitelist: ['items'] }
  )
}
