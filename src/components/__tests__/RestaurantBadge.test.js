import { render, screen } from '@testing-library/react-native';
import React from 'react';

import i18n from '../../i18n';
import { RestaurantBadge } from '../RestaurantBadge';

describe('RestaurantBadge', () => {
  beforeAll(async () => {
    await i18n.changeLanguage('en');
  });

  it('names the promotion badge "On sale", like the website does', () => {
    render(<RestaurantBadge type="promotion" />);

    expect(screen.getByText('On sale')).toBeTruthy();
  });

  it('names the other badges after their type', () => {
    render(<RestaurantBadge type="zero-waste" />);

    expect(screen.getByText('Zero waste')).toBeTruthy();
  });
});
