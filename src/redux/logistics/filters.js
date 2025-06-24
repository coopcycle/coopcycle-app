export const filterStatusDone = { status: 'DONE' };

export const filterStatusFailed = { status: 'FAILED' };

export const filterHasIncidents = { hasIncidents: true };

export const filterByKeyword = keyword => ({keyword});

// TODO: unify key as "tag". It is used in courier/Tags.js view
export const filterByTag = tag => ({tags: tag});
