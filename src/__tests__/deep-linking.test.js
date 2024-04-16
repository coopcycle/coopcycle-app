import { pathUtils } from '@react-navigation/core';
import { URI_PREFIX } from '../navigation/constants';

describe('Deep linking', () => {
  it.skip('opens URLs without a dash', () => {
    const parsedUrl = pathUtils.urlToPathAndParams(
      'https://foo.coopcycle.org/register/confirm/abcdef123456',
      URI_PREFIX,
    );
    expect(parsedUrl).toBeTruthy();
    expect(parsedUrl.path).toBe('/register/confirm/abcdef123456');
  });

  it.skip('opens URLs with a dash', () => {
    const parsedUrl = pathUtils.urlToPathAndParams(
      'https://foo-bar.coopcycle.org/register/confirm/abcdef123456',
      URI_PREFIX,
    );
    expect(parsedUrl).toBeTruthy();
    expect(parsedUrl.path).toBe('/register/confirm/abcdef123456');
  });

  it.skip('opens URLs for custom domains', () => {
    const domains = ['livraison.sicklo.fr', 'khora.berlin'];
    domains.forEach(domain => {
      const parsedUrl = pathUtils.urlToPathAndParams(
        `https://${domain}/register/confirm/abcdef123456`,
        URI_PREFIX,
      );
      expect(parsedUrl).toBeTruthy();
      expect(parsedUrl.path).toBe('/register/confirm/abcdef123456');
    });
  });
});
