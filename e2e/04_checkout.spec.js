import { connectToDemo, chooseOptionsIfNeeded } from './utils'

describe('Checkout', () => {

  beforeEach(async () => {
    await device.reloadReactNative()
  })

  it(`should complete checkout`, async () => {

    await connectToDemo()

    await expect(element(by.id('checkoutSearch'))).toBeVisible()
    await expect(element(by.id('restaurantList'))).toBeVisible()

    try {
        await expect(element(by.id('restaurantMatches:0'))).toBeVisible()
    } catch (e) {
        await waitFor(element(by.id('restaurantMatches:0')))
          .toBeVisible()
          .whileElement(by.id('restaurantList')).scroll(120, 'down')
    }

    await element(by.id('restaurantMatches:0')).tap()

    await waitFor(element(by.id('menu'))).toExist().withTimeout(5000)
    await waitFor(element(by.id('menuItem:0:0'))).toExist().withTimeout(5000)
    await waitFor(element(by.id('menuItem:0:1'))).toExist().withTimeout(5000)
    await waitFor(element(by.id('menuItem:0:2'))).toExist().withTimeout(5000)

    // Add item
    await element(by.id('menuItem:0:0')).tap()

    // Enter address
    await waitFor(element(by.id('addressModal'))).toExist().withTimeout(5000)
    await waitFor(element(by.id('addressModalTypeahead'))).toExist().withTimeout(5000)
    await element(by.id('addressModalTypeahead')).typeText('23 av claude vellefaux')
    await element(by.id('placeId:ChIJPSRadeBt5kcR4B2HzbBfZQE')).tap()

    await chooseOptionsIfNeeded()

    // Check if footer is present
    await waitFor(element(by.id('cartFooter'))).toExist().withTimeout(5000)
    await expect(element(by.id('cartFooter'))).toBeVisible()

    // Add 2 more items
    await element(by.id('menuItem:0:1')).tap()
    await chooseOptionsIfNeeded()

    await element(by.id('menuItem:0:2')).tap()
    await chooseOptionsIfNeeded()

    await waitFor(element(by.id('cartSubmit'))).toBeVisible().withTimeout(5000)
    await element(by.id('cartSubmit')).tap()

    await expect(element(by.id('cartSummarySubmit'))).toBeVisible()
    await element(by.id('cartSummarySubmit')).tap()

    await expect(element(by.id('loginUsername'))).toBeVisible()
    await expect(element(by.id('loginPassword'))).toBeVisible()

    await element(by.id('loginUsername')).typeText('user_1\n')
    await element(by.id('loginPassword')).typeText('user_1\n')

    try {
      await element(by.id('loginSubmit')).tap()
    } catch (e) {}

    await expect(element(by.id('checkoutTelephone'))).toBeVisible()
    await expect(element(by.id('moreInfosSubmit'))).toBeVisible()

    // Append "\n" to make sure virtual keybord is hidden after entry
    // https://github.com/wix/detox/issues/209
    await element(by.id('checkoutTelephone')).typeText('0612345678')
    await element(by.id('checkoutTelephone')).typeText('\n')

    await element(by.id('moreInfosSubmit')).tap()

    await element(by.id('cardholderName')).typeText('John Doe')

    // Tap the credit card input to make sure we can interact with it
    // Test Failed: View “<RCTUITextField: 0x7f9185939e00>” is not hittable at point “{"x":500,"y":20}”;
    // Point “{"x":530,"y":463.5}” is outside of window bounds
    await element(by.id('creditCardWrapper')).tap()

    await element(by.id('creditCardNumber')).typeText('4242424242424242')
    await element(by.id('creditCardExpiry')).typeText('1221')
    // Add "\n" to make sure keyboard is hidden
    await element(by.id('creditCardCvc')).typeText('123\n')

    await element(by.id('creditCardSubmit')).tap()

    // await expect(element(by.id('accountOrder'))).toBeVisible()
  })

})
