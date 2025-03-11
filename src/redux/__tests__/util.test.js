import moment from 'moment';
import { createTaskItemsTransform, fetchAllRecordsUsingHttpClient } from '../util';

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
    };

    const transform = createTaskItemsTransform(moment('2020-01-07'));

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
    });
  });

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
    };

    const transform = createTaskItemsTransform(moment('2020-01-07'));

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
    });
  });

  describe('fetchAllRecordsUsingHttpClient', () => {
    const members = [
      {'@id': '/api/stores/1'},
      {'@id': '/api/stores/2'}
    ];

    it('should return all items that fits in the first page', async () => {
      const httpClient = {get: jest.fn()};
      httpClient.get.mockResolvedValue({
        'hydra:totalItems': 2,
        'hydra:member': members
      });

      const rs = await fetchAllRecordsUsingHttpClient(httpClient, '/api/stores', 10);
      expect(rs).toEqual(members);
      expect(httpClient.get).toHaveBeenCalledTimes(1);
    });

    it('should return all items from 3 request', async () => {
      const httpClient = {get: jest.fn()};
      httpClient.get.mockResolvedValue({
        'hydra:totalItems': 6,
        'hydra:member': members
      });

      const rs = await fetchAllRecordsUsingHttpClient(httpClient, '/api/stores', 2);
      expect(rs).toEqual([...members, ...members, ...members]);
      expect(httpClient.get).toHaveBeenCalledTimes(3);
    });

    it('should return all items from 1 request although totalItems is bigger than member.length but itemsPerPage is bigger', async () => {
      const httpClient = {get: jest.fn()};
      httpClient.get.mockResolvedValue({
        'hydra:totalItems': 5,
        'hydra:member': members
      });

      const rs = await fetchAllRecordsUsingHttpClient(httpClient, '/api/stores', 7);
      expect(rs).toEqual(members);
      expect(httpClient.get).toHaveBeenCalledTimes(1);
    });

    it('should return all items from 1 request although totalItems is equal to member.length and itemsPerPage is lower', async () => {
      const httpClient = {get: jest.fn()};
      httpClient.get.mockResolvedValue({
        'hydra:totalItems': 2,
        'hydra:member': members
      });

      const rs = await fetchAllRecordsUsingHttpClient(httpClient, '/api/stores', 1);
      expect(rs).toEqual(members);
      expect(httpClient.get).toHaveBeenCalledTimes(1);
    });
  });
});
