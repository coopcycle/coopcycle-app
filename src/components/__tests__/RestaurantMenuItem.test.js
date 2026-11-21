import React from 'react';
import { IconToolsKitchen2 } from '@tabler/icons-react-native';
import { Image } from 'react-native';
import { render, screen } from '@testing-library/react-native';

import i18n from '../../i18n';
import RestaurantMenuItem from '../RestaurantMenuItem';

const DIETS = [
  'KosherDiet',
  'HinduDiet',
  'LowLactoseDiet',
  'LowFatDiet',
  'HalalDiet',
  'VeganDiet',
  'VegetarianDiet',
];

const item = (suitableForDiet, overrides = {}) => ({
  name: 'Sandwich jambon - beurre',
  description: 'Le classique à la française',
  enabled: true,
  suitableForDiet: suitableForDiet.map(diet => `http://schema.org/${diet}`),
  offers: { price: 750 },
  images: [{ ratio: '1:1', url: 'https://example.org/sandwich.png' }],
  ...overrides,
});

const renderItem = product =>
  render(
    <RestaurantMenuItem
      testID="menuItem"
      item={product}
      onPress={jest.fn()}
      isLoading={false}
    />,
  );

describe('RestaurantMenuItem', () => {
  beforeAll(async () => {
    await i18n.changeLanguage('en');
  });

  it('shows every badge when there are few enough of them', () => {
    renderItem(item(DIETS.slice(0, 3)));

    expect(screen.getByTestId('menuItemBadges').children).toHaveLength(3);
    expect(screen.queryByText(/^\+/)).toBeNull();
  });

  it('shows five badges and counts the rest', () => {
    renderItem(item(DIETS));

    // Five badges and the one standing in for what is left.
    expect(screen.getByTestId('menuItemBadges').children).toHaveLength(6);
    expect(screen.getByText('+2')).toBeTruthy();
  });

  it('counts nothing when there are exactly five badges', () => {
    renderItem(item(DIETS.slice(0, 5)));

    expect(screen.getByTestId('menuItemBadges').children).toHaveLength(5);
    expect(screen.queryByText(/^\+/)).toBeNull();
  });

  it('shows no badge row for a product with no diet', () => {
    renderItem(item([]));

    expect(screen.queryByTestId('menuItemBadges')).toBeNull();
  });

  it('stands in for a picture the product does not have', () => {
    renderItem(item(DIETS.slice(0, 1), { images: [] }));

    expect(screen.UNSAFE_queryByType(IconToolsKitchen2)).toBeTruthy();
    expect(screen.UNSAFE_queryByType(Image)).toBeNull();
  });

  it('keeps the image column even when there is no picture', () => {
    const columnWidth = () =>
      screen.getByTestId('menuItemImageColumn').props.style.width;

    const { unmount } = renderItem(item(DIETS.slice(0, 1)));
    const withImage = columnWidth();
    unmount();

    renderItem(item(DIETS.slice(0, 1), { images: [] }));

    // A card with no picture used to collapse its column to nothing, so its
    // name started where its neighbours' pictures did.
    expect(withImage).toBeGreaterThan(0);
    expect(columnWidth()).toBe(withImage);
  });

  it('gives the image the same width whatever the card holds', () => {
    const imageColumn = () =>
      screen.getByTestId('menuItemImageColumn').props.style;

    const { unmount } = renderItem(item(DIETS.slice(0, 1)));
    const narrow = imageColumn();
    unmount();

    renderItem(item(DIETS));
    const wide = imageColumn();

    expect(narrow.width).toBeGreaterThan(0);
    expect(wide.width).toBe(narrow.width);
    // A share of the row would grow with it; a fixed column does not.
    expect(narrow.flex).toBeUndefined();
  });
});
