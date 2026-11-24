import {
  fetchAllRecordsUsingFetchWithBQ,
  fetchAllRecordsUsingHttpClient,
} from '../utils';

describe('fetchAllRecordsUsingFetchWithBQ', () => {
  const members = [{ '@id': '/api/stores/1' }, { '@id': '/api/stores/2' }];

  it('should return all items that fits in the first page', async () => {
    const fetchWithBQ = jest.fn();
    fetchWithBQ.mockResolvedValue({
      data: {
        'hydra:totalItems': 2,
        'hydra:member': members,
      },
    });

    const rs = await fetchAllRecordsUsingFetchWithBQ(
      fetchWithBQ,
      '/api/stores',
      10,
    );
    expect(rs).toEqual({ data: members });
    expect(fetchWithBQ).toHaveBeenCalledTimes(1);
  });

  it('should return all items from 3 request', async () => {
    const fetchWithBQ = jest.fn();
    fetchWithBQ.mockResolvedValue({
      data: {
        'hydra:totalItems': 6,
        'hydra:member': members,
      },
    });

    const rs = await fetchAllRecordsUsingFetchWithBQ(
      fetchWithBQ,
      '/api/stores',
      2,
    );
    expect(rs).toEqual({ data: [...members, ...members, ...members] });
    expect(fetchWithBQ).toHaveBeenCalledTimes(3);
  });

  it('should return all items from 1 request although totalItems is bigger than member.length but itemsPerPage is bigger', async () => {
    const fetchWithBQ = jest.fn();
    fetchWithBQ.mockResolvedValue({
      data: {
        'hydra:totalItems': 5,
        'hydra:member': members,
      },
    });

    const rs = await fetchAllRecordsUsingFetchWithBQ(
      fetchWithBQ,
      '/api/stores',
      7,
    );
    expect(rs).toEqual({ data: members });
    expect(fetchWithBQ).toHaveBeenCalledTimes(1);
  });

  it('should return all items from 1 request although totalItems is equal to member.length and itemsPerPage is lower', async () => {
    const fetchWithBQ = jest.fn();
    fetchWithBQ.mockResolvedValue({
      data: {
        'hydra:totalItems': 2,
        'hydra:member': members,
      },
    });

    const rs = await fetchAllRecordsUsingFetchWithBQ(
      fetchWithBQ,
      '/api/stores',
      1,
    );
    expect(rs).toEqual({ data: members });
    expect(fetchWithBQ).toHaveBeenCalledTimes(1);
  });

  it('should return error when first page request fails', async () => {
    const fetchWithBQ = jest.fn();
    const error = new Error('Network error');
    fetchWithBQ.mockRejectedValue(error);

    const rs = await fetchAllRecordsUsingFetchWithBQ(
      fetchWithBQ,
      '/api/stores',
      10,
    );
    expect(rs).toEqual({
      error: {
        status: 'CUSTOM_ERROR',
        data: error,
        error: 'fetch failed',
      },
    });
    expect(fetchWithBQ).toHaveBeenCalledTimes(1);
  });

  it('should return error when subsequent page request fails', async () => {
    const fetchWithBQ = jest.fn();
    const error = new Error('Network error on page 2');

    // First call succeeds
    fetchWithBQ.mockResolvedValueOnce({
      data: {
        'hydra:totalItems': 4,
        'hydra:member': members,
      },
    });

    // Second call fails
    fetchWithBQ.mockRejectedValueOnce(error);

    const rs = await fetchAllRecordsUsingFetchWithBQ(
      fetchWithBQ,
      '/api/stores',
      2,
    );
    expect(rs).toEqual({
      error: {
        status: 'CUSTOM_ERROR',
        data: error,
        error: 'fetch failed',
      },
    });
    expect(fetchWithBQ).toHaveBeenCalledTimes(2);
  });
});

describe('fetchAllRecordsUsingHttpClient', () => {
  const members = [{ '@id': '/api/restaurants/1' }];

  it('should stop after the first page when it holds everything', async () => {
    const httpClient = {
      get: jest
        .fn()
        .mockResolvedValue({ 'hydra:totalItems': 1, 'hydra:member': members }),
    };

    const rs = await fetchAllRecordsUsingHttpClient(
      httpClient,
      '/api/restaurants',
      10,
    );

    expect(rs).toEqual(members);
    expect(httpClient.get).toHaveBeenCalledTimes(1);
  });

  it('should walk every page of a paginated collection', async () => {
    const httpClient = {
      get: jest
        .fn()
        .mockResolvedValue({ 'hydra:totalItems': 5, 'hydra:member': members }),
    };

    const rs = await fetchAllRecordsUsingHttpClient(
      httpClient,
      '/api/restaurants',
      2,
    );

    // 5 items, 2 per page: 3 pages, each mocked to hold one record.
    expect(rs).toHaveLength(3);
    expect(httpClient.get).toHaveBeenCalledTimes(3);
  });

  it('should keep the caller params and ask anonymously', async () => {
    const httpClient = {
      get: jest
        .fn()
        .mockResolvedValue({ 'hydra:totalItems': 1, 'hydra:member': members }),
    };

    await fetchAllRecordsUsingHttpClient(httpClient, '/api/restaurants', 10, {
      coordinate: '48.85,2.35',
    });

    const [uri, options] = httpClient.get.mock.calls[0];
    expect(uri).toBe(
      '/api/restaurants?coordinate=48.85%2C2.35&pagination=true&page=1&itemsPerPage=10',
    );
    expect(options).toEqual({ anonymous: true });
  });
});
