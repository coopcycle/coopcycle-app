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

  it.skip('retries request when token is expired', () => {

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
      refreshToken: '123456',
      onTokenRefreshed: (token, refreshToken) => {
        expect(token).toEqual(validToken)
        expect(refreshToken).toEqual('123456')
      }
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
          expect(e.response.status).toEqual(401)
          resolve()
        })
    })
  })

  // FIXME
  // This test should make sure that when there are several concurrent
  // requests, and a token refresh fails, all promises return a failure
  it.skip('fails all promises', () => {

    // TODO Make sure the endpoint returns 401 when token can't be refreshed
    mock.onPost('http://demo.coopcycle.org/api/token/refresh').reply(401, {})

    mock.onGet('/api/orders').reply(function (config) {
      if (config.headers['Authorization'] === `Bearer ${validToken}`) {
        return [ 200, {} ]
      }

      return [ 401, { message: 'This is original A response' } ]
    })

    mock.onGet('/api/restaurants').reply(function (config) {
      if (config.headers['Authorization'] === `Bearer ${validToken}`) {
        return [ 200, {} ]
      }

      return [ 401, { message: 'This is original B response' } ]
    })

    const client = createClient('http://demo.coopcycle.org', {
      token: expiredToken,
      refreshToken: '123456'
    })

    return new Promise((resolve, reject) => {
      Promise.all([
        client.get('/api/orders'),
        client.get('/api/restaurants')
      ]).catch(e => {
        resolve()
      })
    })
  })

})
