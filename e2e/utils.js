export const describeif = condition => (condition ? describe : describe.skip);
export const itif = condition => (condition ? it : it.skip);
