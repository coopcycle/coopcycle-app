import moment from 'moment';
import { createAction } from '@reduxjs/toolkit';
import {
  actionMatchCreator,
  createTaskItemsTransform,
  fetchAllRecordsUsingFetchWithBQ,
  idfromUrl
} from '../util';

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

  describe('fetchAllRecordsUsingFetchWithBQ', () => {
    const members = [
      {'@id': '/api/stores/1'},
      {'@id': '/api/stores/2'}
    ];

    it('should return all items that fits in the first page', async () => {
      const fetchWithBQ = jest.fn();
      fetchWithBQ.mockResolvedValue({
        data: {
        'hydra:totalItems': 2,
        'hydra:member': members
        }
      });

      const rs = await fetchAllRecordsUsingFetchWithBQ(fetchWithBQ, '/api/stores', 10);
      expect(rs).toEqual(members);
      expect(fetchWithBQ).toHaveBeenCalledTimes(1);
    });

    it('should return all items from 3 request', async () => {
      const fetchWithBQ = jest.fn();
      fetchWithBQ.mockResolvedValue({
        data: {
          'hydra:totalItems': 6,
          'hydra:member': members
        }
      });

      const rs = await fetchAllRecordsUsingFetchWithBQ(fetchWithBQ, '/api/stores', 2);
      expect(rs).toEqual([...members, ...members, ...members]);
      expect(fetchWithBQ).toHaveBeenCalledTimes(3);
    });

    it('should return all items from 1 request although totalItems is bigger than member.length but itemsPerPage is bigger', async () => {
      const fetchWithBQ = jest.fn();
      fetchWithBQ.mockResolvedValue({
        data: {
          'hydra:totalItems': 5,
          'hydra:member': members
        }
      });

      const rs = await fetchAllRecordsUsingFetchWithBQ(fetchWithBQ, '/api/stores', 7);
      expect(rs).toEqual(members);
      expect(fetchWithBQ).toHaveBeenCalledTimes(1);
    });

    it('should return all items from 1 request although totalItems is equal to member.length and itemsPerPage is lower', async () => {
      const fetchWithBQ = jest.fn();
      fetchWithBQ.mockResolvedValue({
        data: {
          'hydra:totalItems': 2,
          'hydra:member': members
        }
      });

      const rs = await fetchAllRecordsUsingFetchWithBQ(fetchWithBQ, '/api/stores', 1);
      expect(rs).toEqual(members);
      expect(fetchWithBQ).toHaveBeenCalledTimes(1);
    });
  });

  describe('actionMatchCreator', () => {
    it('should return TRUE if an action matches any action creator', () => {
      const actionCreator1 = createAction('ACTION_1');
      const actionCreator2 = createAction('ACTION_2');

      const action = actionCreator1('some value');

      const result = actionMatchCreator(action, [actionCreator1, actionCreator2]);

      expect(result).toBeTruthy();
    });

    it('should return FALSE if an action doesnt match any action creator', () => {
      const actionCreator1 = createAction('ACTION_1');
      const actionCreator2 = createAction('ACTION_2');
      const actionCreator3 = createAction('ACTION_3');

      const action = actionCreator1('some value');

      const result = actionMatchCreator(action, [actionCreator2, actionCreator3]);

      expect(result).toBeFalsy();
    });
  });

  describe('idfromUrl', () => {
    it('should return the id from different url strings', () => {
      expect(idfromUrl('1')).toEqual('1');
      expect(idfromUrl('/11')).toEqual('11');
      expect(idfromUrl('/api/121')).toEqual('121');
      expect(idfromUrl('/api/item/1234')).toEqual('1234');
      expect(idfromUrl('/api/item/12345/whatever')).toEqual('12345');
      expect(idfromUrl('/api/item/1wrong345')).toEqual('1');
      expect(idfromUrl('/api/item/33/something/22')).toEqual('33');
      expect(idfromUrl('/api/item')).toEqual(null);
    });
  });
});
