import { renderHook, waitFor } from '@testing-library/react-native';
import moment from 'moment';

import useSetTaskListItems from '../useSetTaskListItems';

const mockState = {
  dispatch: {
    users: [
      { '@id': '/api/users/7', username: 'bob' },
      { '@id': '/api/users/8', username: 'alice' },
    ],
  },
};

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: selector => selector(mockState),
}));

jest.mock('../../selectors', () => ({
  selectAllTours: () => [],
  selectSelectedDate: () => require('moment')('2026-10-20'),
  selectToursTasksIndex: () => ({ tasks: {}, tours: {} }),
}));

// Only the selector: the rest of the module is real date arithmetic that the
// guards in the hook depend on.
jest.mock('../../../../../../utils/timezone', () => ({
  ...jest.requireActual('../../../../../../utils/timezone'),
  selectTimezone: () => 'Europe/Paris',
}));

jest.mock('../../../../../../i18n', () => ({ t: key => key }));

const mockSetTaskListItems = jest.fn();
const mockCreateTaskList = jest.fn();
const mockAddTaskListItems = jest.fn();
const mockRemoveTaskListItems = jest.fn();
const mockSetTourItems = jest.fn();

jest.mock('../../../../../../redux/api/slice', () => ({
  useSetTaskListItemsMutation: () => [mockSetTaskListItems, {}],
  useSetTourItemsMutation: () => [mockSetTourItems, {}],
  useCreateTaskListMutation: () => [mockCreateTaskList, {}],
  useAddTaskListItemsMutation: () => [mockAddTaskListItems, {}],
  useRemoveTaskListItemsMutation: () => [mockRemoveTaskListItems, {}],
}));

const task = (id, assignedTo = '') => ({
  '@id': `/api/tasks/${id}`,
  id,
  assignedTo,
  isAssigned: !!assignedTo,
  doneAfter: '2026-10-20T08:00:00+02:00',
  doneBefore: '2026-10-20T18:00:00+02:00',
});

/**
 * A list as a current instance serves it: carrying a version, which is what
 * tells the app the items endpoints are there.
 */
const taskList = ({ id, username, itemIds = [], version = 1 }) => ({
  '@id': `/api/task_lists/${id}`,
  id,
  username,
  itemIds,
  // The board indexes lists by both; `itemIds` is what gets written, while
  // `tasksIds` is what "which list holds this task" is answered from.
  tasksIds: itemIds,
  date: '2026-10-20',
  ...(version === null ? {} : { version }),
});

const setup = allTaskLists => {
  const tasksEntities = {};

  allTaskLists.forEach(list =>
    (list.itemIds ?? []).forEach(itemId => {
      tasksEntities[itemId] = task(itemId.split('/').pop(), list.username);
    }),
  );

  return { allTaskLists, tasksEntities };
};

beforeEach(() => {
  jest.clearAllMocks();
  mockSetTaskListItems.mockResolvedValue({ data: { '@id': '/api/task_lists/1', items: [] } });
  mockAddTaskListItems.mockResolvedValue({ data: { '@id': '/api/task_lists/1', items: [] } });
  mockRemoveTaskListItems.mockResolvedValue({ data: { '@id': '/api/task_lists/1', items: [] } });
  mockCreateTaskList.mockResolvedValue({ data: { '@id': '/api/task_lists/9' } });
});

describe('on an instance that has the items endpoints', () => {
  it('names only the task being assigned, not the whole list', async () => {
    const lists = [taskList({ id: 1, username: 'bob', itemIds: ['/api/tasks/10'] })];
    const { result } = renderHook(() => useSetTaskListItems(setup(lists)));

    await result.current.assignTask(task(11), { username: 'bob' });

    await waitFor(() => expect(mockAddTaskListItems).toHaveBeenCalled());

    expect(mockAddTaskListItems).toHaveBeenCalledWith({
      taskListUrl: '/api/task_lists/1',
      items: ['/api/tasks/11'],
    });
    // The whole point: the task already on the list is never mentioned, so a
    // board that had not heard of it cannot drop it.
    expect(mockSetTaskListItems).not.toHaveBeenCalled();
  });

  it('names only the task being unassigned', async () => {
    const lists = [
      taskList({ id: 1, username: 'bob', itemIds: ['/api/tasks/10', '/api/tasks/11'] }),
    ];
    const { result } = renderHook(() => useSetTaskListItems(setup(lists)));

    await result.current.unassignTask(task(10, 'bob'));

    await waitFor(() => expect(mockRemoveTaskListItems).toHaveBeenCalled());

    expect(mockRemoveTaskListItems).toHaveBeenCalledWith({
      taskListUrl: '/api/task_lists/1',
      items: ['/api/tasks/10'],
    });
    expect(mockSetTaskListItems).not.toHaveBeenCalled();
  });

  it('opens a list for a courier who holds none, then puts the task on it', async () => {
    const lists = [taskList({ id: 1, username: 'bob', itemIds: ['/api/tasks/10'] })];
    const { result } = renderHook(() => useSetTaskListItems(setup(lists)));

    await result.current.assignTask(task(11), { username: 'alice' });

    await waitFor(() => expect(mockAddTaskListItems).toHaveBeenCalled());

    expect(mockCreateTaskList).toHaveBeenCalledWith({
      courier: '/api/users/8',
      date: '2026-10-20',
    });
    expect(mockAddTaskListItems).toHaveBeenCalledWith({
      taskListUrl: '/api/task_lists/9',
      items: ['/api/tasks/11'],
    });
  });
});

describe('on an instance that predates them', () => {
  it('falls back to set_items, sending the whole list', async () => {
    const lists = [
      taskList({ id: 1, username: 'bob', itemIds: ['/api/tasks/10'], version: null }),
    ];
    const { result } = renderHook(() => useSetTaskListItems(setup(lists)));

    await result.current.assignTask(task(11), { username: 'bob' });

    await waitFor(() => expect(mockSetTaskListItems).toHaveBeenCalled());

    expect(mockSetTaskListItems).toHaveBeenCalledWith({
      items: ['/api/tasks/10', '/api/tasks/11'],
      username: 'bob',
      date: '2026-10-20',
    });
    expect(mockAddTaskListItems).not.toHaveBeenCalled();
  });
});
