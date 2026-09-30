import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import LinkifiedText from '../LinkifiedText';
import { openUrl } from '../../utils/url';

jest.mock('../../utils/url', () => ({
  openUrl: jest.fn(),
}));

describe('LinkifiedText', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the whole text', () => {
    const { getByText } = render(
      <LinkifiedText>{'call 06 12 34 56 78 please'}</LinkifiedText>,
    );

    expect(getByText(/call/)).toBeTruthy();
  });

  it('calls a phone number when tapped', () => {
    const { getByTestId } = render(
      <LinkifiedText>{'call 06 12 34 56 78 please'}</LinkifiedText>,
    );

    fireEvent.press(getByTestId('linkified-phone'));

    expect(openUrl).toHaveBeenCalledWith('tel:0612345678');
  });

  it('opens a url when tapped', () => {
    const { getByTestId } = render(
      <LinkifiedText>{'see https://example.com/form'}</LinkifiedText>,
    );

    fireEvent.press(getByTestId('linkified-url'));

    expect(openUrl).toHaveBeenCalledWith('https://example.com/form');
  });

  it('opens an email address when tapped', () => {
    const { getByTestId } = render(
      <LinkifiedText>{'write to john@example.com'}</LinkifiedText>,
    );

    fireEvent.press(getByTestId('linkified-email'));

    expect(openUrl).toHaveBeenCalledWith('mailto:john@example.com');
  });
});
