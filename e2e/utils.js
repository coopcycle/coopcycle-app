export const connectToDemo = async () => {

  await expect(element(by.id('chooseCityBtn'))).toBeVisible()
  await element(by.id('chooseCityBtn')).tap()

  await expect(element(by.id('moreServerOptions'))).toBeVisible()
  await element(by.id('moreServerOptions')).tap()

  await element(by.id('customServerURL')).typeText('demo.coopcycle.org\n')

  try {
    // We deliberately add "\n" to hide the keyboard
    // The tap below shouldn't be necessary
    await element(by.id('submitCustomServer')).tap()
  } catch (e) {}

}

export const authenticateWithCredentials = async (username, password) => {

  await expect(element(by.id('menuBtn'))).toBeVisible()
  await element(by.id('menuBtn')).tap()
  await element(by.id('drawerAccountBtn')).tap()

  await element(by.id('loginUsername')).typeText(`${username}\n`)
  await element(by.id('loginPassword')).typeText(`${password}\n`)

  // As we are using "\n", the form may have been submitted yet
  try {
      await element(by.id('loginSubmit')).tap()
  } catch (e) {}

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

export const chooseOptionsIfNeeded = async () => {
  try {

    // This means the product options modal is visible
    await waitFor(element(by.text('Choose options'))).toBeVisible().withTimeout(1000)

    // As there is no way to know the number of sections,
    // we try with 100 sections
    for (let section = 0; section < 100; section++) {
      try {
        await waitFor(element(by.id('addProductWithOptions'))).toBeVisible().withTimeout(1000)
        await element(by.id('addProductWithOptions')).tap()
        break
      } catch (e) {
        await element(by.id(`productOptions:${section}:0`)).tap()
      }
    }

  } catch (e) {
    // next step in case the element is not displayed
  }
}
