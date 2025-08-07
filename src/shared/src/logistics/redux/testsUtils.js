function Task({
  assignedTo,
  hasIncidents,
  id,
  orgName,
  previous,
  status,
  tags,
  ...props
}) {
  return {
    '@id': `/api/tasks/${id}`,
    id,
    assignedTo: assignedTo || '',
    hasIncidents: hasIncidents || false,
    orgName: orgName || '',
    previous,
    status: status || '',
    tags: tags || [],
    ...props,
  };
}

function TaskList({ id, ...props }) {
  return {
    '@id': `/api/task_lists/${id}`,
    id,
    ...props,
  };
}

export const getTaskWithPrevious =
  usernames =>
  (id, usernameId, previous = null) => {
    const username = usernames[usernameId];

    return Task({
      id,
      previous: previous ? `/api/tasks/${previous}` : null,
      assignedTo: username,
    });
  };

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
    tags: tags.map(tag => ({ name: tag })),
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
    tasksIds: items.map(item => item['@id']),
    username,
  });
};
