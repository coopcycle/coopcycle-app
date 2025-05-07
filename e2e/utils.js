export const describeif = condition => (condition ? describe : describe.skip);
export const itif = condition => (condition ? it : it.skip);

export async function tap(testID) {
  await expect(element(by.id(testID))).toBeVisible();
  await element(by.id(testID)).tap();
}

export async function swipeRight(testID) {
  await expect(element(by.id(testID))).toBeVisible();
  await element(by.id(testID)).swipe('right');
}
