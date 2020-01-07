import moment from 'moment'
import { createStore } from 'redux'
import { createTaskItemsTransform } from '../util'

describe('Redux | util', () => {

  it('TaskItemsTransform | in', () => {

    const state = {
      '2020-01-03': [],
      '2020-01-04': [],
      '2020-01-05': [],
      '2020-01-06': [],
      '2020-01-07': [],
      '2020-01-08': [],
      '2020-01-09': [],
      '2020-01-10': [],
      '2020-01-11': [],
    }

    const transform = createTaskItemsTransform(moment('2020-01-07'))

    expect(transform.in(state, 'items')).toEqual({
      // '2020-01-03': [],
      '2020-01-04': [],
      '2020-01-05': [],
      '2020-01-06': [],
      '2020-01-07': [],
      '2020-01-08': [],
      '2020-01-09': [],
      '2020-01-10': [],
      // '2020-01-11': [],
    })
  })

  it('TaskItemsTransform | out', () => {

    const state = {
      '2020-01-03': [],
      '2020-01-04': [],
      '2020-01-05': [],
      '2020-01-06': [],
      '2020-01-07': [],
      '2020-01-08': [],
      '2020-01-09': [],
      '2020-01-10': [],
      '2020-01-11': [],
    }

    const transform = createTaskItemsTransform(moment('2020-01-07'))

    expect(transform.out(state, 'items')).toEqual({
      // '2020-01-03': [],
      '2020-01-04': [],
      '2020-01-05': [],
      '2020-01-06': [],
      '2020-01-07': [],
      '2020-01-08': [],
      '2020-01-09': [],
      '2020-01-10': [],
      // '2020-01-11': [],
    })
  })
})
