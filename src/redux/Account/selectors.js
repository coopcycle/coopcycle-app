export const selectOrderAccessTokensById = (state, orderId) =>
  state.account.orderAccessTokens[orderId];
