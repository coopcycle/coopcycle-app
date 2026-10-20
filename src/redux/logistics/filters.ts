export const filterStatusDone = { status: 'DONE' };

export const filterStatusFailed = { status: 'FAILED' };

export const filterStatusCancelled = { status: 'CANCELLED' };

export const filterHasIncidents = { hasIncidents: true };

export const filterByKeyword = keyword => ({ keyword });

// TODO: unify key as "tag". It is used in courier/Tags.js view
export const filterByTag = tag => ({ tags: tag });

// Excludes the tasks carrying no tag at all. Soloing a tag uses it to narrow
// a screen down to that tag only.
export const filterUntagged = { untagged: true };
