export const connectToDemo = async () => {

  await expect(element(by.id('chooseCityBtn'))).toBeVisible()
  await element(by.id('chooseCityBtn')).tap()

  await expect(element(by.id('moreServerOptions'))).toBeVisible()
  await element(by.id('moreServerOptions')).tap()

  await element(by.id('customServerURL')).typeText('demo.coopcycle.org')
  await element(by.id('submitCustomServer')).tap()

}

export const authenticateWithCredentials = async (username, password) => {

  await expect(element(by.id('menuBtn'))).toBeVisible()
  await element(by.id('menuBtn')).tap()
  await element(by.id('drawerAccountBtn')).tap()

  await element(by.id('loginUsername')).typeText(username)
  await element(by.id('loginPassword')).typeText(password)
  await element(by.id('loginSubmit')).tap()

}
