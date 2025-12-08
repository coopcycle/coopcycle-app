import { RootState } from '../store';

export const selectAddresses = (state: RootState) => state.delivery.addresses;
export const selectAssertDeliveryError = (state: RootState) =>
  state.delivery.assertDeliveryError;
export const selectHasTimeSlot = (state: RootState) =>
  state.delivery.timeSlots.length > 0;
export const selectPackages = (state: RootState) => state.delivery.packages;
export const selectPrice = (state: RootState) => state.delivery.price;
export const selectPriceExcludingTax = (state: RootState) =>
  state.delivery.priceExcludingTax;
export const selectStore = (state: RootState) => state.delivery.store;
export const selectStores = (state: RootState) => state.delivery.stores;
export const selectTimeSlots = (state: RootState) => state.delivery.timeSlots;
