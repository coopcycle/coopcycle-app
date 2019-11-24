import { createSelector } from 'reselect'
import _ from 'lodash'

export const selectStore = state => state.store.store
export const selectDeliveries = state => state.store.deliveries
export const selectTimeSlots = state => state.store.timeSlots

export const selectTimeSlot = createSelector(
  selectStore,
  selectTimeSlots,
  (store, timeSlots) => _.find(timeSlots, timeSlot => timeSlot['@id'] === store.timeSlot)
)
