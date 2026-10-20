import {
  isServerTaskList,
  supportsTaskListItemsApi,
} from '../taskListUtils';

const serverList = (props = {}) => ({
  '@id': '/api/task_lists/1',
  username: 'bob',
  ...props,
});

describe('isServerTaskList', () => {
  it('recognises a list the server gave us', () => {
    expect(isServerTaskList(serverList())).toBe(true);
  });

  it('rejects the placeholder built for a courier holding nothing', () => {
    expect(isServerTaskList({ '@id': 'temp_bob' })).toBe(false);
  });

  it('rejects the unassigned-tasks pseudo list', () => {
    expect(
      isServerTaskList({ '@id': 'unassigned_tasks-/api/tasks/1' }),
    ).toBe(false);
  });

  it('does not fall over on a list with no @id', () => {
    expect(isServerTaskList({})).toBe(false);
    expect(isServerTaskList(undefined)).toBe(false);
  });
});

describe('supportsTaskListItemsApi', () => {
  it('says yes when a list carries a version', () => {
    expect(supportsTaskListItemsApi([serverList({ version: 1 })])).toBe(true);
  });

  it('says no when the lists carry none', () => {
    expect(supportsTaskListItemsApi([serverList()])).toBe(false);
  });

  // The upgrade is what this is for: one fresh list is enough, so a list
  // cached from before it does not keep us on set_items.
  it('says yes when only one of several carries a version', () => {
    expect(
      supportsTaskListItemsApi([
        serverList({ '@id': '/api/task_lists/1' }),
        serverList({ '@id': '/api/task_lists/2', version: 3 }),
      ]),
    ).toBe(true);
  });

  // A placeholder never carries a version, on any instance. Counting it would
  // make a board that happens to show an empty courier look like an old one.
  it('ignores the placeholder lists', () => {
    expect(
      supportsTaskListItemsApi([
        { '@id': 'temp_bob', version: 1 },
        serverList({ version: 1 }),
      ]),
    ).toBe(true);
    expect(supportsTaskListItemsApi([{ '@id': 'temp_bob' }])).toBe(false);
  });

  it('says no when there is nothing to go on', () => {
    expect(supportsTaskListItemsApi([])).toBe(false);
    expect(supportsTaskListItemsApi(undefined)).toBe(false);
  });

  // Zero is a real version, and `!taskList.version` would have read it as an
  // instance that does not support the endpoints at all.
  it('treats version 0 as a version', () => {
    expect(supportsTaskListItemsApi([serverList({ version: 0 })])).toBe(true);
  });
});
