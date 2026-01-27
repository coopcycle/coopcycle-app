// https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications
// https://github.com/fastlane/fastlane/blob/3225bb6acf8936a756e26dca17d3d7ef5ab04dcd/frameit/lib/frameit/device_types.rb

// https://github.com/fastlane/fastlane/issues/29653
// https://github.com/JorgeFrias/Automated-AppStore-Screenshots_How-To

// https://github.com/Patrick-Kladek/ScreenshotFramer
// https://www.nutrient.io/blog/creating-an-efficient-app-store-screenshot-workflow/

// https://yuzu-hub.github.io/appscreen/

import {
  connectToCity,
  selectAutocompleteAddress,
  waitToBeVisible,
  waitToExist,
} from './support/commands';

const VARIANTS = [
  {
    locale: 'fr-FR',
    city: 'Grenoble',
    address: {
      text: '30 Av. Marcelin Berthelot, 38100 Grenoble, France',
      placeId: 'EjEzMCBBdi4gTWFyY2VsaW4gQmVydGhlbG90LCAzODEwMCBHcmVub2JsZSwgRnJhbmNlIjASLgoUChIJ-Yr9gur0ikcR0L7yDvuxXlYQHioUChIJL1Oqg-r0ikcR_QnOhrirHLs'
    },
  }
];

VARIANTS.forEach(variant => {
  describe('Screenshots', () => {

    const { locale, city, address } = variant;

    it(`takes screenshots for ${city} in ${locale}`, async () => {

      await connectToCity(city);

      await selectAutocompleteAddress('askAddressAutocomplete', address.text, address.placeId);

      // The server may be under maintenance
      try {
        await waitToBeVisible('restaurantList');

        await device.takeScreenshot(`Restaurants-${city}-${locale}`);

        await element(by.id('restaurants:0')).tap();

        await waitToExist('restaurantData');
        await waitToExist('menuItem:0:0');

        await device.takeScreenshot(`Restaurant-${city}-${locale}`);
      } catch (e) {}
    });
  });
});
