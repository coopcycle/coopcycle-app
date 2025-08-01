export const selectAddresses = state => state.delivery.addresses;
export const selectAssertDeliveryError = state =>
  state.delivery.assertDeliveryError;
export const selectHasTimeSlot = state => state.delivery.timeSlots.length > 0;
export const selectPackages = state => state.delivery.packages;
export const selectPrice = state => state.delivery.price;
export const selectPriceExcludingTax = state =>
  state.delivery.priceExcludingTax;
export const selectStore = state => state.delivery.store;
export const selectStores = state => state.delivery.stores;
export const selectTimeSlotChoices = state => state.delivery.timeSlotChoices;
export const selectTimeSlots = state => state.delivery.timeSlots;
