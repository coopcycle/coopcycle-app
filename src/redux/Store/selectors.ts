import _ from 'lodash';
import { createSelector } from '@reduxjs/toolkit';
import { selectTimeSlots } from '../Delivery/selectors';

export const selectStore = state => state.store.store;
export const selectDeliveries = state => state.store.deliveries;

export const selectTimeSlot = createSelector(
  selectStore,
  selectTimeSlots,
  (store, timeSlots) =>
    _.find(timeSlots, timeSlot => timeSlot['@id'] === store.timeSlot),
);
