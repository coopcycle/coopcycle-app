import { orderToStep } from '../OrderTracking'

describe('OrderTracking', () => {
  it('should parse based on state', () => {
    expect(orderToStep({ state: 'accepted' })).toEqual({ error: 0, index: 1 })
    expect(orderToStep({ state: 'refused' })).toEqual({ error: 1, index: 1 })
    expect(orderToStep({ state: 'cancelled' })).toEqual({ error: 2, index: 2 })
  })

  it('should parse based on events', () => {
    expect(orderToStep({ events: [
      { type: 'order:accepted' }
    ] })).toEqual({ error: 0, index: 1 })

    expect(orderToStep({ events: [
      { type: 'order:accepted' },
      { type: 'order:picked' }
    ] })).toEqual({ error: 0, index: 2 })
  })
})
