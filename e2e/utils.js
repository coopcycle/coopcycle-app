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

export const logout = async (username, password) => {

  // await expect(element(by.id('menuBtn'))).toBeVisible()
  // await waitFor(element(by.id('menuBtn'))).toExist().withTimeout(5000)

  // Multiple elements were matched: (
  //     "<RCTView:0x7fd151feba00; AX=Y; AX.id='menuBtn'; AX.label='\Uf32a'; AX.frame={{0, 3001.5}, {61, 41}}; AX.activationPoint={30.5, 3022}; AX.traits='UIAccessibilityTraitNone'; AX.focused='N'; frame={{0, 1.5}, {61, 41}}; opaque; alpha=1>",
  //     "<RCTView:0x7fd155a60320; AX=Y; AX.id='menuBtn'; AX.label='\Uf32a'; AX.frame={{0, 21.5}, {61, 41}}; AX.activationPoint={30.5, 42}; AX.traits='UIAccessibilityTraitNone'; AX.focused='N'; frame={{0, 1.5}, {61, 41}}; opaque; alpha=1>",
  //     "<RCTView:0x7fd151ea12d0; AX=Y; AX.id='menuBtn'; AX.label='\Uf32a'; AX.frame={{0, 3001.5}, {61, 41}}; AX.activationPoint={30.5, 3022}; AX.traits='UIAccessibilityTraitNone'; AX.focused='N'; frame={{0, 1.5}, {61, 41}}; opaque; alpha=1>"
  // ). Please use selection matchers to narrow the selection down to single element.
  // await element(by.id('menuBtn')).atIndex(0).tap()

  await element(by.id('drawerAccountBtn')).tap()

  await element(by.id('logout')).tap()

}
