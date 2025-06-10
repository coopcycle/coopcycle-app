export const describeif = condition => (condition ? describe : describe.skip);
export const itif = condition => (condition ? it : it.skip);

export async function tapById(testID) {
    await expect(element(by.id(testID))).toBeVisible();
    await element(by.id(testID)).tap();
}

export async function tapByText(text) {
    await waitFor(element(by.text(text))).toBeVisible();
    await element(by.text(text)).tap();
}

export async function swipeRight(testID) {
    await expect(element(by.id(testID))).toBeVisible();
    await element(by.id(testID)).swipe('right');
}

export async function swipeLeft(testID) {
    await expect(element(by.id(testID))).toBeVisible();
    await element(by.id(testID)).swipe('left');
}

export async function waitForElement(elemId, timeout = 10000) {
  await waitFor(element(by.id(elemId))).toBeVisible().withTimeout(timeout);
}

export async function sleep(timeout) {
  return new Promise(resolve => setTimeout(resolve, timeout));
}
