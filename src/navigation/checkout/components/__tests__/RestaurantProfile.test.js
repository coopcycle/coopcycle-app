import React from 'react';
import moment from 'moment';
import { render, screen } from '@testing-library/react-native';

import i18n from '../../../../i18n';
import RestaurantProfile from '../RestaurantProfile';

const restaurant = {
  '@id': '/api/restaurants/1',
  name: 'My Cookiz',
  description: null,
  address: { streetAddress: '15 Rue Servan, Grenoble' },
  image: 'https://example.org/logo.png',
  bannerImage: 'https://example.org/banner.png',
  badges: [],
  tags: [],
};

// A slot opening shortly, so the shop counts as open rather than pre-order.
const timing = {
  delivery: {
    range: [
      moment().add(10, 'minutes').format(),
      moment().add(20, 'minutes').format(),
    ],
  },
};

// Far enough out to be a pre-order — more than 45 minutes — but still today.
const preOrderTiming = {
  delivery: {
    range: [
      moment().startOf('day').add(23, 'hours').format(),
      moment().startOf('day').add(23, 'hours').add(10, 'minutes').format(),
    ],
  },
};

const openingHoursSpecification = { currentTimeSlot: { timeSlot: null } };

// The screen fetches the timing and hands the shop down with it merged in,
// so the profile is rendered here the way the screen renders it: with the
// timing on the shop, or without it while the request is still out.
const renderProfile = shop =>
  render(
    <RestaurantProfile
      restaurant={shop}
      openingHoursSpecification={openingHoursSpecification}
      onInfo={jest.fn()}
    />,
  );

describe('RestaurantProfile', () => {
  it('stops outlining the delivery time once the timing lands', () => {
    renderProfile({ ...restaurant, timing });

    expect(screen.queryByTestId('timingBadgeSkeleton')).toBeNull();
  });

  it('leaves the delivery time outlined while the timing is on its way', () => {
    renderProfile(restaurant);

    expect(screen.getByTestId('timingBadgeSkeleton')).toBeTruthy();
  });

  it('leaves the description to the information modal', () => {
    // It is Markdown, and this screen has no Markdown renderer: it would be
    // shown with its asterisks. "More information" renders it properly.
    renderProfile({
      ...restaurant,
      timing,
      description: '**Coffeeshop 100% vegan !**',
    });

    expect(screen.queryByText(/Coffeeshop/)).toBeNull();
    // The address is still there, so this is not an empty render.
    expect(screen.getByText('15 Rue Servan, Grenoble')).toBeTruthy();
  });

  describe('in French', () => {
    // Switched around the whole block rather than inside the test: the render
    // has to be torn down before the language goes back, or the restore
    // re-renders a mounted tree outside act().
    let previous;

    beforeAll(async () => {
      previous = i18n.language;
      await i18n.changeLanguage('fr');
      moment.locale('fr');
    });

    afterAll(async () => {
      await i18n.changeLanguage(previous);
      moment.locale(previous);
    });

    it('names the delivery day inside the sentence, not as its own', () => {
      renderProfile({ ...restaurant, timing: preOrderTiming });

      // "pour une livraison aujourd'hui a 15:20", not "a Aujourd'hui a
      // 15:20": moment capitalises the day for a date standing on its own,
      // and the sentence already supplies whatever preposition it needs.
      expect(
        screen.getByText(/pour une livraison aujourd’hui/),
      ).toBeTruthy();
    });
  });
});
