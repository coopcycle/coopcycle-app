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
