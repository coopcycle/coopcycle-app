import React from 'react';
import { render } from '@testing-library/react-native';

import ShopCollections from '../ShopCollections';
import {
  useGetShopFiltersQuery,
  useGetShopsByFilterQuery,
} from '../../redux/api/slice';

jest.mock('../../redux/api/slice', () => ({
  useGetShopFiltersQuery: jest.fn(),
  useGetShopsByFilterQuery: jest.fn(),
  // The cards ask for their own timing; it is not what is under test here.
  useGetRestaurantTimingQuery: () => ({}),
}));

const featured = {
  id: 'category|featured',
  filter: 'category',
  value: 'featured',
  label: 'Featured',
};

const shop = {
  '@id': '/api/restaurants/1',
  name: 'Nodaiwa',
  description: null,
  address: { streetAddress: '1 rue de la Paix' },
  image: 'https://example.org/logo.png',
  bannerImage: 'https://example.org/banner.png',
  badges: [],
  tags: [],
};

describe('ShopCollections', () => {
  beforeEach(() => jest.clearAllMocks());

  it('outlines a few rows while the filters are loading', () => {
    useGetShopFiltersQuery.mockReturnValue({ isLoading: true });
    useGetShopsByFilterQuery.mockReturnValue({ isLoading: true });

    const { getByTestId } = render(<ShopCollections onItemClick={jest.fn()} />);

    expect(getByTestId('shopCollectionsLoading')).toBeTruthy();
  });

  it('names a row before its shops have arrived', () => {
    useGetShopFiltersQuery.mockReturnValue({
      data: [featured],
      isLoading: false,
    });
    useGetShopsByFilterQuery.mockReturnValue({ isLoading: true });

    const { getByText, queryByTestId } = render(
      <ShopCollections onItemClick={jest.fn()} />,
    );

    expect(getByText('Featured')).toBeTruthy();
    expect(queryByTestId('shopCollection:category|featured')).toBeNull();
  });

  it('renders the row once its shops are in', () => {
    useGetShopFiltersQuery.mockReturnValue({
      data: [featured],
      isLoading: false,
    });
    useGetShopsByFilterQuery.mockReturnValue({
      data: [shop],
      isLoading: false,
    });

    const { getByTestId, getByText } = render(
      <ShopCollections onItemClick={jest.fn()} />,
    );

    expect(getByTestId('shopCollection:category|featured')).toBeTruthy();
    expect(getByText('Nodaiwa')).toBeTruthy();
  });

  it('drops a row the server offers but has no shops for', () => {
    useGetShopFiltersQuery.mockReturnValue({
      data: [featured],
      isLoading: false,
    });
    useGetShopsByFilterQuery.mockReturnValue({ data: [], isLoading: false });

    const { queryByText } = render(<ShopCollections onItemClick={jest.fn()} />);

    expect(queryByText('Featured')).toBeNull();
  });

  it('renders nothing when the server offers no filters', () => {
    useGetShopFiltersQuery.mockReturnValue({ data: [], isLoading: false });
    useGetShopsByFilterQuery.mockReturnValue({ isLoading: false });

    const { toJSON } = render(<ShopCollections onItemClick={jest.fn()} />);

    expect(toJSON()).toBeNull();
  });
});
