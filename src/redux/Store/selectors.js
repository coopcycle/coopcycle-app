import _ from 'lodash';
import { createSelector } from 'reselect';

export const selectStore = state => state.store.store;
export const selectDeliveries = state => state.store.deliveries;
export const selectTimeSlots = state => state.store.timeSlots;

export const selectTimeSlot = createSelector(
  selectStore,
  selectTimeSlots,
  (store, timeSlots) =>
    _.find(timeSlots, timeSlot => timeSlot['@id'] === store.timeSlot),
);
