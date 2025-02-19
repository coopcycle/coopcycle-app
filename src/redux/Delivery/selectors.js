export const selectAddresses = state => state.delivery.addresses;
export const selectAssertDeliveryError = state => state.delivery.assertDeliveryError;
export const selectHasTimeSlot = state => state.delivery.timeSlots.length > 0;
export const selectPackages = state => state.delivery.packages;
export const selectStore = state => state.delivery.store;
export const selectTimeSlotChoices = state => state.delivery.timeSlotChoices;
export const selectTimeSlots = state => state.delivery.timeSlots;
