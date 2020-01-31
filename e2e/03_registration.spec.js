import moment from 'moment'

import { connectToDemo } from './utils'

describe('Registration', () => {

  beforeEach(async () => {
    await device.reloadReactNative()
  })

  it('should be able to register', async () => {

    await connectToDemo()

    await expect(element(by.id('menuBtn'))).toBeVisible()
    await element(by.id('menuBtn')).tap()
    await element(by.id('drawerAccountBtn')).tap()

    await expect(element(by.id('loginOrRegister'))).toBeVisible()
    await element(by.id('loginOrRegister')).tap()

    const timestamp = moment().format('X')

    await element(by.id('registerForm.email')).typeText(`dev+${timestamp}@coopcycle.org`)
    await element(by.id('registerForm.username')).typeText(`dev${timestamp}`)
    // https://github.com/wix/detox/issues/916
    await element(by.id('registerForm.password')).replaceText('12345678')
    await element(by.id('registerForm.passwordConfirmation')).replaceText('12345678')

    await element(by.id('registerForm.givenName')).typeText('John')
    await element(by.id('registerForm.familyName')).typeText('Doe')

    await element(by.id('submitRegister')).tap()

    await expect(element(by.id('registerCheckEmail'))).toBeVisible()
  })
})
