const VARIANTS = [
  { locale: 'fr-FR', city: 'Strasbourg' },
  { locale: 'fr-FR', city: 'Nantes - Naofood' },
  { locale: 'fr-FR', city: 'Grenoble' },
  { locale: 'es-ES', city: 'Barcelona' },
  { locale: 'es-ES', city: 'Madrid' },
  { locale: 'es-ES', city: 'Zaragoza' },
];
const wait = (n) => new Promise((resolve) => setTimeout(resolve, n));
VARIANTS.forEach(variant => {
  describe('Screenshots', () => {
    const { locale, city } = variant;

    beforeEach(async () => {
      await device.launchApp({
        newInstance: true,
        permissions: {
          notifications: 'YES',
        },
        delete: true,
        languageAndLocale: {
          language: locale,
          locale,
        },
      });
      await device.reloadReactNative();
    });

    it(`takes screenshots for ${city} in ${locale}`, async () => {


      await expect(element(by.id('chooseCityBtn'))).toBeVisible();

      await device.takeScreenshot(`Home-${locale}`);

      await element(by.id('chooseCityBtn')).tap();

      await device.takeScreenshot(`Cities-${locale}`);

      await waitFor(element(by.id(city)))
        .toBeVisible()
        .whileElement(by.id('cityList'))
        .scroll(120, 'down');

      await element(by.id(city)).tap();

      // The server may be under maintenance

      await waitFor(element(by.id('checkoutAskAddress'))).toBeVisible();
      await expect(element(by.id('askAddressAutocomplete'))).toBeVisible();

      await element(by.id('askAddressAutocomplete')).typeText('1 Parc de l\'Etoile');
      await element(by.id(/placeId:.+/)).atIndex(0).tap();

      // LEGACY
      await expect(element(by.id('restaurantList'))).toBeVisible();
      await waitFor(element(by.id('restaurants:0'))).toBeVisible();

      await device.takeScreenshot(`Restaurants-${city}-${locale}`);

      await element(by.id('restaurants:0')).tap();

      await waitFor(element(by.id('menu')))
        .toExist()
        .withTimeout(5000);
      await waitFor(element(by.id('menuItem:0:0')))
        .toExist()
        .withTimeout(5000);

      await device.takeScreenshot(`Restaurant-${city}-${locale}`);
      // END LEGACY

    });
  });
});
