function Task({
  id,
  ...props
}) {
  return {
    '@id': `/api/tasks/${id}`,
    id,
    ...props
  };
};

function TaskList({
  id,
  items,
  ...props
}) {
  return {
    '@id': `/api/task_lists/${id}`,
    id,
    items: items || [],
    ...props
  };
};

export const getTaskWithPrevious = usernames => (id, usernameId, previous = null) => {
  const username = usernames[usernameId];

  return Task({
    id,
    previous: previous ? `/api/tasks/${previous}` : null,
    assignedTo: username,
  });
}

export function getTaskWithAssignedTo(assignedTo) {
  return Task({
    assignedTo,
  });
}

export function getTaskWithStoreName(orgName) {
  return Task({
    orgName,
  });
}

export function getTaskWithTags(tags) {
  return Task({
    tags,
  });
}

export function getTaskWithStatus(status) {
  return Task({
    status,
  });
}

export function getTaskWithHasIncidents(hasIncidents) {
  return Task({
    hasIncidents,
  });
}

export const getTaskListWithItems = usernames => (id, items) => {
  const username = usernames[id];

  return TaskList({
    id,
    items,
    username,
  })
}
