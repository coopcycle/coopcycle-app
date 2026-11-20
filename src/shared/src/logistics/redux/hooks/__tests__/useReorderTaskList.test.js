import { renderHook, waitFor } from '@testing-library/react-native';

import useReorderTaskList, {
  canMove,
  locateInTaskList,
  MOVE_DOWN,
  MOVE_UP,
} from '../useReorderTaskList';

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
}));

jest.mock('../../../../../../i18n', () => ({ t: key => key }));

const mockSetTaskListOrder = jest.fn();

jest.mock('../../../../../../redux/api/slice', () => ({
  useSetTaskListOrderMutation: () => [mockSetTaskListOrder, {}],
}));

const TASK_LIST = '/api/task_lists/1';

const taskList = (itemIds, overrides = {}) => ({
  '@id': TASK_LIST,
  username: 'bob',
  itemIds,
  version: 4,
  ...overrides,
});

const task = (id, assignedTo = 'bob') => ({
  '@id': `/api/tasks/${id}`,
  assignedTo,
});

const THREE = [`/api/tasks/1`, `/api/tasks/2`, `/api/tasks/3`];

beforeEach(() => {
  jest.clearAllMocks();
  mockSetTaskListOrder.mockResolvedValue({
    data: { '@id': TASK_LIST, username: 'bob', items: THREE, version: 5 },
  });
});

describe('locateInTaskList', () => {
  it('finds a task that is itself an item of the list', () => {
    expect(locateInTaskList(task(2), [taskList(THREE)])).toMatchObject({
      index: 1,
    });
  });

  // The board flattens a tour into the tasks it carries, so such a row is not
  // an item of the list — its item is the tour. Moving it from here would
  // shift the whole tour, which is not what one arrow on one row means.
  it('does not locate a task that is on the list through a tour', () => {
    const lists = [taskList(['/api/tours/9', '/api/tasks/3'])];

    expect(locateInTaskList(task(2), lists)).toBeNull();
  });

  it('does not locate an unassigned task', () => {
    expect(locateInTaskList(task(2, ''), [taskList(THREE)])).toBeNull();
  });
});

describe('canMove', () => {
  it('refuses to move the first item up, or the last one down', () => {
    const lists = [taskList(THREE)];

    expect(canMove(task(1), lists, MOVE_UP)).toBe(false);
    expect(canMove(task(1), lists, MOVE_DOWN)).toBe(true);
    expect(canMove(task(3), lists, MOVE_DOWN)).toBe(false);
    expect(canMove(task(3), lists, MOVE_UP)).toBe(true);
  });

  it('refuses either direction for a task held by a tour', () => {
    const lists = [taskList(['/api/tours/9'])];

    expect(canMove(task(2), lists, MOVE_UP)).toBe(false);
    expect(canMove(task(2), lists, MOVE_DOWN)).toBe(false);
  });
});

describe('moveTask', () => {
  it('sends the whole list in the new order, with the version it was built from', async () => {
    const { result } = renderHook(() =>
      useReorderTaskList({ allTaskLists: [taskList(THREE)] }),
    );

    await result.current.moveTask(task(3), MOVE_UP);

    await waitFor(() => expect(mockSetTaskListOrder).toHaveBeenCalled());

    expect(mockSetTaskListOrder).toHaveBeenCalledWith({
      taskListUrl: TASK_LIST,
      items: ['/api/tasks/1', '/api/tasks/3', '/api/tasks/2'],
      version: 4,
    });
  });

  // /order refuses anything that changes membership, so a tour on the list has
  // to travel in the payload as the tour, not as the tasks it carries.
  it('keeps a tour in the payload as the tour', async () => {
    const items = ['/api/tasks/1', '/api/tours/9'];

    const { result } = renderHook(() =>
      useReorderTaskList({ allTaskLists: [taskList(items)] }),
    );

    await result.current.moveTask(task(1), MOVE_DOWN);

    await waitFor(() => expect(mockSetTaskListOrder).toHaveBeenCalled());

    expect(mockSetTaskListOrder.mock.calls[0][0].items).toEqual([
      '/api/tours/9',
      '/api/tasks/1',
    ]);
  });

  it('moves the row before the request, and keeps the server order after it', async () => {
    const { result } = renderHook(() =>
      useReorderTaskList({ allTaskLists: [taskList(THREE)] }),
    );

    await result.current.moveTask(task(1), MOVE_DOWN);

    const orders = mockDispatch.mock.calls.map(([a]) => a.payload.items);

    expect(orders[0]).toEqual([
      '/api/tasks/2',
      '/api/tasks/1',
      '/api/tasks/3',
    ]);
    expect(orders[orders.length - 1]).toEqual(THREE);
  });

  it('puts the order back when the list changed under us', async () => {
    mockSetTaskListOrder.mockResolvedValue({ error: { status: 409 } });

    const { result } = renderHook(() =>
      useReorderTaskList({ allTaskLists: [taskList(THREE)] }),
    );

    await result.current.moveTask(task(1), MOVE_DOWN);

    const orders = mockDispatch.mock.calls.map(([a]) => a.payload.items);

    // Rolled back to what we know was real rather than replaying our order,
    // which was built against a list that no longer exists.
    expect(orders[orders.length - 1]).toEqual(THREE);
  });

  it('does nothing at the ends of the list', async () => {
    const { result } = renderHook(() =>
      useReorderTaskList({ allTaskLists: [taskList(THREE)] }),
    );

    await result.current.moveTask(task(1), MOVE_UP);
    await result.current.moveTask(task(3), MOVE_DOWN);

    expect(mockSetTaskListOrder).not.toHaveBeenCalled();
    expect(mockDispatch).not.toHaveBeenCalled();
  });
});
