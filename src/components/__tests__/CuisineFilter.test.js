import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';

import CuisineFilter, {
  availableCuisines,
  filterByCuisine,
} from '../CuisineFilter';

const cuisine = (value, label, icon = null) => ({
  id: `cuisine|${value}`,
  filter: 'cuisine',
  value,
  label,
  icon,
});

const shop = (id, cuisines) => ({
  '@id': `/api/restaurants/${id}`,
  name: `Shop ${id}`,
  cuisines,
});

const ITALIAN = cuisine('italian', 'Italienne', '<svg viewBox="0 0 24 24"></svg>');
const JAPANESE = cuisine('japanese', 'Japonaise');
const VEGAN = cuisine('vegan', 'Végétalienne');

describe('availableCuisines', () => {
  it('keeps only the cuisines one of the shops serves', () => {
    const shops = [shop(1, ['italian']), shop(2, ['japanese', 'italian'])];

    expect(
      availableCuisines([ITALIAN, JAPANESE, VEGAN], shops).map(c => c.value),
    ).toEqual(['italian', 'japanese']);
  });

  it('offers nothing when the shops do not say what they serve', () => {
    // A server too old to send a shop's cuisines: the strip stays hidden
    // rather than filtering every shop away.
    expect(availableCuisines([ITALIAN], [{ '@id': '/api/restaurants/1' }])).toEqual(
      [],
    );
  });
});

describe('filterByCuisine', () => {
  const shops = [shop(1, ['italian']), shop(2, ['japanese']), shop(3, [])];

  it('keeps every shop when nothing is selected', () => {
    expect(filterByCuisine(shops, [])).toEqual(shops);
  });

  it('keeps the shops serving any of the selected cuisines', () => {
    expect(filterByCuisine(shops, ['italian', 'japanese'])).toEqual([
      shops[0],
      shops[1],
    ]);
  });
});

describe('CuisineFilter', () => {
  it('renders nothing when there is no cuisine to offer', () => {
    render(<CuisineFilter cuisines={[]} selected={[]} onToggle={jest.fn()} />);

    expect(screen.queryByTestId('cuisineFilter')).toBeNull();
  });

  it('outlines the strip while the cuisines are on their way', () => {
    render(
      <CuisineFilter
        cuisines={[]}
        selected={[]}
        onToggle={jest.fn()}
        isLoading
      />,
    );

    expect(screen.getByTestId('cuisineFilterLoading')).toBeTruthy();
  });

  it('drops the outline once the cuisines are in', () => {
    render(
      <CuisineFilter
        cuisines={[ITALIAN]}
        selected={[]}
        onToggle={jest.fn()}
      />,
    );

    expect(screen.queryByTestId('cuisineFilterLoading')).toBeNull();
    expect(screen.getByText('Italienne')).toBeTruthy();
  });

  it('shows a cuisine by its label, icon or not', () => {
    render(
      <CuisineFilter
        cuisines={[ITALIAN, JAPANESE]}
        selected={[]}
        onToggle={jest.fn()}
      />,
    );

    expect(screen.getByText('Italienne')).toBeTruthy();
    expect(screen.getByText('Japonaise')).toBeTruthy();
  });

  it('reports a tap as a toggle of that cuisine', () => {
    const onToggle = jest.fn();
    render(
      <CuisineFilter
        cuisines={[ITALIAN]}
        selected={[]}
        onToggle={onToggle}
      />,
    );

    fireEvent.press(screen.getByTestId('cuisineFilter:italian'));

    expect(onToggle).toHaveBeenCalledWith('italian');
  });

  it('marks the selected cuisine as such', () => {
    render(
      <CuisineFilter
        cuisines={[ITALIAN, JAPANESE]}
        selected={['italian']}
        onToggle={jest.fn()}
      />,
    );

    expect(
      screen.getByTestId('cuisineFilter:italian').props.accessibilityState,
    ).toEqual({ selected: true });
    expect(
      screen.getByTestId('cuisineFilter:japanese').props.accessibilityState,
    ).toEqual({ selected: false });
  });
});
