import { parseNotification } from '../index.android'

describe('parseNotification', () => {

  it('returns expected results', () => {

    expect(parseNotification({
      data: {
        event: JSON.stringify({
          name: 'tasks:changed',
          data: { date: '2020-02-19' }
        })
      }
    }, true)).toEqual({
      foreground: true,
      data: {
        event: {
          name: 'tasks:changed',
          data: { date: '2020-02-19' }
        }
      }
    })

  })
})

