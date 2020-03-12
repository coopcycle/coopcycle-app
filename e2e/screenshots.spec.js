const VARIANTS = [
  { locale: 'fr-FR', city: 'Poitiers' },
  { locale: 'fr-FR', city: 'Montpellier' },
  { locale: 'fr-FR', city: 'Grenoble' },
  { locale: 'es-ES', city: 'Madrid' },
  { locale: 'en-US', city: 'Berlin' },
]

VARIANTS.forEach(variant => {

  describe('Screenshots', () => {

    const { locale, city } = variant

    beforeEach(async () => {
      await device.relaunchApp({
        newInstance: true,
        permissions: {
          notifications: 'YES',
        },
        delete: true,
        languageAndLocale: {
          language: locale,
          locale
        }
      })
      await device.reloadReactNative()
    })

    it(`takes screenshots for ${city} in ${locale}`, async () => {

      await expect(element(by.id('chooseCityBtn'))).toBeVisible()

      await device.takeScreenshot(`Home-${locale}`);

      await element(by.id('chooseCityBtn')).tap()

      await expect(element(by.id(city))).toBeVisible()
      await element(by.id(city)).tap()

      await expect(element(by.id('checkoutSearch'))).toBeVisible()
      await expect(element(by.id('restaurantList'))).toBeVisible()
      await waitFor(element(by.id('restaurants:2'))).toBeVisible()

      await device.takeScreenshot(`Restaurants-${city}-${locale}`)

      await element(by.id('restaurants:2')).tap()

      await waitFor(element(by.id('menu'))).toExist().withTimeout(5000)
      await waitFor(element(by.id('menuItem:0:0'))).toExist().withTimeout(5000)

      await device.takeScreenshot(`Restaurant-${city}-${locale}`)
    })

  })
})
