import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import allSettled from 'promise.allsettled'
import ReactNativeBlobUtil from 'react-native-blob-util'
import * as FileSystem from 'expo-file-system'

import { createClient } from '../API'

describe('HTTP client', () => {

  let mock

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

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
      if (config.headers.Authorization === `Bearer ${validToken}`) {
        return [ 200, {}]
      }

      return [401]
    })

    const client = createClient('http://demo.coopcycle.org', {
      token: expiredToken,
      refreshToken: '123456',
      onTokenRefreshed: (token, refreshToken) => {
        expect(token).toEqual(validToken)
        expect(refreshToken).toEqual('123456')
      },
    })

    return client.get('/api/orders')
  })

  it('fails when token cannot be refreshed', () => {

    // TODO Make sure the endpoint returns 401 when token can't be refreshed
    mock.onPost('http://demo.coopcycle.org/api/token/refresh').reply(401, {})

    mock.onGet('/api/orders').reply(function (config) {
      if (config.headers.Authorization === `Bearer ${validToken}`) {
        return [ 200, {}]
      }

      return [ 401, { message: 'This is original response' }]
    })

    const client = createClient('http://demo.coopcycle.org', {
      token: expiredToken,
      refreshToken: '123456',
    })

    return new Promise(resolve => {
      client.get('/api/orders')
        .catch(e => {
          expect(e.response.status).toEqual(401)
          resolve()
        })
    })
  })

  /**
   * This test makes sure that when there are several concurrent requests,
   * and a token refresh fails, all promises return a failure
   */
  it('fails all promises', () => {

    // TODO Make sure the endpoint returns 401 when token can't be refreshed
    mock.onPost('http://demo.coopcycle.org/api/token/refresh').reply(401, {})

    mock.onGet('/api/orders').reply(function (config) {
      if (config.headers.Authorization === `Bearer ${validToken}`) {
        return [ 200, {}]
      }

      return [ 401, { message: 'This is original A response' }]
    })

    // This will complete 500ms later
    mock.onGet('/api/restaurants').reply(function(config) {
      return new Promise((resolve) => {
        setTimeout(function() {
          resolve([ 401, { message: 'This is original B response' }])
        }, 500)
      })
    })

    const client = createClient('http://demo.coopcycle.org', {
      token: expiredToken,
      refreshToken: '123456',
    })

    return new Promise((resolve, reject) => {

      allSettled([
        client.get('/api/orders'),
        client.get('/api/restaurants'),
      ])
        .then(function (results) {

          expect(results).toHaveLength(2)
          expect(results[0].status).toEqual('rejected')
          expect(results[0].reason.response.status).toEqual(401)
          expect(results[1].status).toEqual('rejected')
          expect(results[1].reason.response.status).toEqual(401)

          resolve()
        })
    })
  })

  it.skip('retries file upload', () => {

    mock.onPost('http://demo.coopcycle.org/api/token/refresh').reply(200, {
      token: validToken,
      refresh_token: '123456',
    })

    ReactNativeBlobUtil.fetch = jest.fn()
    ReactNativeBlobUtil.fetch.mockResolvedValueOnce({
      info: () => ({ status: 401 }),
      json: () => ({}),
    })
    ReactNativeBlobUtil.fetch.mockResolvedValueOnce({
      info: () => ({ status: 201 }),
      json: () => ({ '@id': '/api/task_images/1' }),
    })

    const client = createClient('http://demo.coopcycle.org', {
      token: expiredToken,
      refreshToken: '123456',
    })

    return new Promise((resolve, reject) => {

      client.uploadFile('/api/images', '12345678')
        .then(response => {

          expect(response).toEqual({ '@id': '/api/task_images/1' })
          expect(ReactNativeBlobUtil.fetch).toHaveBeenCalledTimes(2)

          resolve()

        })
    })
  })

  it('retries file upload async', async () => {

    mock.onPost('http://demo.coopcycle.org/api/token/refresh').reply(200, {
      token: validToken,
      refresh_token: '123456',
    })

    FileSystem.createUploadTask.mockReturnValueOnce({
      uploadAsync: jest.fn()
      .mockResolvedValueOnce({ status: 401 })
      .mockResolvedValueOnce({ status: 201 })
    })

    const client = createClient('http://demo.coopcycle.org', {
      token: expiredToken,
      refreshToken: '123456',
    })

    const task = client.uploadFileAsync('/api/images', '12345678')
    await client.execUploadTask(task)
    expect(task.uploadAsync).toHaveBeenCalledTimes(2)
  })

  it('retries multiple files upload async', async () => {

    mock.onPost('http://demo.coopcycle.org/api/token/refresh').reply(200, {
      token: validToken,
      refresh_token: '123456',
    })

    FileSystem.createUploadTask.mockReturnValueOnce({
      uploadAsync: jest.fn()
      .mockResolvedValueOnce({ status: 401 })
      .mockResolvedValueOnce({ status: 201 })
    }).mockReturnValueOnce({
      uploadAsync: jest.fn()
      .mockResolvedValueOnce({ status: 201 })
    })

    const client = createClient('http://demo.coopcycle.org', {
      token: expiredToken,
      refreshToken: '123456',
    })

    const task1 = client.uploadFileAsync('/api/images', '12345678')
    const task2 = client.uploadFileAsync('/api/images', '12345678')
    await client.execUploadTask([task1, task2])
    expect(task1.uploadAsync).toHaveBeenCalledTimes(2)
    expect(task2.uploadAsync).toHaveBeenCalledTimes(1)
  })

  it('retries file upload async fail too many retries', async () => {

    mock.onPost('http://demo.coopcycle.org/api/token/refresh').reply(200, {
      token: validToken,
      refresh_token: '123456',
    })

    FileSystem.createUploadTask.mockReturnValueOnce({
      uploadAsync: jest.fn()
      .mockResolvedValue({ status: 401 })
    })

    const client = createClient('http://demo.coopcycle.org', {
      token: expiredToken,
      refreshToken: '123456',
    })

    const task = client.uploadFileAsync('/api/images', '12345678')
    const t = async () => {
      await client.execUploadTask(task)
    }
    await expect(t()).rejects.toThrow(Error);
    expect(task.uploadAsync).toHaveBeenCalledTimes(3)
  })

})
