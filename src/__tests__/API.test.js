import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

import { createClient } from '../API'

const mock = new MockAdapter(axios)

describe('HTTP client', () => {

  afterEach(() => {
    mock.reset()
  })

  const expiredToken = 'ThisTokenIsExpired'
  const validToken = 'ThisTokenIsNotExpired'

  it('retries request when token is expired', () => {

    mock.onPost('http://demo.coopcycle.org/api/token/refresh').reply(200, {
      token: validToken,
      refresh_token: '123456',
    })

    mock.onGet('/api/orders').reply(function (config) {
      if (config.headers['Authorization'] === `Bearer ${validToken}`) {
        return [ 200, {} ]
      }

      return [ 401 ]
    })

    const client = createClient('http://demo.coopcycle.org', {
      token: expiredToken,
      refreshToken: '123456'
    })

    return client.get('/api/orders')
  })

  it('fails when token cannot be refreshed', () => {

    // TODO Make sure the endpoint returns 401 when token can't be refreshed
    mock.onPost('http://demo.coopcycle.org/api/token/refresh').reply(401, {})

    mock.onGet('/api/orders').reply(function (config) {
      if (config.headers['Authorization'] === `Bearer ${validToken}`) {
        return [ 200, {} ]
      }

      return [ 401, { message: 'This is original response' } ]
    })

    const client = createClient('http://demo.coopcycle.org', {
      token: expiredToken,
      refreshToken: '123456'
    })

    return new Promise(resolve => {
      client.get('/api/orders')
        .catch(e => {
          expect(e).toEqual({ message: 'This is original response' })
          resolve()
        })
    })
  })

})
