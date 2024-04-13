export const STATE = {
  NEW: 'new',
  ACCEPTED: 'accepted',
  REFUSED: 'refused',
  STARTED: 'started',
  READY: 'ready',
  FULFILLED: 'fulfilled',
  CANCELLED: 'cancelled',
};

export const EVENT = {
  CREATED: 'order:created',
  ACCEPTED: 'order:accepted',
  STATE_CHANGED: 'order:state_changed',
};
